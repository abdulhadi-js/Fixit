import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';

/** Guards routes that require a valid access JWT in `Authorization: Bearer <token>` */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  /**
   * Override to produce clean, descriptive error messages instead of
   * the generic "Unauthorized" thrown by passport-jwt on any failure.
   */
  handleRequest<TUser = any>(err: any, user: TUser, info: any): TUser {
    if (info instanceof TokenExpiredError) {
      throw new UnauthorizedException(
        'Access token has expired. Please refresh your session.',
      );
    }

    if (info instanceof JsonWebTokenError) {
      throw new UnauthorizedException(
        'Invalid access token. Please log in again.',
      );
    }

    if (err || !user) {
      throw new UnauthorizedException(
        'Authentication required. Please provide a valid Bearer token.',
      );
    }

    return user;
  }
}

/** Guards the /auth/refresh endpoint — reads refresh_token from request body */
@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest<TUser = any>(err: any, user: TUser, info: any): TUser {
    if (info instanceof TokenExpiredError) {
      throw new UnauthorizedException(
        'Refresh token has expired. Please log in again.',
      );
    }

    if (info instanceof JsonWebTokenError) {
      throw new UnauthorizedException(
        'Invalid refresh token.',
      );
    }

    if (err || !user) {
      throw new UnauthorizedException(
        'No refresh token provided or it is invalid.',
      );
    }

    return user;
  }
}
