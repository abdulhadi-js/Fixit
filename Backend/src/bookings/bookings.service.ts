import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, IsNull, Not } from 'typeorm';
import { Booking, BookingStatus } from './booking.entity';
import { ServicesService } from '../services/services.service';
import { UsersService } from '../users/users.service';
import { PaymentsService } from '../payments/payments.service';
import { UserRole } from '../users/user.entity';
import { CreateBookingDto } from './dto/booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
    private readonly servicesService: ServicesService,
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => PaymentsService))
    private readonly paymentsService: PaymentsService,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Get available technicians for a given service and time window.
   * Returns technicians who have NO overlapping confirmed booking.
   */
  async getAvailableTechnicians(serviceId: string, scheduledStart: string) {
    const service = await this.servicesService.findOne(serviceId);
    const startTime = new Date(scheduledStart);
    if (isNaN(startTime.getTime())) {
      throw new BadRequestException('Invalid date format for scheduledStart');
    }
    const endTime = new Date(
      startTime.getTime() + service.estimated_duration_mins * 60 * 1000,
    );

    const tsRange = `[${startTime.toISOString()}, ${endTime.toISOString()})`;

    const busyTechnicianIds = await this.dataSource.query(
      `SELECT technician_id FROM bookings 
       WHERE scheduled_time && $1::tsrange 
       AND status NOT IN ('CANCELLED')`,
      [tsRange],
    );

    const busyIds: string[] = busyTechnicianIds.map((r: any) => r.technician_id);

    const query = this.dataSource
      .getRepository('users')
      .createQueryBuilder('u')
      .select(['u.id', 'u.full_name'])
      .where('u.role = :role', { role: UserRole.TECHNICIAN })
      .andWhere('u.is_verified = true');

    if (busyIds.length > 0) {
      query.andWhere('u.id NOT IN (:...busyIds)', { busyIds });
    }

    return query.getRawMany();
  }

  /**
   * Create a new booking. The PostgreSQL GiST exclusion constraint will
   * automatically throw a 23P01 error if the slot is already taken.
   */
  async createBooking(
    consumerId: string,
    dto: CreateBookingDto,
  ): Promise<{ booking: Booking, client_secret: string }> {
    const service = await this.servicesService.findOne(dto.service_id);
    if (dto.technician_id) {
      const technician = await this.usersService.findByIdOrFail(dto.technician_id);
      if (technician.role !== UserRole.TECHNICIAN) {
        throw new BadRequestException('Selected user is not a technician');
      }
    }

    const startTime = new Date(dto.scheduled_start);
    if (isNaN(startTime.getTime())) {
      throw new BadRequestException('Invalid date format for scheduledStart');
    }
    const endTime = new Date(
      startTime.getTime() + service.estimated_duration_mins * 60 * 1000,
    );
    const scheduledTime = `[${startTime.toISOString()}, ${endTime.toISOString()})`;

    let booking;
    try {
      booking = this.bookingRepo.create({
        consumer_id: consumerId,
        technician_id: dto.technician_id || null,
        service_id: dto.service_id,
        scheduled_time: scheduledTime,
        address_details: dto.address_details,
        status: dto.payment_method === 'CASH' ? BookingStatus.CONFIRMED : BookingStatus.PENDING_PAYMENT,
        estimated_amount: dto.estimated_amount || service.base_price,
        payment_method: dto.payment_method || 'CARD',
      });

      booking = await this.bookingRepo.save(booking);
    } catch (error: any) {
      if (error?.code === '23P01') {
        throw new ConflictException(
          'This technician is already booked for the selected time slot. Please choose another slot.',
        );
      }
      throw error;
    }

    if (booking.payment_method === 'CASH') {
      return { booking, client_secret: '' };
    }

    const finalAmount = dto.estimated_amount || service.base_price;
    const paymentIntent = await this.paymentsService.createPaymentIntent(booking.id, finalAmount);
    return {
      booking,
      client_secret: paymentIntent.client_secret,
    };
  }

  /** Consumer's own booking history */
  async getMyBookings(consumerId: string): Promise<Booking[]> {
    return this.bookingRepo.find({
      where: { consumer_id: consumerId },
      relations: { service: true, technician: true },
      order: { status: 'ASC' },
    });
  }

  /** Job board: All bookings with no technician assigned (open for claiming) */
  async getUnassignedJobs(): Promise<Booking[]> {
    return this.bookingRepo.find({
      where: [
        // Cash bookings go straight to CONFIRMED with no technician
        { technician_id: IsNull(), status: BookingStatus.CONFIRMED },
        // Card bookings that have been paid but not yet claimed
        { technician_id: IsNull(), status: BookingStatus.PENDING_PAYMENT },
      ],
      relations: { service: true, consumer: true },
      order: { created_at: 'DESC' },
    });
  }

  /** Technician claims a job */
  async claimJob(bookingId: string, technicianId: string): Promise<Booking> {
    const booking = await this.bookingRepo.findOne({ where: { id: bookingId } });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    if (booking.technician_id) {
      throw new BadRequestException('Booking is already assigned to a technician');
    }
    
    booking.technician_id = technicianId;
    return this.bookingRepo.save(booking);
  }

  /** Technician's upcoming jobs — next 7 days so newly claimed jobs always appear */
  async getTechnicianAgenda(technicianId: string): Promise<any[]> {
    const now = new Date();
    // Start from beginning of today
    const rangeStart = new Date(now);
    rangeStart.setHours(0, 0, 0, 0);
    // Show next 7 days
    const rangeEnd = new Date(now);
    rangeEnd.setDate(rangeEnd.getDate() + 7);
    rangeEnd.setHours(23, 59, 59, 999);

    return this.dataSource.query(
      `SELECT b.*, sc.title as service_title, sc.base_price,
              u.full_name as consumer_name, u.phone_number as consumer_phone
       FROM bookings b
       JOIN service_categories sc ON b.service_id = sc.id
       JOIN users u ON b.consumer_id = u.id
       WHERE b.technician_id = $1
         AND b.status IN ('CONFIRMED', 'IN_PROGRESS')
         AND lower(b.scheduled_time) >= $2
         AND lower(b.scheduled_time) <= $3
       ORDER BY lower(b.scheduled_time) ASC`,
      [technicianId, rangeStart.toISOString(), rangeEnd.toISOString()],
    );
  }

  /** Update booking status — enforces state machine rules */
  async updateStatus(
    bookingId: string,
    technicianId: string,
    newStatus: BookingStatus,
  ): Promise<Booking | null> {
    const booking = await this.bookingRepo.findOne({ where: { id: bookingId } });
    if (!booking) throw new NotFoundException(`Booking ${bookingId} not found`);

    if (booking.technician_id !== technicianId) {
      throw new ForbiddenException('You are not assigned to this booking');
    }

    const validTransitions: Record<string, BookingStatus[]> = {
      [BookingStatus.CONFIRMED]: [BookingStatus.IN_PROGRESS],
      [BookingStatus.IN_PROGRESS]: [BookingStatus.COMPLETED],
    };

    const allowed = validTransitions[booking.status] ?? [];
    if (!allowed.includes(newStatus)) {
      throw new BadRequestException(
        `Cannot transition from ${booking.status} to ${newStatus}`,
      );
    }

    await this.bookingRepo.update(bookingId, { status: newStatus });
    
    // Capture payment if the job is now completed AND was paid by CARD
    if (newStatus === BookingStatus.COMPLETED && booking.payment_method === 'CARD') {
      await this.paymentsService.capturePayment(bookingId);
    }

    return this.bookingRepo.findOne({ where: { id: bookingId } });
  }

  /** Confirm booking after Stripe authorization */
  async confirmBooking(bookingId: string): Promise<void> {
    await this.bookingRepo.update(bookingId, { status: BookingStatus.CONFIRMED });
  }

  /** Cancel booking */
  async cancelBooking(bookingId: string, currentUserId: string, currentUserRole: UserRole): Promise<void> {
    const booking = await this.bookingRepo.findOne({ where: { id: bookingId } });
    if (!booking) throw new NotFoundException('Booking not found');
    
    if (currentUserRole !== UserRole.ADMIN && booking.consumer_id !== currentUserId) {
      throw new ForbiddenException('You are not authorized to cancel this booking');
    }
    await this.bookingRepo.update(bookingId, { status: BookingStatus.CANCELLED });
    await this.paymentsService.refundPayment(bookingId);
  }

  /** Consumer marks a job as completed (Cash payments) */
  async completeByConsumer(bookingId: string, consumerId: string): Promise<Booking> {
    const booking = await this.bookingRepo.findOne({ where: { id: bookingId } });
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.consumer_id !== consumerId) {
      throw new ForbiddenException('You can only update your own bookings');
    }
    
    if (booking.status === BookingStatus.COMPLETED) {
      throw new BadRequestException('Booking is already completed');
    }

    if (booking.status !== BookingStatus.IN_PROGRESS) {
      throw new BadRequestException('Booking must be IN_PROGRESS before it can be completed');
    }

    if (booking.payment_method !== 'CASH') {
      throw new BadRequestException('Only CASH payment jobs can be manually marked complete by the consumer');
    }

    await this.bookingRepo.update(bookingId, { status: BookingStatus.COMPLETED });
    
    const updated = await this.bookingRepo.findOne({ where: { id: bookingId } });
    return updated!;
  }

  async findById(id: string): Promise<Booking> {
    const booking = await this.bookingRepo.findOne({
      where: { id },
      relations: { service: true },
    });
    if (!booking) throw new NotFoundException(`Booking ${id} not found`);
    return booking;
  }
}
