import { Controller, Post, Get, Body, Req, UseGuards } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { Request } from 'express';
import { AnalyticsService } from './analytics.service';
import { AuthGuard } from '../auth/auth.guard';

@SkipThrottle({ login: true, form: true })
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly svc: AnalyticsService) {}

  @Post('pageview')
  async record(@Body() body: { page: string; sessionId: string }, @Req() req: Request) {
    const ua = req.headers['user-agent'] ?? '';
    if (this.svc.isBot(ua) || !body.page || !body.sessionId) return { ok: true };
    await this.svc.record(body.page, body.sessionId);
    return { ok: true };
  }

  @Get('summary')
  @UseGuards(AuthGuard)
  summary() {
    return this.svc.getSummary();
  }
}
