import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq, desc } from 'drizzle-orm';
import { DB_TOKEN, Db } from '../db/db.module';
import { quotes, NewQuote, Quote } from '@ltic/db';
import { NotificationsService } from '../notifications/notifications.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class QuotesService {
  constructor(
    @Inject(DB_TOKEN) private db: Db,
    private notifications: NotificationsService,
    private mail: MailService,
  ) {}

  async findAll(opts: { status?: string; limit: number; offset: number }) {
    if (opts.status)
      return this.db.select().from(quotes).where(eq(quotes.status, opts.status))
        .orderBy(desc(quotes.createdAt)).limit(opts.limit).offset(opts.offset);
    return this.db.select().from(quotes).orderBy(desc(quotes.createdAt)).limit(opts.limit).offset(opts.offset);
  }

  async findOne(id: number) {
    const [q] = await this.db.select().from(quotes).where(eq(quotes.id, id));
    if (!q) throw new NotFoundException('Quote not found');
    return q;
  }

  async create(data: NewQuote) {
    const [q] = await this.db.insert(quotes).values(data).returning();
    // fire-and-forget: don't block the response
    this.notifications.create({
      type: 'quote',
      title: `New quote from ${data.contactName ?? 'Unknown'}`,
      message: `${data.companyName ? data.companyName + ' · ' : ''}${data.productInterest ?? 'General enquiry'} — ${data.email ?? ''}`,
      link: '/admin/quotes',
    }).catch(() => {});
    this.mail.sendAdminNotification(
      `New Quote Request from ${data.contactName ?? 'Unknown'}`,
      this.mail.quoteEmail(data as unknown as Record<string, string | undefined>),
    ).catch(() => {});
    if (data.email) {
      this.mail.send(
        data.email,
        'Quote Request Received — LTIC SARL',
        this.mail.quoteConfirmationEmail({ contactName: data.contactName ?? '', productInterest: data.productInterest ?? '', email: data.email }),
      ).catch(() => {});
    }
    return q;
  }

  async delete(id: number) {
    const [q] = await this.db.delete(quotes).where(eq(quotes.id, id)).returning();
    if (!q) throw new NotFoundException('Quote not found');
    return q;
  }

  async update(id: number, data: Partial<Quote>) {
    const [q] = await this.db.update(quotes).set({ ...data, updatedAt: new Date() })
      .where(eq(quotes.id, id)).returning();
    if (!q) throw new NotFoundException('Quote not found');
    return q;
  }

  async reply(id: number, message: string) {
    const [q] = await this.db.select().from(quotes).where(eq(quotes.id, id));
    if (!q) throw new NotFoundException('Quote not found');
    if (!q.email) throw new NotFoundException('Quote has no email address');

    const result = await this.mail.sendWithResult(
      q.email,
      `Re: Your Quote Request — LTIC SARL`,
      this.mail.adminReplyEmail({
        recipientName: q.contactName ?? q.companyName ?? 'Customer',
        originalSubject: q.productInterest ?? 'Your quote request',
        replyMessage: message,
      }),
    );
    return result;
  }
}
