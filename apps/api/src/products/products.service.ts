import { Injectable, NotFoundException, BadRequestException, ConflictException } from "@nestjs/common";
import { getPool } from "../db.provider";

function sanitizeSlug(raw: string): string {
  return raw.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function pgError(e: any): never {
  if (e.code === "23505") throw new ConflictException("A product with this slug already exists");
  if (e.code === "23502") throw new BadRequestException(`Missing required field: ${e.column}`);
  if (e.code === "23503") throw new BadRequestException("Invalid category — please select a valid category");
  throw e;
}

@Injectable()
export class ProductsService {
  private get db() { return getPool(); }

  async findAll(q: any = {}) {
    const conds: string[] = [];
    const vals: any[] = [];
    let i = 1;
    if (q.categoryId) { conds.push(`(p.category_id=$${i} OR $${i}=ANY(p.extra_category_ids))`); vals.push(+q.categoryId); i++; }
    if (q.search) { conds.push(`(p.name_en ILIKE $${i} OR p.name_fr ILIKE $${i})`); vals.push(`%${q.search}%`); i++; }
    const where = conds.length ? `WHERE ${conds.join(" AND ")}` : "";
    const limit = q.limit ? `LIMIT ${+q.limit}` : "";
    const offset = q.offset ? `OFFSET ${+q.offset}` : "";
    const res = await this.db.query(
      `SELECT p.*, c.name_en as cat_name_en FROM products p
       LEFT JOIN categories c ON c.id = p.category_id
       ${where} ORDER BY p.created_at DESC ${limit} ${offset}`,
      vals
    );
    return res.rows.map(this.mapRow);
  }

  async findFeatured() {
    const res = await this.db.query(
      `SELECT p.*, c.name_en as cat_name_en FROM products p
       LEFT JOIN categories c ON c.id = p.category_id
       WHERE p.featured=true AND p.available=true
       ORDER BY p.created_at DESC LIMIT 8`
    );
    return res.rows.map(this.mapRow);
  }

  async findOne(idOrSlug: number | string) {
    const isId = typeof idOrSlug === "number";
    const res = await this.db.query(
      `SELECT p.*, c.name_en as cat_name_en FROM products p
       LEFT JOIN categories c ON c.id = p.category_id
       WHERE ${isId ? "p.id=$1" : "p.slug=$1"}`,
      [idOrSlug]
    );
    if (!res.rows[0]) throw new NotFoundException("Product not found");
    return this.mapRow(res.rows[0]);
  }

  async create(data: any) {
    if (!data.categoryId) throw new BadRequestException("Category is required");
    if (!data.nameEn && !data.nameFr) throw new BadRequestException("Product name is required");
    const slug = sanitizeSlug(data.slug?.trim() || (data.nameEn || data.nameFr));
    const extraIds = Array.isArray(data.extraCategoryIds) ? data.extraCategoryIds.map(Number).filter(n => n !== +data.categoryId) : [];
    try {
      const res = await this.db.query(
        `INSERT INTO products (name_en, name_fr, slug, description_en, description_fr, category_id, image_url, images, specifications, featured, available, extra_category_ids)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
        [data.nameEn || data.nameFr, data.nameFr || data.nameEn, slug,
         data.descriptionEn, data.descriptionFr, data.categoryId,
         data.imageUrl, JSON.stringify(data.images || []),
         data.specifications, data.featured ?? false, data.available ?? true, extraIds]
      );
      return this.mapRow(res.rows[0]);
    } catch (e: any) { pgError(e); }
  }

  async update(id: number, data: any) {
    const fields: string[] = [];
    const vals: any[] = [];
    let i = 1;
    const map: Record<string, string> = {
      nameEn: "name_en", nameFr: "name_fr", slug: "slug",
      descriptionEn: "description_en", descriptionFr: "description_fr",
      categoryId: "category_id", imageUrl: "image_url",
      specifications: "specifications", featured: "featured", available: "available",
    };
    if (data.slug) data.slug = sanitizeSlug(data.slug);
    for (const [k, col] of Object.entries(map)) {
      if (data[k] !== undefined) {
        fields.push(`${col}=$${i++}`);
        vals.push(k === "images" ? JSON.stringify(data[k]) : data[k]);
      }
    }
    if (data.images !== undefined) { fields.push(`images=$${i++}`); vals.push(JSON.stringify(data.images)); }
    if (data.extraCategoryIds !== undefined) {
      const extraIds = Array.isArray(data.extraCategoryIds) ? data.extraCategoryIds.map(Number) : [];
      fields.push(`extra_category_ids=$${i++}`); vals.push(extraIds);
    }
    if (!fields.length) return this.findOne(id);
    vals.push(id);
    const res = await this.db.query(
      `UPDATE products SET ${fields.join(",")} WHERE id=$${i} RETURNING *`, vals
    );
    if (!res.rows[0]) throw new NotFoundException("Product not found");
    return this.mapRow(res.rows[0]);
  }

  async remove(id: number) {
    await this.db.query("DELETE FROM products WHERE id=$1", [id]);
    return { success: true };
  }

  private mapRow(r: any) {
    return {
      id: r.id,
      nameEn: r.name_en,
      nameFr: r.name_fr,
      name: r.name_en,
      slug: r.slug,
      descriptionEn: r.description_en,
      descriptionFr: r.description_fr,
      categoryId: r.category_id,
      categoryName: r.cat_name_en || null,
      imageUrl: r.image_url,
      images: r.images || [],
      specifications: r.specifications,
      featured: r.featured,
      available: r.available,
      extraCategoryIds: r.extra_category_ids || [],
      createdAt: r.created_at,
    };
  }
}
