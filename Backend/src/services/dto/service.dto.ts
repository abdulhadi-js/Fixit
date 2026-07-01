import { IsString, IsInt, IsOptional, Min, IsObject } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  title: string;

  @IsInt()
  @Min(1)
  base_price: number;

  @IsInt()
  @IsOptional()
  estimated_duration_mins?: number;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class UpdateServiceDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  base_price?: number;

  @IsInt()
  @IsOptional()
  estimated_duration_mins?: number;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
