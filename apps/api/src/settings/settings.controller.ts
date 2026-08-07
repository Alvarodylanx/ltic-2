import { Controller, Get, Patch, Body, UseGuards, Header } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { SettingsService } from './settings.service';
import { AuthGuard } from '../auth/auth.guard';

@SkipThrottle({ login: true, form: true })
@Controller('settings')
export class SettingsController {
  constructor(private readonly svc: SettingsService) {}

  @Get()
  @Header('Cache-Control', 'public, max-age=300, stale-while-revalidate=3600')
  findAll() { return this.svc.findAll(); }

  @Get('admin')
  @UseGuards(AuthGuard)
  findAllAdmin() { return this.svc.findAllAdmin(); }

  @Patch()
  @UseGuards(AuthGuard)
  update(@Body() body: Record<string, string>) { return this.svc.update(body); }
}
