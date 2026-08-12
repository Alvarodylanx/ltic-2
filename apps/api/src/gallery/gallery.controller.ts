import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { GalleryService } from './gallery.service';
import { AuthGuard } from '../auth/auth.guard';

@SkipThrottle({ login: true, form: true })
@Controller('gallery')
export class GalleryController {
  constructor(private readonly svc: GalleryService) {}

  @Get()
  findAll() { return this.svc.findAll(); }

  @Get('admin')
  @UseGuards(AuthGuard)
  findAllAdmin() { return this.svc.findAllAdmin(); }

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() body: any) { return this.svc.create(body); }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id', ParseIntPipe) id: number, @Body() body: any) { return this.svc.update(id, body); }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) { return this.svc.remove(id); }
}
