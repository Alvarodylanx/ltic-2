import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq, asc, desc } from 'drizzle-orm';
import { DB_TOKEN, Db } from '../db/db.module';
import { galleryItems, GalleryItem, NewGalleryItem } from '@ltic/db';

@Injectable()
export class GalleryService {
  constructor(@Inject(DB_TOKEN) private db: Db) {}

  async findAll() {
    return this.db.select().from(galleryItems)
      .where(eq(galleryItems.published, true))
      .orderBy(asc(galleryItems.sortOrder), desc(galleryItems.createdAt));
  }

  async findAllAdmin() {
    return this.db.select().from(galleryItems)
      .orderBy(asc(galleryItems.sortOrder), desc(galleryItems.createdAt));
  }

  async create(data: NewGalleryItem) {
    const [item] = await this.db.insert(galleryItems).values(data).returning();
    return item;
  }

  async update(id: number, data: Partial<GalleryItem>) {
    const safe: Record<string, unknown> = {};
    const fields = ['titleEn', 'titleFr', 'category', 'mediaUrl', 'mediaType', 'sortOrder'] as const;
    for (const key of fields) if ((data as any)[key] !== undefined) safe[key] = (data as any)[key];
    if ((data as any).published !== undefined) safe.published = Boolean((data as any).published);
    const [item] = await this.db.update(galleryItems).set(safe as any).where(eq(galleryItems.id, id)).returning();
    if (!item) throw new NotFoundException('Gallery item not found');
    return item;
  }

  async remove(id: number) {
    const [item] = await this.db.delete(galleryItems).where(eq(galleryItems.id, id)).returning();
    if (!item) throw new NotFoundException('Gallery item not found');
    return { deleted: true };
  }
}
