import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
  GoneException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { UserRole } from '../users/user.entity';
import { RegisterDto, LoginDto, VerifyOtpDto, ForgotPasswordDto, ResetPasswordDto } from './dto/auth.dto';
import { JwtPayload } from './strategies/jwt.strategy';

export interface TokenPair {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: 'Bearer';
}

@Injectable()
export class AuthService {
  private readonly SALT_ROUNDS = 12;
  private readonly OTP_TTL_MINUTES = 5;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly config: ConfigService,
  ) {}

  // ─── Register ──────────────────────────────────────────────────────────────
  async register(dto: RegisterDto): Promise<{ message: string }> {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const password_hash = await bcrypt.hash(dto.password, this.SALT_ROUNDS);
    const { otp_code, otp_expires_at } = this.generateOtp();

    await this.usersService.save({
      full_name: dto.full_name,
      email: dto.email,
      phone_number: dto.phone_number,
      role: dto.role as UserRole,
      password_hash,
      is_verified: false,
      otp_code,
      otp_expires_at,
    });

    // Fire-and-forget: email failures must NEVER block or crash registration
    this.mailService.sendOtp(dto.email, otp_code).catch((err) => {
      console.error(`[AuthService] Non-blocking sendOtp failed for ${dto.email}:`, err);
    });

    return { message: 'Registration successful. Check your email for the OTP.' };
  }

  // ─── Verify OTP ────────────────────────────────────────────────────────────
  async verifyOtp(dto: VerifyOtpDto): Promise<TokenPair> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid email');

    if (!user.otp_code || !user.otp_expires_at) {
      throw new BadRequestException('No OTP pending. Please register or resend.');
    }

    if (dto.otp_code !== user.otp_code) {
      throw new UnauthorizedException('Invalid OTP code');
    }

    if (new Date() > user.otp_expires_at) {
      throw new BadRequestException('OTP has expired. Please request a new one.');
    }

    const tokens = await this.generateTokenPair(user.id, user.role, user.email);

    await this.usersService.update(user.id, {
      is_verified: true,
      otp_code: null,
      otp_expires_at: null,
      refresh_token_hash: await bcrypt.hash(tokens.refresh_token, this.SALT_ROUNDS),
    });

    return tokens;
  }

  // ─── Login ─────────────────────────────────────────────────────────────────
  async login(dto: LoginDto): Promise<TokenPair> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const passwordValid = await bcrypt.compare(dto.password, user.password_hash);
    if (!passwordValid) throw new UnauthorizedException('Invalid credentials');

    if (!user.is_verified) {
      throw new ForbiddenException(
        'Account not verified. Please verify your email first.',
      );
    }

    const tokens = await this.generateTokenPair(user.id, user.role, user.email);

    await this.usersService.update(user.id, {
      refresh_token_hash: await bcrypt.hash(tokens.refresh_token, this.SALT_ROUNDS),
    });

    return tokens;
  }

  // ─── Refresh Token ─────────────────────────────────────────────────────────
  async refreshTokens(userId: string, rawRefreshToken: string): Promise<TokenPair> {
    const user = await this.usersService.findByIdWithRefreshToken(userId);

    if (!user || !user.refresh_token_hash) {
      throw new UnauthorizedException('Session not found. Please log in again.');
    }

    const isValid = await bcrypt.compare(rawRefreshToken, user.refresh_token_hash);
    if (!isValid) {
      await this.usersService.update(userId, { refresh_token_hash: null });
      throw new UnauthorizedException(
        'Refresh token reuse detected. All sessions have been invalidated.',
      );
    }

    const tokens = await this.generateTokenPair(user.id, user.role, user.email);

    await this.usersService.update(userId, {
      refresh_token_hash: await bcrypt.hash(tokens.refresh_token, this.SALT_ROUNDS),
    });

    return tokens;
  }

  // ─── Logout ────────────────────────────────────────────────────────────────
  async logout(userId: string): Promise<{ message: string }> {
    await this.usersService.update(userId, { refresh_token_hash: null });
    return { message: 'Logged out successfully.' };
  }

  // ─── Resend OTP ────────────────────────────────────────────────────────────
  async resendOtp(email: string): Promise<{ message: string }> {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Email not found');

    if (user.is_verified) {
      throw new BadRequestException('Account already verified');
    }

    const { otp_code, otp_expires_at } = this.generateOtp();
    await this.usersService.update(user.id, { otp_code, otp_expires_at });
    // Fire-and-forget: email failures must NEVER block or crash resend
    this.mailService.sendOtp(email, otp_code).catch((err) => {
      console.error(`[AuthService] Non-blocking sendOtp (resend) failed for ${email}:`, err);
    });

    return { message: 'New OTP sent to your email.' };
  }

  // ─── Forgot Password ───────────────────────────────────────────────────────
  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      // Return same message to prevent email enumeration
      return { message: 'If this email exists, an OTP has been sent.' };
    }

    const { otp_code, otp_expires_at } = this.generateOtp();
    await this.usersService.update(user.id, { otp_code, otp_expires_at });

    // Fire-and-forget: email failures must NEVER block or crash forgot-password
    this.mailService.sendOtp(dto.email, otp_code).catch((err) => {
      console.error(`[AuthService] Non-blocking sendOtp (forgot-password) failed for ${dto.email}:`, err);
    });

    return { message: 'If this email exists, an OTP has been sent.' };
  }

  // ─── Reset Password ────────────────────────────────────────────────────────
  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid email');

    if (!user.otp_code || !user.otp_expires_at) {
      throw new BadRequestException('No OTP pending.');
    }

    if (dto.otp_code !== user.otp_code) {
      throw new UnauthorizedException('Invalid OTP code');
    }

    if (new Date() > user.otp_expires_at) {
      throw new BadRequestException('OTP has expired. Please request a new one.');
    }

    const password_hash = await bcrypt.hash(dto.new_password, this.SALT_ROUNDS);

    await this.usersService.update(user.id, {
      password_hash,
      otp_code: null,
      otp_expires_at: null,
      refresh_token_hash: null, // invalidate sessions
    });

    return { message: 'Password reset successfully. Please log in.' };
  }

  // ─── Helpers ───────────────────────────────────────────────────────────────
  private generateOtp(): { otp_code: string; otp_expires_at: Date } {
    const otp_code = Math.floor(100000 + Math.random() * 900000).toString();
    const otp_expires_at = new Date(
      Date.now() + this.OTP_TTL_MINUTES * 60 * 1000,
    );
    return { otp_code, otp_expires_at };
  }

  private async generateTokenPair(
    userId: string,
    role: UserRole,
    email: string,
  ): Promise<TokenPair> {
    const accessPayload: JwtPayload = { sub: userId, role, email, type: 'access' };
    const refreshPayload: JwtPayload = { sub: userId, role, email, type: 'refresh' };

    const jwtSecret = this.config.get<string>('JWT_SECRET') as string;
    const jwtRefreshSecret = this.config.get<string>('JWT_REFRESH_SECRET') as string;
    const accessExpiresIn = this.config.get<string>('JWT_EXPIRES_IN', '15m');
    const refreshExpiresIn = this.config.get<string>('JWT_REFRESH_EXPIRES_IN', '7d');

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(accessPayload, {
        secret: jwtSecret,
        expiresIn: accessExpiresIn as any,
      }),
      this.jwtService.signAsync(refreshPayload, {
        secret: jwtRefreshSecret,
        expiresIn: refreshExpiresIn as any,
      }),
    ]);

    return {
      access_token,
      refresh_token,
      expires_in: 900,   // 15 minutes in seconds
      token_type: 'Bearer',
    };
  }
}
