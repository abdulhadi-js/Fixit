import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserRole } from '../../users/user.entity';

export interface JwtPayload {
  sub: string;       // user.id (UUID)
  role: UserRole;
  phone: string;
  type: 'access' | 'refresh';
}

/** Access-token strategy — used by JwtAuthGuard on all protected routes */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET') as string,
    });
  }

  async validate(payload: JwtPayload) {
    if (payload.type !== 'access') {
      throw new UnauthorizedException('Token type mismatch: expected access token');
    }
    return {
      id: payload.sub,
      role: payload.role,
      phone_number: payload.phone,
    };
  }
}

/** Refresh-token strategy — used ONLY by the /auth/refresh endpoint */
@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refresh_token'),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_REFRESH_SECRET') as string,
      passReqToCallback: false,
    });
  }

  async validate(payload: JwtPayload) {
    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Token type mismatch: expected refresh token');
    }
    // Return minimal payload — AuthService will validate the hash against DB
    return { id: payload.sub, role: payload.role, phone_number: payload.phone };
  }
}
