import { Injectable, Inject } from '@nestjs/common';
import { DB_TOKEN, Db } from '../db/db.module';
import { settings } from '@ltic/db';
import { MailService } from '../mail/mail.service';

@Injectable()
export class SettingsService {
  constructor(
    @Inject(DB_TOKEN) private db: Db,
    private mail: MailService,
  ) {}

  private static PRIVATE_KEYS = /(_api_key|_secret|_key|_token|_password)$/i;

  async findAll(): Promise<Record<string, string>> {
    const rows = await this.db.select().from(settings);
    return rows.reduce((acc: Record<string, string>, row: any) => {
      if (!SettingsService.PRIVATE_KEYS.test(row.key)) {
        acc[row.key] = row.value ?? '';
      }
      return acc;
    }, {});
  }

  async findAllAdmin(): Promise<Record<string, string>> {
    const rows = await this.db.select().from(settings);
    return rows.reduce((acc: Record<string, string>, row: any) => {
      acc[row.key] = row.value ?? '';
      return acc;
    }, {});
  }

  async update(data: Record<string, string>) {
    const ops = Object.entries(data).map(([key, value]) =>
      this.db.insert(settings).values({ key, value, updatedAt: new Date() })
        .onConflictDoUpdate({ target: settings.key, set: { value, updatedAt: new Date() } })
    );
    await Promise.all(ops);

    const hasSmtp = Object.keys(data).some(k => k.startsWith('smtp_'));
    if (hasSmtp) await this.mail.reinitialize();

    return this.findAll();
  }
}
