import { IsString, IsPhoneNumber, IsEnum, MinLength, IsNumberString, Length } from 'class-validator';
import { UserRole } from '../../users/user.entity';

export class RegisterDto {
  @IsString()
  full_name: string;

  @IsPhoneNumber()
  phone_number: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsString()
  @MinLength(8)
  password: string;
}

export class LoginDto {
  @IsPhoneNumber()
  phone_number: string;

  @IsString()
  @MinLength(8)
  password: string;
}

export class VerifyOtpDto {
  @IsPhoneNumber()
  phone_number: string;

  @IsNumberString()
  @Length(6, 6)
  otp_code: string;
}

export class ResendOtpDto {
  @IsPhoneNumber()
  phone_number: string;
}

export class RefreshTokenDto {
  @IsString()
  refresh_token: string;
}
