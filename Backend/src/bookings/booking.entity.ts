import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { ServiceCategory } from '../services/service-category.entity';

export enum BookingStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface AddressDetails {
  area: string;
  street: string;
  house: string;
}

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'consumer_id' })
  consumer: User;

  @Column({ name: 'consumer_id' })
  consumer_id: string;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'technician_id' })
  technician: User | null;

  @Column({ name: 'technician_id', nullable: true })
  technician_id: string | null;

  @ManyToOne(() => ServiceCategory, { eager: true })
  @JoinColumn({ name: 'service_id' })
  service: ServiceCategory;

  @Column({ name: 'service_id' })
  service_id: string;

  /**
   * Stored as PostgreSQL tsrange: '[2026-07-01 10:00, 2026-07-01 12:00)'
   * The GiST exclusion constraint is added via raw SQL migration to prevent
   * double-booking the same technician for overlapping time slots.
   */
  @Column({ type: 'tsrange' })
  scheduled_time: string;

  @Column({ type: 'jsonb' })
  address_details: AddressDetails;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING_PAYMENT,
  })
  status: BookingStatus;

  @Column({ type: 'int', nullable: true })
  estimated_amount: number;

  @Column({ type: 'varchar', default: 'CARD' })
  payment_method: string;
}
