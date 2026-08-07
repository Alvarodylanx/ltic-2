import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    const host = process.env.MAIL_HOST;
    const user = process.env.MAIL_USER;
    const pass = process.env.MAIL_PASS;

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port: Number(process.env.MAIL_PORT || 587),
        secure: process.env.MAIL_SECURE === 'true',
        auth: { user, pass },
      });
    } else {
      this.logger.warn('Email not configured — set MAIL_HOST, MAIL_USER, MAIL_PASS to enable email notifications');
    }
  }

  async send(to: string, subject: string, html: string): Promise<void> {
    if (!this.transporter) return;
    const from = process.env.MAIL_FROM || process.env.MAIL_USER;
    try {
      await this.transporter.sendMail({ from: `"LTIC SARL" <${from}>`, to, subject, html });
    } catch (err: any) {
      this.logger.error(`Failed to send email to ${to}: ${err.message}`);
    }
  }

  async sendWithResult(to: string, subject: string, html: string): Promise<{ sent: boolean; error?: string }> {
    if (!this.transporter) return { sent: false, error: 'Email not configured on this server' };
    const from = process.env.MAIL_FROM || process.env.MAIL_USER;
    try {
      await this.transporter.sendMail({ from: `"LTIC SARL" <${from}>`, to, subject, html });
      return { sent: true };
    } catch (err: any) {
      this.logger.error(`Failed to send email to ${to}: ${err.message}`);
      return { sent: false, error: err.message };
    }
  }

  async sendAdminNotification(subject: string, html: string): Promise<void> {
    if (!this.transporter) return;
    const to = process.env.ADMIN_EMAIL || process.env.MAIL_USER;
    const from = process.env.MAIL_FROM || process.env.MAIL_USER;
    try {
      await this.transporter.sendMail({ from: `"LTIC SARL" <${from}>`, to, subject, html });
    } catch (err: any) {
      this.logger.error(`Failed to send email: ${err.message}`);
    }
  }

  private siteUrl(): string {
    return process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  }

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
          <tr><td style="padding:6px 0;color:#6b7280">Name</td><td style="padding:6px 0;font-weight:600">${quote.name ?? '—'}</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280">Company</td><td style="padding:6px 0">${quote.company ?? '—'}</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280">Email</td><td style="padding:6px 0">${quote.email ?? '—'}</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280">Phone</td><td style="padding:6px 0">${quote.phone ?? '—'}</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280">Country</td><td style="padding:6px 0">${quote.country ?? '—'}</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280">Service</td><td style="padding:6px 0">${quote.serviceType ?? '—'}</td></tr>
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
      order.description      ? `<tr><td style="padding:6px 0;color:#6b7280;width:160px">Description</td><td style="padding:6px 0">${order.description}</td></tr>` : '',
      order.origin           ? `<tr><td style="padding:6px 0;color:#6b7280">Origin / Origine</td><td style="padding:6px 0">${order.origin}</td></tr>` : '',
      order.destination      ? `<tr><td style="padding:6px 0;color:#6b7280">Destination</td><td style="padding:6px 0">${order.destination}</td></tr>` : '',
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
