import { IsString, IsEmail, IsEnum, MinLength, IsNumberString, Length, IsOptional, IsPhoneNumber } from 'class-validator';
import { UserRole } from '../../users/user.entity';

export class RegisterDto {
  @IsString()
  full_name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsPhoneNumber()
  phone_number?: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsString()
  @MinLength(8)
  password: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}

export class VerifyOtpDto {
  @IsEmail()
  email: string;

  @IsNumberString()
  @Length(6, 6)
  otp_code: string;
}

export class ResendOtpDto {
  @IsEmail()
  email: string;
}

export class RefreshTokenDto {
  @IsString()
  refresh_token: string;
}

export class ForgotPasswordDto {
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @IsEmail()
  email: string;

  @IsNumberString()
  @Length(6, 6)
  otp_code: string;

  @IsString()
  @MinLength(8)
  new_password: string;
}
