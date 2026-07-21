import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter;
  private readonly logger = new Logger(MailService.name);

  constructor(private config: ConfigService) {
    const port = Number(this.config.get<number>('SMTP_PORT', 1025));
    this.transporter = nodemailer.createTransport({
      host: this.config.get<string>('SMTP_HOST', 'localhost'),
      port: port,
      secure: port === 465, 
      auth: {
        user: this.config.get<string>('SMTP_USER', 'test'),
        pass: this.config.get<string>('SMTP_PASS', 'test'),
      },
      // Force IPv4 to prevent 'ENETUNREACH' errors in IPv6-unsupported environments like Railway
      family: 4,
    } as any);
  }

  async sendOtp(email: string, otpCode: string): Promise<void> {
    try {
      const info = await this.transporter.sendMail({
        from: '"FixIt" <no-reply@fixit.com>',
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otpCode}. It expires in 5 minutes.`,
        html: `<b>Your OTP code is ${otpCode}. It expires in 5 minutes.</b>`,
      });
      this.logger.log(`OTP sent to ${email}: ${info.messageId}`);
    } catch (error) {
      this.logger.error(`Error sending OTP to ${email}`, error);
      // For development/testing: log the OTP if mail fails
      this.logger.warn(`Fallback: OTP for ${email} is ${otpCode}`);
    }
  }
}
