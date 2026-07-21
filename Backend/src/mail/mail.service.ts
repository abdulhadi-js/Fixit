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

  /**
   * Sends an OTP verification email.
   * Falls back to a prominent console log if SMTP is unavailable,
   * so the OTP is always visible in Railway/local logs.
   */
  async sendOtp(email: string, otpCode: string): Promise<void> {
    try {
      const info = await this.transporter.sendMail({
        from: '"FixIt" <no-reply@fixit.com>',
        to: email,
        subject: 'Your FixIt OTP Code',
        text: `Your OTP code is ${otpCode}. It expires in 5 minutes.`,
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h2 style="color: #4f46e5;">Your FixIt OTP Code</h2>
            <p>Use the following code to verify your account. It expires in <strong>5 minutes</strong>.</p>
            <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; text-align: center; padding: 16px; background: #f3f4f6; border-radius: 8px; margin: 16px 0;">
              ${otpCode}
            </div>
            <p style="color: #6b7280; font-size: 12px;">If you did not request this, please ignore this email.</p>
          </div>
        `,
      });
      this.logger.log(`OTP email sent to ${email}: ${info.messageId}`);
    } catch (error) {
      this.logger.error(`Failed to send OTP email to ${email}`, error);
      // ⚠️ DEV FALLBACK — always log OTP prominently so it's visible in Railway/console logs
      this.logger.warn(
        `\n${'='.repeat(60)}\n` +
        `⚠️  [DEV FALLBACK] SMTP failed — OTP NOT emailed\n` +
        `   Recipient : ${email}\n` +
        `   OTP Code  : ${otpCode}\n` +
        `${'='.repeat(60)}`,
      );
    }
  }

  /**
   * Alias for sendOtp — used specifically for forgot-password flows.
   * Sends the same email but with a different subject line for clarity.
   */
  async sendForgotPasswordOtp(email: string, otpCode: string): Promise<void> {
    try {
      const info = await this.transporter.sendMail({
        from: '"FixIt" <no-reply@fixit.com>',
        to: email,
        subject: 'FixIt Password Reset OTP',
        text: `Your password reset OTP is ${otpCode}. It expires in 5 minutes.`,
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h2 style="color: #4f46e5;">FixIt Password Reset</h2>
            <p>Use the following code to reset your password. It expires in <strong>5 minutes</strong>.</p>
            <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; text-align: center; padding: 16px; background: #f3f4f6; border-radius: 8px; margin: 16px 0;">
              ${otpCode}
            </div>
            <p style="color: #6b7280; font-size: 12px;">If you did not request a password reset, please ignore this email.</p>
          </div>
        `,
      });
      this.logger.log(`Password reset OTP sent to ${email}: ${info.messageId}`);
    } catch (error) {
      this.logger.error(`Failed to send password reset OTP to ${email}`, error);
      // ⚠️ DEV FALLBACK
      this.logger.warn(
        `\n${'='.repeat(60)}\n` +
        `⚠️  [DEV FALLBACK] SMTP failed — Password Reset OTP NOT emailed\n` +
        `   Recipient : ${email}\n` +
        `   OTP Code  : ${otpCode}\n` +
        `${'='.repeat(60)}`,
      );
    }
  }

  /**
   * Generic OTP email sender — an alias for sendOtp.
   * Provided for flexibility when callers want a more explicit method name.
   */
  async sendOtpEmail(email: string, otpCode: string): Promise<void> {
    return this.sendOtp(email, otpCode);
  }
}
