import { Injectable, Logger, Inject, OnModuleInit } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { DB_TOKEN, Db } from '../db/db.module';
import { settings } from '@ltic/db';

@Injectable()
export class MailService implements OnModuleInit {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter | null = null;
  private fromAddress = '';

  constructor(@Inject(DB_TOKEN) private db: Db) {
    const host = process.env.MAIL_HOST;
    const user = process.env.MAIL_USER;
    const pass = process.env.MAIL_PASS;
    if (host && user && pass) {
      this.fromAddress = process.env.MAIL_FROM || user;
      this.transporter = nodemailer.createTransport({
        host,
        port: Number(process.env.MAIL_PORT || 587),
        secure: process.env.MAIL_SECURE === 'true',
        auth: { user, pass },
      });
      this.logger.log('Email configured from environment variables');
    }
  }

  async onModuleInit() {
    if (!this.transporter) await this.loadFromDb();
  }

  private async loadFromDb(): Promise<void> {
    try {
      const rows = await this.db.select().from(settings);
      const m: Record<string, string> = {};
      for (const r of rows) if (r.key.startsWith('smtp_') && r.value) m[r.key] = r.value;
      if (m.smtp_host && m.smtp_user && m.smtp_password) {
        this.configure({
          host: m.smtp_host,
          port: Number(m.smtp_port || 587),
          user: m.smtp_user,
          pass: m.smtp_password,
          from: m.smtp_from,
          secure: m.smtp_secure === 'true',
        });
        this.logger.log('Email configured from database settings');
      } else {
        this.logger.warn('Email not configured — set SMTP credentials in Admin → Settings or in .env');
      }
    } catch {
      this.logger.warn('Could not load SMTP settings from database');
    }
  }

  configure(config: { host: string; port: number; user: string; pass: string; from?: string; secure?: boolean }) {
    this.fromAddress = config.from || config.user;
    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure ?? false,
      auth: { user: config.user, pass: config.pass },
    });
  }

  async reinitialize() {
    if (process.env.MAIL_HOST && process.env.MAIL_USER && process.env.MAIL_PASS) return;
    this.transporter = null;
    this.fromAddress = '';
    await this.loadFromDb();
  }

  async send(to: string, subject: string, html: string): Promise<void> {
    if (!this.transporter) return;
    try {
      await this.transporter.sendMail({ from: `"LTIC SARL" <${this.fromAddress}>`, to, subject, html });
    } catch (err: any) {
      this.logger.error(`Failed to send email to ${to}: ${err.message}`);
    }
  }

  async sendWithResult(to: string, subject: string, html: string): Promise<{ sent: boolean; error?: string }> {
    if (!this.transporter) return { sent: false, error: 'Email not configured on this server' };
    try {
      await this.transporter.sendMail({ from: `"LTIC SARL" <${this.fromAddress}>`, to, subject, html });
      return { sent: true };
    } catch (err: any) {
      this.logger.error(`Failed to send email to ${to}: ${err.message}`);
      return { sent: false, error: err.message };
    }
  }

  async sendAdminNotification(subject: string, html: string): Promise<void> {
    if (!this.transporter) return;
    const to = process.env.ADMIN_EMAIL || this.fromAddress;
    try {
      await this.transporter.sendMail({ from: `"LTIC SARL" <${this.fromAddress}>`, to, subject, html });
      this.logger.log(`Admin notification sent to ${to}: ${subject}`);
    } catch (err: any) {
      this.logger.error(`Failed to send admin email: ${err.message}`);
    }
  }

  private siteUrl(): string {
    return process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  }

  // ─── Templates ───────────────────────────────────────────────────────────────

  quoteConfirmationEmail(quote: { contactName: string; productInterest: string; email: string }): string {
    return `
      <div style="font-family:sans-serif;max-width:600px;margin:auto">
        <h2 style="color:#1a56db">Quote Request Received — LTIC SARL</h2>
        <p>Dear ${quote.contactName},</p>
        <p>Thank you for your interest in <strong>${quote.productInterest}</strong>. We have received your quote request and our team will get back to you within 2 business days.</p>
        <p style="color:#6b7280;font-size:13px"><em>Cher(e) ${quote.contactName}, merci de l'intérêt que vous portez à <strong>${quote.productInterest}</strong>. Nous avons bien reçu votre demande de devis et notre équipe vous répondra dans les 2 jours ouvrables.</em></p>
        <p style="margin-top:24px;color:#6b7280">LTIC SARL — International Logistics & Trade</p>
      </div>`;
  }

  contactConfirmationEmail(contact: { name: string; subject: string }): string {
    return `
      <div style="font-family:sans-serif;max-width:600px;margin:auto">
        <h2 style="color:#1a56db">Message Received — LTIC SARL</h2>
        <p>Dear ${contact.name},</p>
        <p>Thank you for contacting us regarding <strong>"${contact.subject}"</strong>. We have received your message and will respond within 1–2 business days.</p>
        <p style="color:#6b7280;font-size:13px"><em>Cher(e) ${contact.name}, merci de nous avoir contactés concernant <strong>"${contact.subject}"</strong>. Nous avons bien reçu votre message et vous répondrons dans 1 à 2 jours ouvrables.</em></p>
        <p style="margin-top:24px;color:#6b7280">LTIC SARL — International Logistics & Trade</p>
      </div>`;
  }

  passwordResetEmail(resetUrl: string): string {
    return `
      <div style="font-family:sans-serif;max-width:600px;margin:auto">
        <h2 style="color:#1a56db">Password Reset — LTIC SARL</h2>
        <p>You requested a password reset. Click the button below to set a new password. This link expires in 1 hour.</p>
        <p style="margin-top:24px"><a href="${resetUrl}" style="background:#1a56db;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none">Reset Password</a></p>
        <p style="margin-top:16px;color:#6b7280;font-size:12px">If you did not request this, you can safely ignore this email.</p>
      </div>`;
  }

  emailVerificationEmail(verifyUrl: string, name: string): string {
    return `
      <div style="font-family:sans-serif;max-width:600px;margin:auto">
        <h2 style="color:#1a56db">Verify Your Email — LTIC SARL</h2>
        <p>Welcome, ${name}! Please verify your email address to activate your account.</p>
        <p style="margin-top:24px"><a href="${verifyUrl}" style="background:#1a56db;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none">Verify Email</a></p>
        <p style="margin-top:16px;color:#6b7280;font-size:12px">This link expires in 24 hours.</p>
      </div>`;
  }

  quoteEmail(quote: Record<string, string | undefined>): string {
    return `
      <div style="font-family:sans-serif;max-width:600px;margin:auto">
        <h2 style="color:#1a56db">New Quote Request — LTIC SARL</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:6px 0;color:#6b7280">Name</td><td style="padding:6px 0;font-weight:600">${quote.contactName ?? quote.name ?? '—'}</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280">Company</td><td style="padding:6px 0">${quote.companyName ?? quote.company ?? '—'}</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280">Email</td><td style="padding:6px 0">${quote.email ?? '—'}</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280">Phone</td><td style="padding:6px 0">${quote.phone ?? '—'}</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280">Country</td><td style="padding:6px 0">${quote.country ?? '—'}</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280">Product Interest</td><td style="padding:6px 0">${quote.productInterest ?? quote.serviceType ?? '—'}</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280">Quantity</td><td style="padding:6px 0">${quote.quantity ?? '—'}</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280">Message</td><td style="padding:6px 0">${quote.message ?? '—'}</td></tr>
        </table>
        <p style="margin-top:24px"><a href="${process.env.NEXT_PUBLIC_API_URL?.replace(':4000', ':3000') ?? 'http://localhost:3000'}/admin/quotes" style="background:#1a56db;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none">View in Admin Panel</a></p>
      </div>`;
  }

  orderCreatedEmail(order: {
    clientName: string;
    trackingNumber: string;
    description?: string;
    origin?: string;
    destination?: string;
    estimatedDelivery?: string;
  }): string {
    const trackUrl = `${this.siteUrl()}/tracking?id=${order.trackingNumber}`;
    const rows = [
      order.description       ? `<tr><td style="padding:6px 0;color:#6b7280;width:160px">Description</td><td style="padding:6px 0">${order.description}</td></tr>` : '',
      order.origin            ? `<tr><td style="padding:6px 0;color:#6b7280">Origin / Origine</td><td style="padding:6px 0">${order.origin}</td></tr>` : '',
      order.destination       ? `<tr><td style="padding:6px 0;color:#6b7280">Destination</td><td style="padding:6px 0">${order.destination}</td></tr>` : '',
      order.estimatedDelivery ? `<tr><td style="padding:6px 0;color:#6b7280">Est. Delivery / Livraison</td><td style="padding:6px 0">${order.estimatedDelivery}</td></tr>` : '',
    ].filter(Boolean).join('');
    return `
      <div style="font-family:sans-serif;max-width:600px;margin:auto">
        <h2 style="color:#1a56db">Your Order Has Been Created — LTIC SARL</h2>
        <p>Dear ${order.clientName},</p>
        <p>Your order has been created and is now being processed by our logistics team. Use the tracking number below to monitor your shipment at any time.</p>
        <p style="color:#6b7280;font-size:13px"><em>Votre commande a été créée et est en cours de traitement par notre équipe logistique. Utilisez le numéro de suivi ci-dessous pour suivre votre expédition à tout moment.</em></p>
        <div style="background:#f3f4f6;border-radius:8px;padding:20px;text-align:center;margin:24px 0">
          <p style="margin:0 0 4px;color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:0.05em">Tracking Number / Numéro de Suivi</p>
          <p style="margin:0;font-size:24px;font-weight:700;font-family:monospace;color:#111827">${order.trackingNumber}</p>
        </div>
        ${rows ? `<table style="width:100%;border-collapse:collapse">${rows}</table>` : ''}
        <p style="margin-top:24px">
          <a href="${trackUrl}" style="background:#1a56db;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600">Track My Shipment / Suivre mon expédition</a>
        </p>
        <p style="margin-top:24px;color:#6b7280;font-size:13px">If you have any questions, please reply to this email or visit our website.<br><em>Si vous avez des questions, répondez à cet e-mail ou visitez notre site web.</em></p>
        <p style="color:#6b7280">LTIC SARL — International Logistics & Trade</p>
      </div>`;
  }

  orderStatusEmail(order: {
    clientName: string;
    trackingNumber: string;
    status: string;
    description?: string;
  }): string {
    const trackUrl = `${this.siteUrl()}/tracking?id=${order.trackingNumber}`;
    const statusLabels: Record<string, { en: string; fr: string; color: string }> = {
      processing:      { en: 'Processing',       fr: 'En traitement',  color: '#6366f1' },
      'customs-cleared': { en: 'Customs Cleared', fr: 'Dédouané',       color: '#0ea5e9' },
      shipped:         { en: 'Shipped',           fr: 'Expédié',        color: '#f59e0b' },
      'in-transit':    { en: 'In Transit',        fr: 'En transit',     color: '#3b82f6' },
      delivered:       { en: 'Delivered',         fr: 'Livré',          color: '#22c55e' },
      cancelled:       { en: 'Cancelled',         fr: 'Annulé',         color: '#ef4444' },
    };
    const label = statusLabels[order.status] ?? { en: order.status, fr: order.status, color: '#6b7280' };
    return `
      <div style="font-family:sans-serif;max-width:600px;margin:auto">
        <h2 style="color:#1a56db">Shipment Status Update — LTIC SARL</h2>
        <p>Dear ${order.clientName},</p>
        <p>Your shipment status has been updated.</p>
        <div style="background:#f3f4f6;border-radius:8px;padding:20px;text-align:center;margin:24px 0">
          <p style="margin:0 0 8px;color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:0.05em">Tracking / Numéro de Suivi</p>
          <p style="margin:0 0 16px;font-size:20px;font-weight:700;font-family:monospace;color:#111827">${order.trackingNumber}</p>
          <span style="display:inline-block;background:${label.color}1a;color:${label.color};border:1px solid ${label.color}40;padding:6px 18px;border-radius:999px;font-weight:700;font-size:15px">${label.en} / ${label.fr}</span>
        </div>
        ${order.description ? `<p style="color:#6b7280;font-size:13px">Description: ${order.description}</p>` : ''}
        <p style="margin-top:24px">
          <a href="${trackUrl}" style="background:#1a56db;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600">Track My Shipment / Suivre mon expédition</a>
        </p>
        <p style="margin-top:24px;color:#6b7280;font-size:13px">If you have any questions, please contact us.<br><em>Pour toute question, veuillez nous contacter.</em></p>
        <p style="color:#6b7280">LTIC SARL — International Logistics & Trade</p>
      </div>`;
  }

  adminReplyEmail(opts: { recipientName: string; originalSubject: string; replyMessage: string }): string {
    return `
      <div style="font-family:sans-serif;max-width:600px;margin:auto">
        <h2 style="color:#1a56db">Reply from LTIC SARL</h2>
        <p>Dear ${opts.recipientName},</p>
        <p>Thank you for reaching out to us regarding <strong>"${opts.originalSubject}"</strong>. Here is our response:</p>
        <div style="background:#f3f4f6;border-left:4px solid #1a56db;padding:16px 20px;margin:20px 0;border-radius:0 6px 6px 0">
          <p style="margin:0;white-space:pre-wrap;line-height:1.6">${opts.replyMessage}</p>
        </div>
        <p>If you have further questions, please don't hesitate to contact us again.</p>
        <p style="color:#6b7280;font-size:13px"><em>Cher(e) ${opts.recipientName}, merci de nous avoir contactés. Si vous avez d'autres questions, n'hésitez pas à nous contacter à nouveau.</em></p>
        <p style="margin-top:24px;color:#6b7280">LTIC SARL — International Logistics & Trade</p>
      </div>`;
  }

  contactEmail(contact: Record<string, string | undefined>): string {
    return `
      <div style="font-family:sans-serif;max-width:600px;margin:auto">
        <h2 style="color:#1a56db">New Contact Message — LTIC SARL</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:6px 0;color:#6b7280">Name</td><td style="padding:6px 0;font-weight:600">${contact.name ?? '—'}</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280">Email</td><td style="padding:6px 0">${contact.email ?? '—'}</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280">Phone</td><td style="padding:6px 0">${contact.phone ?? '—'}</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280">Subject</td><td style="padding:6px 0">${contact.subject ?? '—'}</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280">Message</td><td style="padding:6px 0">${contact.message ?? '—'}</td></tr>
        </table>
        <p style="margin-top:24px"><a href="${process.env.NEXT_PUBLIC_API_URL?.replace(':4000', ':3000') ?? 'http://localhost:3000'}/admin/contacts" style="background:#1a56db;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none">View in Admin Panel</a></p>
      </div>`;
  }
}
