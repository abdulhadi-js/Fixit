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
import { WhatsappService } from '../whatsapp/whatsapp.service';
import { UserRole } from '../users/user.entity';
import { RegisterDto, LoginDto, VerifyOtpDto } from './dto/auth.dto';
import { JwtPayload } from './strategies/jwt.strategy';

export interface TokenPair {
  access_token: string;
  refresh_token: string;
  expires_in: number;   // seconds until access token expires
  token_type: 'Bearer';
}

@Injectable()
export class AuthService {
  private readonly SALT_ROUNDS = 12;
  private readonly OTP_TTL_MINUTES = 5;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly whatsappService: WhatsappService,
    private readonly config: ConfigService,
  ) {}

  // ─── Register ──────────────────────────────────────────────────────────────
  async register(dto: RegisterDto): Promise<{ message: string }> {
    const existing = await this.usersService.findByPhone(dto.phone_number);
    if (existing) {
      throw new ConflictException('Phone number already registered');
    }

    const password_hash = await bcrypt.hash(dto.password, this.SALT_ROUNDS);
    const { otp_code, otp_expires_at } = this.generateOtp();

    await this.usersService.save({
      full_name: dto.full_name,
      phone_number: dto.phone_number,
      role: dto.role as UserRole,
      password_hash,
      is_verified: false,
      otp_code,
      otp_expires_at,
    });

    // Fire OTP via WhatsApp — never send it in the API response
    await this.whatsappService.sendOtp(dto.phone_number, otp_code);

    return { message: 'OTP sent to your WhatsApp. Please verify your number.' };
  }

  // ─── Verify OTP ────────────────────────────────────────────────────────────
  async verifyOtp(dto: VerifyOtpDto): Promise<TokenPair> {
    const user = await this.usersService.findByPhone(dto.phone_number);
    if (!user) throw new UnauthorizedException('Invalid phone number');

    if (!user.otp_code || !user.otp_expires_at) {
      throw new BadRequestException('No OTP pending. Please register or resend.');
    }

    // Constant-time comparison to prevent timing attacks
    const otpBuffer = Buffer.from(dto.otp_code.padEnd(6));
    const storedBuffer = Buffer.from(user.otp_code.padEnd(6));
    const isMatch = crypto.timingSafeEqual(otpBuffer, storedBuffer);

    if (!isMatch) throw new UnauthorizedException('Invalid OTP code');

    // Check expiry
    if (new Date() > user.otp_expires_at) {
      throw new GoneException('OTP has expired. Please request a new one.');
    }

    // Generate token pair
    const tokens = await this.generateTokenPair(user.id, user.role, user.phone_number);

    // Verify user, clear OTP, store hashed refresh token
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
    const user = await this.usersService.findByPhone(dto.phone_number);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const passwordValid = await bcrypt.compare(dto.password, user.password_hash);
    if (!passwordValid) throw new UnauthorizedException('Invalid credentials');

    if (!user.is_verified) {
      throw new ForbiddenException(
        'Account not verified. Please verify your WhatsApp number first.',
      );
    }

    // Generate new token pair and rotate refresh token
    const tokens = await this.generateTokenPair(user.id, user.role, user.phone_number);

    await this.usersService.update(user.id, {
      refresh_token_hash: await bcrypt.hash(tokens.refresh_token, this.SALT_ROUNDS),
    });

    return tokens;
  }

  // ─── Refresh Token ─────────────────────────────────────────────────────────
  /**
   * Validates the refresh token against the stored hash, then issues a new
   * token pair (rotation). The old refresh token is invalidated immediately.
   */
  async refreshTokens(userId: string, rawRefreshToken: string): Promise<TokenPair> {
    // Must explicitly fetch refresh_token_hash (it has select: false)
    const user = await this.usersService.findByIdWithRefreshToken(userId);

    if (!user || !user.refresh_token_hash) {
      throw new UnauthorizedException('Session not found. Please log in again.');
    }

    const isValid = await bcrypt.compare(rawRefreshToken, user.refresh_token_hash);
    if (!isValid) {
      // Possible token reuse attack — invalidate all sessions
      await this.usersService.update(userId, { refresh_token_hash: null });
      throw new UnauthorizedException(
        'Refresh token reuse detected. All sessions have been invalidated.',
      );
    }

    // Rotate: issue new pair, hash + store new refresh token
    const tokens = await this.generateTokenPair(user.id, user.role, user.phone_number);

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
  async resendOtp(phone_number: string): Promise<{ message: string }> {
    const user = await this.usersService.findByPhone(phone_number);
    if (!user) throw new UnauthorizedException('Phone number not found');

    if (user.is_verified) {
      throw new BadRequestException('Account already verified');
    }

    const { otp_code, otp_expires_at } = this.generateOtp();
    await this.usersService.update(user.id, { otp_code, otp_expires_at });
    await this.whatsappService.sendOtp(phone_number, otp_code);

    return { message: 'New OTP sent to your WhatsApp.' };
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
    phone: string,
  ): Promise<TokenPair> {
    const accessPayload: JwtPayload = { sub: userId, role, phone, type: 'access' };
    const refreshPayload: JwtPayload = { sub: userId, role, phone, type: 'refresh' };

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
