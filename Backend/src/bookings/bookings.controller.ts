import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, UseGuards,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto, UpdateBookingStatusDto } from './dto/booking.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../users/user.entity';
import { BookingStatus } from './booking.entity';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  /**
   * GET /api/v1/bookings/availability?service_id=...&scheduled_start=...
   * Consumer checks available technicians for a time slot
   */
  @Get('availability')
  @UseGuards(RolesGuard)
  @Roles(UserRole.CONSUMER)
  getAvailability(
    @Query('service_id') serviceId: string,
    @Query('scheduled_start') scheduledStart: string,
  ) {
    return this.bookingsService.getAvailableTechnicians(serviceId, scheduledStart);
  }

  /**
   * GET /api/v1/bookings/my — Consumer's own bookings
   */
  @Get('my')
  @UseGuards(RolesGuard)
  @Roles(UserRole.CONSUMER)
  getMyBookings(@CurrentUser() user: any) {
    return this.bookingsService.getMyBookings(user.id);
  }

  /**
   * GET /api/v1/bookings/agenda — Technician's today's jobs
   */
  @Get('agenda')
  @UseGuards(RolesGuard)
  @Roles(UserRole.TECHNICIAN)
  getTechnicianAgenda(@CurrentUser() user: any) {
    return this.bookingsService.getTechnicianAgenda(user.id);
  }

  /**
   * GET /api/v1/bookings/unassigned — Job board for technicians
   */
  @Get('unassigned')
  @UseGuards(RolesGuard)
  @Roles(UserRole.TECHNICIAN)
  getUnassignedJobs() {
    return this.bookingsService.getUnassignedJobs();
  }

  /**
   * POST /api/v1/bookings/:id/claim — Technician claims a job
   */
  @Post(':id/claim')
  @UseGuards(RolesGuard)
  @Roles(UserRole.TECHNICIAN)
  claimJob(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.bookingsService.claimJob(id, user.id);
  }

  /**
   * POST /api/v1/bookings — Create a new booking (CONSUMER only)
   * Returns { booking_id, client_secret } for Stripe checkout
   */
  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.CONSUMER)
  createBooking(@CurrentUser() user: any, @Body() dto: CreateBookingDto) {
    return this.bookingsService.createBooking(user.id, dto);
  }

  /**
   * PATCH /api/v1/bookings/:id/status — Technician updates job state
   * Allowed: CONFIRMED → IN_PROGRESS → COMPLETED
   */
  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.TECHNICIAN)
  updateStatus(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() dto: UpdateBookingStatusDto,
  ) {
    return this.bookingsService.updateStatus(
      id,
      user.id,
      dto.status as BookingStatus,
    );
  }

  /**
   * DELETE /api/v1/bookings/:id — Cancel a booking
   */
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.CONSUMER, UserRole.ADMIN)
  cancelBooking(@Param('id') id: string) {
    return this.bookingsService.cancelBooking(id);
  }
}
