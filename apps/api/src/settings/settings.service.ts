import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DB_TOKEN, Db } from '../db/db.module';
import { settings } from '@ltic/db';

@Injectable()
export class SettingsService {
  constructor(@Inject(DB_TOKEN) private db: Db) {}

  private static PRIVATE_KEYS = /(_api_key|_secret|_key|_token|password)$/i;

  async findAll(): Promise<Record<string, string>> {
    const rows = await this.db.select().from(settings);
    return rows.reduce((acc: Record<string, string>, row: any) => {
      if (!SettingsService.PRIVATE_KEYS.test(row.key)) {
        acc[row.key] = row.value ?? '';
      }
      return acc;
    }, {});
  }

  async update(data: Record<string, string>) {
    const ops = Object.entries(data).map(([key, value]) =>
      this.db.insert(settings).values({ key, value, updatedAt: new Date() })
        .onConflictDoUpdate({ target: settings.key, set: { value, updatedAt: new Date() } })
    );
    await Promise.all(ops);
    return this.findAll();
  }
}
