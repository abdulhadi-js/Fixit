import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

export enum UserRole {
  CONSUMER = 'CONSUMER',
  TECHNICIAN = 'TECHNICIAN',
  ADMIN = 'ADMIN',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  full_name: string;

  @Column({ type: 'varchar', length: 15, unique: true })
  phone_number: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column({ type: 'text' })
  password_hash: string;

  @Column({ type: 'boolean', default: false })
  is_verified: boolean;

  @Column({ type: 'varchar', length: 6, nullable: true })
  otp_code: string | null;

  @Column({ type: 'timestamp', nullable: true })
  otp_expires_at: Date | null;

  /**
   * Hashed refresh token stored server-side.
   * Null when user is logged out. Validated on every /auth/refresh call.
   * Using bcrypt hash so a stolen DB dump cannot be used to forge sessions.
   */
  @Column({ type: 'text', nullable: true, select: false })
  refresh_token_hash: string | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
