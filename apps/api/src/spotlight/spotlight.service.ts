import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DB_TOKEN, Db } from '../db/db.module';
import { spotlight, Spotlight, NewSpotlight } from '@ltic/db';

const SINGLETON_ID = 1;

@Injectable()
export class SpotlightService {
  constructor(@Inject(DB_TOKEN) private db: Db) {}

  async get(): Promise<Spotlight | null> {
    const [row] = await this.db.select().from(spotlight).where(eq(spotlight.id, SINGLETON_ID));
    return row ?? null;
  }

  async upsert(data: Partial<NewSpotlight>): Promise<Spotlight> {
    const existing = await this.get();
    if (existing) {
      const [row] = await this.db
        .update(spotlight)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(spotlight.id, SINGLETON_ID))
        .returning();
      return row;
    }
    const [row] = await this.db
      .insert(spotlight)
      .values({ id: SINGLETON_ID, ...data } as any)
      .returning();
    return row;
  }
}
