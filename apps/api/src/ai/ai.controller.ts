import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate-product')
  @UseGuards(AuthGuard)
  generateProduct(
    @Body() body: { productName: string; categories: Array<{ id: number; nameEn: string; nameFr: string }> },
  ) {
    return this.aiService.generateProduct(body.productName, body.categories);
  }
}
