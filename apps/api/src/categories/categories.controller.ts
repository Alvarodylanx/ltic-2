import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Header } from "@nestjs/common";
import { SkipThrottle } from "@nestjs/throttler";
import { CategoriesService } from "./categories.service";
import { AuthGuard } from "../auth/auth.guard";

interface CategoryBody {
  nameEn: string;
  nameFr: string;
  descriptionEn?: string;
  descriptionFr?: string;
  imageUrl?: string;
}

@SkipThrottle({ login: true, form: true })
@Controller("categories")
export class CategoriesController {
  constructor(private svc: CategoriesService) {}

  @Get()
  @Header('Cache-Control', 'public, max-age=300, stale-while-revalidate=3600')
  findAll() { return this.svc.findAll(); }

  @Get(":id")
  @Header('Cache-Control', 'public, max-age=300, stale-while-revalidate=3600')
  findOne(@Param("id") id: string) { return this.svc.findOne(+id); }

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() body: CategoryBody) { return this.svc.create(body); }

  @UseGuards(AuthGuard)
  @Patch(":id")
  update(@Param("id") id: string, @Body() body: Partial<CategoryBody>) { return this.svc.update(+id, body); }

  @UseGuards(AuthGuard)
  @Delete(":id")
  remove(@Param("id") id: string) { return this.svc.remove(+id); }
}
