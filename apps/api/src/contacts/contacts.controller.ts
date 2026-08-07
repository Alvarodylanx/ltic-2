import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, ParseIntPipe, HttpCode } from '@nestjs/common';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { ContactsService } from './contacts.service';
import { NewContact, Contact } from '@ltic/db';
import { AuthGuard } from '../auth/auth.guard';

@SkipThrottle({ login: true, form: true })
@Controller('contacts')
export class ContactsController {
  constructor(private readonly svc: ContactsService) {}

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Query('read') read?: string, @Query('limit') limit?: string, @Query('offset') offset?: string) {
    return this.svc.findAll({ read: read === 'true' ? true : read === 'false' ? false : undefined,
      limit: limit ? Number(limit) : 50, offset: offset ? Number(offset) : 0 });
  }

  @Post()
  @Throttle({ form: {} })
  create(@Body() body: NewContact) { return this.svc.create(body); }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id', ParseIntPipe) id: number, @Body() body: Partial<Contact>) { return this.svc.update(id, body); }

  @Post(':id/reply')
  @UseGuards(AuthGuard)
  reply(@Param('id', ParseIntPipe) id: number, @Body('message') message: string) {
    return this.svc.reply(id, message);
  }
}
