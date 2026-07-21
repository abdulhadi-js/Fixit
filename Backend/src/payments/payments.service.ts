import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { Transaction, TransactionStatus } from './transaction.entity';
import { BookingsService } from '../bookings/bookings.service';

@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe;
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
    @Inject(forwardRef(() => BookingsService))
    private readonly bookingsService: BookingsService,
    private readonly config: ConfigService,
  ) {
    this.stripe = new Stripe(this.config.get<string>('STRIPE_SECRET_KEY') as string, {
      apiVersion: '2026-06-24.dahlia',
    });
  }

  /**
   * Creates a Stripe PaymentIntent with capture_method='manual'.
   * Places an authorization hold — no actual charge yet.
   */
  async createPaymentIntent(
    bookingId: string,
    amountPkr: number,
  ): Promise<{ client_secret: string }> {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amountPkr * 100, // Stripe requires smallest currency unit
      currency: 'pkr',
      capture_method: 'manual',
      payment_method_types: ['card'],
      metadata: { booking_id: bookingId },
    });

    await this.transactionRepo.save({
      booking_id: bookingId,
      stripe_payment_intent_id: paymentIntent.id,
      amount: amountPkr,
      status: TransactionStatus.HOLD,
    });

    this.logger.log(`Payment hold created for booking ${bookingId}: ${paymentIntent.id}`);

    // Stripe client_secret can be null before confirmation — we assert non-null
    return { client_secret: paymentIntent.client_secret! };
  }

  /**
   * Captures the authorized hold — called when technician marks job COMPLETED.
   */
  async capturePayment(bookingId: string): Promise<void> {
    const transaction = await this.transactionRepo.findOne({
      where: { booking_id: bookingId },
    });

    if (!transaction) {
      throw new NotFoundException(`No transaction found for booking ${bookingId}`);
    }

    await this.stripe.paymentIntents.capture(transaction.stripe_payment_intent_id);
    await this.transactionRepo.update(transaction.id, { status: TransactionStatus.CAPTURED });

    this.logger.log(`Payment captured for booking ${bookingId}`);
  }

  /**
   * Cancels/refunds a payment — called when booking is cancelled.
   */
  async refundPayment(bookingId: string): Promise<void> {
    const transaction = await this.transactionRepo.findOne({
      where: { booking_id: bookingId },
    });

    if (!transaction) return;

    if (transaction.status === TransactionStatus.CAPTURED) {
      await this.stripe.refunds.create({
        payment_intent: transaction.stripe_payment_intent_id,
      });
    } else {
      await this.stripe.paymentIntents.cancel(transaction.stripe_payment_intent_id);
    }

    await this.transactionRepo.update(transaction.id, { status: TransactionStatus.REFUNDED });
    this.logger.log(`Payment refunded for booking ${bookingId}`);
  }

  /**
   * Stripe Webhook handler — must use raw body for signature verification.
   */
  async handleWebhook(rawBody: Buffer | undefined, signature: string): Promise<void> {
    const webhookSecret = this.config.get<string>('STRIPE_WEBHOOK_SECRET') as string;
    let event: Stripe.Event;

    if (!rawBody) {
      throw new InternalServerErrorException('Missing raw body for webhook verification');
    }

    try {
      event = this.stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (err: any) {
      this.logger.error(`Webhook signature verification failed: ${err.message}`);
      throw new InternalServerErrorException('Invalid webhook signature');
    }

    switch (event.type) {
      case 'payment_intent.amount_capturable_updated': {
        const intent = event.data.object as Stripe.PaymentIntent;
        const bookingId = intent.metadata?.booking_id;
        if (bookingId) {
          await this.bookingsService.confirmBooking(bookingId);
          this.logger.log(`Booking ${bookingId} confirmed via webhook`);
        }
        break;
      }
      case 'payment_intent.canceled': {
        const intent = event.data.object as Stripe.PaymentIntent;
        const bookingId = intent.metadata?.booking_id;
        if (bookingId) {
          await this.bookingsService.cancelBooking(bookingId, 'webhook_system', 'ADMIN' as any);
        }
        break;
      }
      default:
        this.logger.log(`Unhandled Stripe event: ${event.type}`);
    }
  }

  /** Consumer payment history */
  async getConsumerTransactions(consumerId: string) {
    return this.transactionRepo
      .createQueryBuilder('t')
      .innerJoinAndSelect('t.booking', 'b')
      .where('b.consumer_id = :consumerId', { consumerId })
      .orderBy('t.updated_at', 'DESC')
      .getMany();
  }

  /** Technician weekly earnings summary */
  async getTechnicianEarnings(technicianId: string) {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const results = await this.transactionRepo
      .createQueryBuilder('t')
      .innerJoin('t.booking', 'b')
      .select('SUM(t.amount)', 'total_earnings_pkr')
      .addSelect('COUNT(t.id)', 'completed_jobs')
      .where('b.technician_id = :technicianId', { technicianId })
      .andWhere('t.status = :status', { status: TransactionStatus.CAPTURED })
      .andWhere('t.updated_at BETWEEN :weekStart AND :weekEnd', { weekStart, weekEnd })
      .getRawOne();

    return {
      week_start: weekStart.toISOString().split('T')[0],
      week_end: weekEnd.toISOString().split('T')[0],
      total_earnings_pkr: parseInt(results?.total_earnings_pkr ?? '0'),
      completed_jobs: parseInt(results?.completed_jobs ?? '0'),
    };
  }
}
