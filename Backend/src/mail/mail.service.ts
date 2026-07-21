import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly fromEmail: string;
  private isConfigured = false;

  constructor(private config: ConfigService) {
    const apiKey = this.config.get<string>('SENDGRID_API_KEY');
    this.fromEmail = this.config.get<string>('MAIL_FROM', 'your-verified-email@gmail.com');

    if (apiKey && apiKey !== 'REPLACE_WITH_SENDGRID_API_KEY') {
      sgMail.setApiKey(apiKey);
      this.isConfigured = true;
      this.logger.log('SendGrid mail service initialized ✅');
    } else {
      this.logger.warn('⚠️  SENDGRID_API_KEY not set — emails will be logged to console only (dev mode)');
    }
  }

  async sendOtp(email: string, otpCode: string): Promise<void> {
    await this.send(email, 'Your FixIt OTP Code', this.buildOtpHtml(otpCode, 'Verify your account'));
  }

  async sendForgotPasswordOtp(email: string, otpCode: string): Promise<void> {
    await this.send(email, 'FixIt Password Reset Code', this.buildOtpHtml(otpCode, 'Reset your password'));
  }

  async sendOtpEmail(email: string, otpCode: string): Promise<void> {
    return this.sendOtp(email, otpCode);
  }

  private async send(to: string, subject: string, html: string): Promise<void> {
    if (!this.isConfigured) {
      this.logger.warn(
        `\n${'='.repeat(60)}\n` +
        `⚠️  [DEV FALLBACK] SendGrid not configured — Email NOT sent\n` +
        `   Recipient : ${to}\n` +
        `   Subject   : ${subject}\n` +
        `${'='.repeat(60)}`,
      );
      return;
    }

    try {
      const msg = {
        to,
        from: this.fromEmail, // MUST be the exact email you verified on SendGrid
        subject,
        html,
      };

      await sgMail.send(msg);
      this.logger.log(`✅ Email sent via SendGrid to ${to}`);
    } catch (error: any) {
      this.logger.error(`❌ Failed to send email via SendGrid to ${to}`, error.response?.body || error.message);
      
      // Extract OTP from html for fallback logging
      const otpMatch = html.match(/letter-spacing: 10px[^>]*>([^<]+)</);
      const otp = otpMatch ? otpMatch[1].trim() : '(see email html)';
      
      this.logger.warn(
        `\n${'='.repeat(60)}\n` +
        `⚠️  [FALLBACK] Email failed — check SENDGRID_API_KEY and MAIL_FROM\n` +
        `   Recipient : ${to}\n` +
        `   OTP Code  : ${otp}\n` +
        `   Make sure MAIL_FROM matches your verified Sender Identity!\n` +
        `${'='.repeat(60)}`,
      );
    }
  }

  private buildOtpHtml(otpCode: string, action: string): string {
    return `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 32px 24px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">🔧 FixIt</h1>
        </div>
        <div style="padding: 32px 24px;">
          <h2 style="color: #111827; margin: 0 0 8px;">${action}</h2>
          <p style="color: #6b7280; margin: 0 0 24px;">Use the code below. It expires in <strong>5 minutes</strong>.</p>
          <div style="font-size: 36px; font-weight: 800; letter-spacing: 10px; text-align: center; padding: 20px; background: #f9fafb; border-radius: 8px; color: #4f46e5; margin-bottom: 24px;">
            ${otpCode}
          </div>
          <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      </div>
    `;
  }
}
