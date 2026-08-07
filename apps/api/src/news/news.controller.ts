import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { NewsService } from './news.service';
import { NewNewsArticle, NewsArticle } from '@ltic/db';
import { AuthGuard } from '../auth/auth.guard';

@SkipThrottle({ login: true, form: true })
@Controller('news')
export class NewsController {
  constructor(private readonly svc: NewsService) {}

  @Get()
  findAll(@Query('limit') limit?: string, @Query('offset') offset?: string) {
    return this.svc.findAll({ limit: limit ? Number(limit) : 20, offset: offset ? Number(offset) : 0 });
  }

  @Get('admin')
  @UseGuards(AuthGuard)
  findAllAdmin(@Query('limit') limit?: string, @Query('offset') offset?: string) {
    return this.svc.findAllAdmin({ limit: limit ? Number(limit) : 100, offset: offset ? Number(offset) : 0 });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return this.svc.findOne(id); }

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() body: NewNewsArticle) { return this.svc.create(body); }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id', ParseIntPipe) id: number, @Body() body: Partial<NewsArticle>) { return this.svc.update(id, body); }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) { return this.svc.remove(id); }
}
