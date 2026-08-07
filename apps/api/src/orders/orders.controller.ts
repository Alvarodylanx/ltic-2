import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { OrdersService } from './orders.service';
import { Order, OrderTimelineItem } from '@ltic/db';
import { AuthGuard } from '../auth/auth.guard';

@SkipThrottle({ login: true, form: true })
@Controller('orders')
export class OrdersController {
  constructor(private readonly svc: OrdersService) {}

  @Get('track')
  track(@Query('trackingNumber') trackingNumber: string) { return this.svc.track(trackingNumber); }

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() body: Parameters<OrdersService['create']>[0]) { return this.svc.create(body); }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Query('status') status?: string, @Query('limit') limit?: string, @Query('offset') offset?: string) {
    return this.svc.findAll({ status, limit: limit ? Number(limit) : 100, offset: offset ? Number(offset) : 0 });
  }

  @Get('customer/:customerId')
  @UseGuards(AuthGuard)
  findByCustomer(@Param('customerId', ParseIntPipe) customerId: number) { return this.svc.findByCustomer(customerId); }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) { return this.svc.findOne(id); }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id', ParseIntPipe) id: number, @Body() body: Partial<Order>) { return this.svc.update(id, body); }

  @Delete(':id')
  @UseGuards(AuthGuard)
  delete(@Param('id', ParseIntPipe) id: number) { return this.svc.delete(id); }

  @Post(':id/timeline')
  @UseGuards(AuthGuard)
  addTimeline(@Param('id', ParseIntPipe) id: number, @Body() body: OrderTimelineItem) {
    return this.svc.addTimelineEvent(id, body);
  }

  @Delete(':id/timeline/:index')
  @UseGuards(AuthGuard)
  removeTimeline(
    @Param('id', ParseIntPipe) id: number,
    @Param('index', ParseIntPipe) index: number,
  ) {
    return this.svc.removeTimelineEvent(id, index);
  }
}
