import {
  IsString, IsUUID, IsDateString, IsObject, IsNotEmpty, IsInt, IsOptional, Min,
} from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  service_id: string;

  @IsUUID()
  @IsOptional()
  technician_id?: string;

  @IsDateString()
  scheduled_start: string; // ISO string e.g. "2026-07-01T10:00:00Z"

  @IsNotEmpty()
  address_details: any;

  @IsInt()
  @Min(1)
  @IsOptional()
  estimated_amount?: number;

  @IsString()
  @IsOptional()
  payment_method?: string;
}

export class UpdateBookingStatusDto {
  @IsString()
  @IsNotEmpty()
  status: string; // 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
}
