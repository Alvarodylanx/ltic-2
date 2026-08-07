import { Controller, Get, Patch, Post, Body, UseGuards, Header } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { SettingsService } from './settings.service';
import { MailService } from '../mail/mail.service';
import { AuthGuard } from '../auth/auth.guard';

@SkipThrottle({ login: true, form: true })
@Controller('settings')
export class SettingsController {
  constructor(private readonly svc: SettingsService, private readonly mail: MailService) {}

  @Get()
  @Header('Cache-Control', 'public, max-age=300, stale-while-revalidate=3600')
  findAll() { return this.svc.findAll(); }

  @Get('admin')
  @UseGuards(AuthGuard)
  findAllAdmin() { return this.svc.findAllAdmin(); }

  @Patch()
  @UseGuards(AuthGuard)
  update(@Body() body: Record<string, string>) { return this.svc.update(body); }

  @Post('test-email')
  @UseGuards(AuthGuard)
  async testEmail() {
    const all = await this.svc.findAllAdmin();
    const to = all.smtp_user || all.company_email;
    if (!to) return { sent: false, error: 'No recipient address configured' };
    return this.mail.sendWithResult(
      to,
      'LTIC SARL — SMTP Test',
      `<p>This is a test email from your LTIC SARL website.<br>If you received this, your email configuration is working correctly.</p>`,
    );
  }
}
