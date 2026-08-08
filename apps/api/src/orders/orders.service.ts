import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { eq, desc, sql } from 'drizzle-orm';
import { DB_TOKEN, Db } from '../db/db.module';
import { orders, Order, OrderTimelineItem } from '@ltic/db';
import { MailService } from '../mail/mail.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class OrdersService {
  constructor(
    @Inject(DB_TOKEN) private db: Db,
    private mail: MailService,
    private notifications: NotificationsService,
  ) {}

  private generateTrackingNumber(): string {
    const now = new Date();
    const yymm = String(now.getFullYear()).slice(2) + String(now.getMonth() + 1).padStart(2, '0');
    const rand = Math.floor(Math.random() * 1_000_000).toString().padStart(6, '0');
    return `LTIC${yymm}${rand}`;
  }

  async create(data: {
    clientName: string;
    clientEmail?: string;
    customerId?: number;
    quoteId?: number;
    origin?: string;
    destination?: string;
    description?: string;
    status?: string;
    estimatedDelivery?: string;
  }) {
    if (data.quoteId) {
      const [existing] = await this.db.select({ id: orders.id })
        .from(orders).where(eq(orders.quoteId, data.quoteId));
      if (existing) throw new ConflictException('An order already exists for this quote');
    }

    const trackingNumber = (data as any)['trackingNumber'] || this.generateTrackingNumber();
    const [order] = await this.db.insert(orders).values({
      trackingNumber,
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      customerId: data.customerId || null,
      quoteId: data.quoteId || null,
      origin: data.origin,
      destination: data.destination,
      description: data.description,
      status: data.status || 'processing',
      estimatedDelivery: data.estimatedDelivery,
    }).returning();

    this.notifications.create({
      type: 'order',
      title: `New order created for ${data.clientName}`,
      message: `${order.trackingNumber}${data.description ? ' · ' + data.description : ''}`,
      link: '/admin/orders',
    }).catch(() => {});

    if (order.clientEmail) {
      this.mail.send(
        order.clientEmail,
        `Your Order ${order.trackingNumber} — LTIC SARL`,
        this.mail.orderCreatedEmail(order),
      );
    }

    return order;
  }

  async addTimelineEvent(id: number, event: OrderTimelineItem) {
    const [order] = await this.db.select().from(orders).where(eq(orders.id, id));
    if (!order) throw new NotFoundException('Order not found');

    const timeline: OrderTimelineItem[] = Array.isArray(order.timeline) ? [...order.timeline] : [];
    timeline.push(event);

    const [updated] = await this.db.update(orders)
      .set({ timeline, status: event.status, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();

    if (order.clientEmail) {
      this.mail.send(
        order.clientEmail,
        `Shipment Update: ${order.trackingNumber} — LTIC SARL`,
        this.mail.orderTimelineEmail({
          clientName: order.clientName,
          trackingNumber: order.trackingNumber,
          event,
        }),
      ).catch(() => {});
    }

    return updated;
  }

  async removeTimelineEvent(id: number, index: number) {
    const [order] = await this.db.select().from(orders).where(eq(orders.id, id));
    if (!order) throw new NotFoundException('Order not found');

    const timeline: OrderTimelineItem[] = Array.isArray(order.timeline) ? [...order.timeline] : [];
    timeline.splice(index, 1);

    const [updated] = await this.db.update(orders)
      .set({ timeline, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return updated;
  }

  async track(trackingNumber: string) {
    const [order] = await this.db.select().from(orders).where(eq(orders.trackingNumber, trackingNumber));
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async findAll(opts: { status?: string; limit: number; offset: number }) {
    if (opts.status)
      return this.db.select().from(orders).where(eq(orders.status, opts.status))
        .orderBy(desc(orders.createdAt)).limit(opts.limit).offset(opts.offset);
    return this.db.select().from(orders).orderBy(desc(orders.createdAt)).limit(opts.limit).offset(opts.offset);
  }

  async countActive() {
    const [{ count }] = await this.db.select({
      count: sql<number>`count(*) filter (where status not in ('delivered','cancelled'))`,
    }).from(orders);
    return Number(count);
  }

  async findOne(id: number) {
    const [order] = await this.db.select().from(orders).where(eq(orders.id, id));
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async findByCustomer(customerId: number) {
    return this.db.select().from(orders).where(eq(orders.customerId, customerId))
      .orderBy(desc(orders.createdAt));
  }

  async delete(id: number) {
    const [order] = await this.db.delete(orders).where(eq(orders.id, id)).returning();
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async update(id: number, data: Partial<Order>) {
    const [before] = await this.db.select({ status: orders.status, clientEmail: orders.clientEmail, clientName: orders.clientName, trackingNumber: orders.trackingNumber, description: orders.description })
      .from(orders).where(eq(orders.id, id));

    const [order] = await this.db.update(orders).set({ ...data, updatedAt: new Date() })
      .where(eq(orders.id, id)).returning();
    if (!order) throw new NotFoundException('Order not found');

    if (before && data.status && data.status !== before.status) {
      this.notifications.create({
        type: 'order',
        title: `Order status updated: ${order.trackingNumber}`,
        message: `${before.clientName} — ${before.status} → ${data.status}`,
        link: '/admin/orders',
      }).catch(() => {});

      if (before.clientEmail) {
        this.mail.send(
          before.clientEmail,
          `Shipment Update: ${before.trackingNumber} — LTIC SARL`,
          this.mail.orderStatusEmail({
            clientName: before.clientName,
            trackingNumber: before.trackingNumber,
            status: data.status,
            description: before.description ?? undefined,
          }),
        );
      }
    }

    return order;
  }
}
