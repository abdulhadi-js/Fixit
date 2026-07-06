import {
  Controller, Get, Post, Req, Headers,
  HttpCode, UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../users/user.entity';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  /**
   * POST /api/v1/payments/webhook
   * Stripe sends events here — uses raw body for signature verification.
   * This route must NOT have JwtAuthGuard.
   */
  @Post('webhook')
  @HttpCode(200)
  async handleWebhook(
    @Req() req: Request & { rawBody?: Buffer },
    @Headers('stripe-signature') signature: string,
  ) {
    return this.paymentsService.handleWebhook(req.rawBody, signature);
  }

  /**
   * GET /api/v1/payments/transactions/my — Consumer payment history
   */
  @Get('transactions/my')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CONSUMER)
  getMyTransactions(@CurrentUser() user: any) {
    return this.paymentsService.getConsumerTransactions(user.id);
  }

  /**
   * GET /api/v1/payments/earnings — Technician weekly earnings
   */
  @Get('earnings')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TECHNICIAN)
  getEarnings(@CurrentUser() user: any) {
    return this.paymentsService.getTechnicianEarnings(user.id);
  }
}
