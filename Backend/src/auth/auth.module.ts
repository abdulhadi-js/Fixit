import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy, JwtRefreshStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { WhatsappModule } from '../whatsapp/whatsapp.module';

@Module({
  imports: [
    UsersModule,
    WhatsappModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    // JwtModule is used for signAsync with explicit secrets per token type
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        // Default secret for verifying access tokens via JwtService.verifyAsync
        secret: config.get<string>('JWT_SECRET') as string,
        signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_IN', '15m') as any },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy],
  exports: [JwtModule, PassportModule],
})
export class AuthModule {}
