import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);
  private readonly apiToken: string;
  private readonly phoneNumberId: string;
  private readonly templateName: string;

  constructor(private readonly config: ConfigService) {
    // Use non-null assertion — these are required env vars
    this.apiToken = this.config.get<string>('WHATSAPP_API_TOKEN') as string;
    this.phoneNumberId = this.config.get<string>('WHATSAPP_PHONE_NUMBER_ID') as string;
    this.templateName = this.config.get<string>('WHATSAPP_OTP_TEMPLATE_NAME') ?? 'otp_verification';
  }

  /**
   * Sends a 6-digit OTP via a pre-approved Meta WhatsApp "Authentication" template.
   * Phone number must be in E.164 format: +923131123595
   */
  async sendOtp(phoneNumber: string, otpCode: string): Promise<void> {
    // Development bypass
    if (this.apiToken === 'REPLACE_WITH_YOUR_META_ACCESS_TOKEN' || this.apiToken === 'MOCK') {
      this.logger.warn(`[DEV MODE] WhatsApp API bypassed. OTP for ${phoneNumber} is: ${otpCode}`);
      return;
    }

    // Meta API requires the phone number without the leading '+'
    const cleanPhoneNumber = phoneNumber.startsWith('+') ? phoneNumber.substring(1) : phoneNumber;
    const url = `https://graph.facebook.com/v20.0/${this.phoneNumberId}/messages`;

    try {
      await axios.post(
        url,
        {
          messaging_product: 'whatsapp',
          to: cleanPhoneNumber,
          type: 'template',
          template: {
            name: this.templateName,
            language: { code: 'en_US' },
            components: [
              {
                type: 'body',
                parameters: [{ type: 'text', text: otpCode }],
              },
              {
                type: 'button',
                sub_type: 'url',
                index: '0',
                parameters: [{ type: 'text', text: otpCode }],
              },
            ],
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      this.logger.log(`OTP sent via WhatsApp to ${phoneNumber}`);
    } catch (error: any) {
      this.logger.error(
        `Failed to send WhatsApp OTP to ${phoneNumber}: ${error?.response?.data?.error?.message ?? error.message}`,
      );
      throw error;
    }
  }
}
