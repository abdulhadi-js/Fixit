import { Controller, Post, Get, Body, HttpCode, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, VerifyOtpDto, ResendOtpDto, RefreshTokenDto } from './dto/auth.dto';
import { JwtAuthGuard, JwtRefreshGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /api/v1/auth/register
   * Rate-limited: 5 requests per minute to prevent phone number enumeration
   */
  @Post('register')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  /**
   * POST /api/v1/auth/verify-otp
   * Returns: { access_token, refresh_token, expires_in, token_type }
   */
  @Post('verify-otp')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }

  /**
   * POST /api/v1/auth/login
   * Returns: { access_token, refresh_token, expires_in, token_type }
   */
  @Post('login')
  @HttpCode(200)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  /**
   * POST /api/v1/auth/refresh
   * Rotates the token pair. Client sends { refresh_token: "..." } in body.
   * Returns a new { access_token, refresh_token, expires_in, token_type }.
   * Old refresh token is immediately invalidated (rotation).
   */
  @Post('refresh')
  @HttpCode(200)
  @UseGuards(JwtRefreshGuard)
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  refresh(
    @CurrentUser() user: any,
    @Body() dto: RefreshTokenDto,
  ) {
    return this.authService.refreshTokens(user.id, dto.refresh_token);
  }

  /**
   * POST /api/v1/auth/logout
   * Invalidates the server-side refresh token hash — all sessions on this device end.
   * Requires a valid access token.
   */
  @Post('logout')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  logout(@CurrentUser() user: any) {
    return this.authService.logout(user.id);
  }

  /**
   * POST /api/v1/auth/resend-otp
   * Rate-limited: 5 requests per minute to prevent OTP flooding
   */
  @Post('resend-otp')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  resendOtp(@Body() dto: ResendOtpDto) {
    return this.authService.resendOtp(dto.phone_number);
  }

  /**
   * GET /api/v1/auth/me
   * Returns the currently authenticated user's profile decoded from the JWT.
   * No DB hit — all data comes from the verified token payload.
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@CurrentUser() user: any) {
    return {
      id: user.id,
      role: user.role,
      phone_number: user.phone_number,
    };
  }
}
