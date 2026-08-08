import { Injectable, Inject } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import { DB_TOKEN, Db } from '../db/db.module';
import { pageViews } from '@ltic/db';

const BOT_PATTERNS = /bot|crawler|spider|scraper|headless|chrome-lighthouse|facebookexternalhit|twitterbot|whatsapp|slack|discord|preview|wget|curl/i;

@Injectable()
export class AnalyticsService {
  constructor(@Inject(DB_TOKEN) private db: Db) {}

  isBot(userAgent: string): boolean {
    return BOT_PATTERNS.test(userAgent);
  }

  async record(page: string, sessionId: string): Promise<void> {
    const today = new Date().toISOString().slice(0, 10);
    await this.db.insert(pageViews).values({ page, sessionId, date: today });
  }

  async getSummary() {
    const today = new Date().toISOString().slice(0, 10);
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
    const monthStart = new Date().toISOString().slice(0, 7) + '-01';

    const [todayRow, weekRow, monthRow, allTimeRow, topPages] = await Promise.all([
      this.db.execute(sql`
        SELECT COUNT(*) AS views, COUNT(DISTINCT session_id) AS unique_visitors
        FROM page_views WHERE date = ${today}
      `),
      this.db.execute(sql`
        SELECT COUNT(*) AS views, COUNT(DISTINCT session_id) AS unique_visitors
        FROM page_views WHERE date >= ${weekAgo}
      `),
      this.db.execute(sql`
        SELECT COUNT(*) AS views, COUNT(DISTINCT session_id) AS unique_visitors
        FROM page_views WHERE date >= ${monthStart}
      `),
      this.db.execute(sql`
        SELECT COUNT(*) AS views, COUNT(DISTINCT session_id) AS unique_visitors
        FROM page_views
      `),
      this.db.execute(sql`
        SELECT page, COUNT(*) AS views
        FROM page_views
        WHERE date >= ${monthStart}
        GROUP BY page
        ORDER BY views DESC
        LIMIT 10
      `),
    ]);

    const row = (r: any) => r.rows?.[0] ?? r[0] ?? {};
    const rows = (r: any) => r.rows ?? r ?? [];

    return {
      today:   { views: Number(row(todayRow).views ?? 0),   unique: Number(row(todayRow).unique_visitors ?? 0) },
      week:    { views: Number(row(weekRow).views ?? 0),     unique: Number(row(weekRow).unique_visitors ?? 0) },
      month:   { views: Number(row(monthRow).views ?? 0),    unique: Number(row(monthRow).unique_visitors ?? 0) },
      allTime: { views: Number(row(allTimeRow).views ?? 0),  unique: Number(row(allTimeRow).unique_visitors ?? 0) },
      topPages: rows(topPages).map((r: any) => ({ page: r.page, views: Number(r.views) })),
    };
  }
}
