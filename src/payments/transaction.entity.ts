import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Booking } from '../bookings/booking.entity';

export enum TransactionStatus {
  HOLD = 'HOLD',
  CAPTURED = 'CAPTURED',
  REFUNDED = 'REFUNDED',
}

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Booking, { eager: false })
  @JoinColumn({ name: 'booking_id' })
  booking: Booking;

  @Column({ name: 'booking_id' })
  booking_id: string;

  @Column({ type: 'text', unique: true })
  stripe_payment_intent_id: string;

  @Column({ type: 'int' })
  amount: number; // Exact PKR amount

  @Column({
    type: 'enum',
    enum: TransactionStatus,
  })
  status: TransactionStatus;

  @UpdateDateColumn()
  updated_at: Date;
}
