import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, Header } from "@nestjs/common";
import { SkipThrottle } from "@nestjs/throttler";
import { ProductsService } from "./products.service";
import { AuthGuard } from "../auth/auth.guard";

interface ProductBody {
  nameEn: string;
  nameFr: string;
  descriptionEn?: string;
  descriptionFr?: string;
  imageUrl?: string;
  categoryId?: number;
  available?: boolean;
  slug?: string;
  specifications?: string;
}

interface ProductQuery {
  categoryId?: string;
  search?: string;
  limit?: string;
  offset?: string;
}

@SkipThrottle({ login: true, form: true })
@Controller("products")
export class ProductsController {
  constructor(private svc: ProductsService) {}

  @Get("featured")
  @Header('Cache-Control', 'public, max-age=60, stale-while-revalidate=300')
  getFeatured() { return this.svc.findFeatured(); }

  @Get()
  @Header('Cache-Control', 'public, max-age=30, stale-while-revalidate=300')
  findAll(@Query() q: ProductQuery) { return this.svc.findAll(q); }

  @Get(":id")
  @Header('Cache-Control', 'public, max-age=60, stale-while-revalidate=300')
  findOne(@Param("id") id: string) { return this.svc.findOne(isNaN(+id) ? id : +id); }

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() body: ProductBody) { return this.svc.create(body); }

  @UseGuards(AuthGuard)
  @Patch(":id")
  update(@Param("id") id: string, @Body() body: Partial<ProductBody>) { return this.svc.update(+id, body); }

  @UseGuards(AuthGuard)
  @Delete(":id")
  remove(@Param("id") id: string) { return this.svc.remove(+id); }
}
