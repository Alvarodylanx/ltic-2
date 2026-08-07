import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq, desc } from 'drizzle-orm';
import { DB_TOKEN, Db } from '../db/db.module';
import { news, NewNewsArticle, NewsArticle } from '@ltic/db';

@Injectable()
export class NewsService {
  constructor(@Inject(DB_TOKEN) private db: Db) {}

  async findAll(opts: { limit: number; offset: number }) {
    return this.db.select().from(news).where(eq(news.published, true))
      .orderBy(desc(news.publishedAt)).limit(opts.limit).offset(opts.offset);
  }

  async findAllAdmin(opts: { limit: number; offset: number }) {
    return this.db.select().from(news)
      .orderBy(desc(news.publishedAt)).limit(opts.limit).offset(opts.offset);
  }

  async findOne(id: number) {
    const [article] = await this.db.select().from(news).where(eq(news.id, id));
    if (!article) throw new NotFoundException('Article not found');
    return article;
  }

  async create(data: NewNewsArticle) {
    const [article] = await this.db.insert(news).values(data).returning();
    return article;
  }

  async update(id: number, data: Partial<NewsArticle>) {
    const allowed = ['titleEn','titleFr','slug','summaryEn','summaryFr','contentEn','contentFr','imageUrl','category','published','publishedAt'] as const;
    const safe: Record<string, unknown> = {};
    for (const key of allowed) if ((data as any)[key] !== undefined) safe[key] = (data as any)[key];
    const [article] = await this.db.update(news).set(safe as any).where(eq(news.id, id)).returning();
    if (!article) throw new NotFoundException('Article not found');
    return article;
  }

  async remove(id: number) {
    const [article] = await this.db.delete(news).where(eq(news.id, id)).returning();
    if (!article) throw new NotFoundException('Article not found');
    return { deleted: true };
  }
}
