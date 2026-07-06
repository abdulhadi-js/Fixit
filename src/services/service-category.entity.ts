import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('service_categories')
export class ServiceCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'int' })
  base_price: number; // Exact PKR — no decimals

  @Column({ type: 'smallint', default: 60 })
  estimated_duration_mins: number;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any> | null;
}
