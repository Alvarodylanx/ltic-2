import { Controller, Get, Put, Body, UseGuards, Header } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { SpotlightService } from './spotlight.service';
import { AuthGuard } from '../auth/auth.guard';
import { NewSpotlight } from '@ltic/db';

@SkipThrottle({ login: true, form: true })
@Controller('spotlight')
export class SpotlightController {
  constructor(private readonly svc: SpotlightService) {}

  @Get()
  @Header('Cache-Control', 'public, max-age=30, stale-while-revalidate=120')
  get() { return this.svc.get(); }

  @Put()
  @UseGuards(AuthGuard)
  upsert(@Body() body: Partial<NewSpotlight>) { return this.svc.upsert(body); }
}
