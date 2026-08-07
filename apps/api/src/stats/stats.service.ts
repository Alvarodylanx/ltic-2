import { Injectable, Inject } from '@nestjs/common';
import { eq, sql, desc } from 'drizzle-orm';
import { DB_TOKEN, Db } from '../db/db.module';
import { products, quotes, orders, contacts } from '@ltic/db';

@Injectable()
export class StatsService {
  constructor(@Inject(DB_TOKEN) private db: Db) {}

  async getDashboard() {
    const [[{ total: totalProducts }], [{ total: totalQuotes }], [{ total: pendingQuotes }],
      [{ total: activeOrders }], [{ total: unreadContacts }],
      recentQuotes, recentContacts] = await Promise.all([
      this.db.select({ total: sql<number>`count(*)` }).from(products),
      this.db.select({ total: sql<number>`count(*)` }).from(quotes),
      this.db.select({ total: sql<number>`count(*)` }).from(quotes).where(eq(quotes.status, 'pending')),
      this.db.select({ total: sql<number>`count(*) filter (where status not in ('delivered','cancelled'))` }).from(orders),
      this.db.select({ total: sql<number>`count(*)` }).from(contacts).where(eq(contacts.read, false)),
      this.db.select().from(quotes).orderBy(desc(quotes.createdAt)).limit(5),
      this.db.select().from(contacts).orderBy(desc(contacts.createdAt)).limit(5),
    ]);

    return {
      totalProducts: Number(totalProducts),
      totalQuotes: Number(totalQuotes),
      pendingQuotes: Number(pendingQuotes),
      activeOrders: Number(activeOrders),
      unreadContacts: Number(unreadContacts),
      recentQuotes,
      recentContacts,
    };
  }
}
