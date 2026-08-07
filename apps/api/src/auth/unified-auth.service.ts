import { Injectable, Inject, UnauthorizedException, BadRequestException, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import * as crypto from "crypto";
import { eq, sql as drizzleSql } from "drizzle-orm";
import { DB_TOKEN, Db } from "../db/db.module";
import { adminProfile, customers } from "@ltic/db";
import { LoginAttemptsService } from "./login-attempts.service";
import { MailService } from "../mail/mail.service";

@Injectable()
export class UnifiedAuthService {
  constructor(
    @Inject(DB_TOKEN) private db: Db,
    private jwtService: JwtService,
    private loginAttempts: LoginAttemptsService,
    private mail: MailService,
  ) {}

  async login(email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase();

    this.loginAttempts.check(normalizedEmail);

    // ── 1. Check admin_profile ────────────────────────────────────────────────
    const adminRows = await this.db.select().from(adminProfile).limit(1);
    if (adminRows.length > 0) {
      const admin = adminRows[0];
      if (admin.email.toLowerCase() === normalizedEmail) {
        const valid = admin.passwordHash
          ? await bcrypt.compare(password, admin.passwordHash)
          : password === process.env.ADMIN_PASSWORD;

        if (valid) {
          this.loginAttempts.clearAttempts(normalizedEmail);
          const token = await this.jwtService.signAsync(
            { email: admin.email, role: "admin" },
            { secret: process.env.SESSION_SECRET!, expiresIn: "24h" },
          );
          return {
            role: "admin",
            token,
            user: { name: admin.name, email: admin.email },
          };
        }
        this.loginAttempts.recordFailure(normalizedEmail);
        throw new UnauthorizedException("Invalid email or password");
      }
    }

    // ── 2. Check customers table ──────────────────────────────────────────────
    const [customer] = await this.db
      .select()
      .from(customers)
      .where(eq(customers.email, normalizedEmail))
      .limit(1);

    if (customer) {
      const valid = await bcrypt.compare(password, customer.passwordHash);
      if (!valid) {
        this.loginAttempts.recordFailure(normalizedEmail);
        throw new UnauthorizedException("Invalid email or password");
      }

      this.loginAttempts.clearAttempts(normalizedEmail);
      const token = await this.jwtService.signAsync(
        { sub: customer.id, email: customer.email, role: "customer" },
        { secret: process.env.SESSION_SECRET!, expiresIn: "7d" },
      );
      return {
        role: "customer",
        token,
        user: { name: customer.fullName, email: customer.email },
      };
    }

    this.loginAttempts.recordFailure(normalizedEmail);
    throw new UnauthorizedException("Invalid email or password");
  }

  async forgotPassword(email: string): Promise<void> {
    const normalized = email.trim().toLowerCase();

    // Admin accounts cannot use the self-service password reset flow.
    // They must update their password from Admin → Profile while logged in.
    const adminRows = await this.db.select({ email: adminProfile.email }).from(adminProfile).limit(1);
    if (adminRows.length > 0 && adminRows[0].email.toLowerCase() === normalized) return;

    const [customer] = await this.db.select().from(customers).where(eq(customers.email, normalized)).limit(1);
    if (!customer) return; // don't leak whether email exists

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.db.execute(drizzleSql`
      INSERT INTO password_reset_tokens (email, token, expires_at)
      VALUES (${normalized}, ${token}, ${expiresAt})
    `);

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const resetUrl = `${siteUrl}/auth/reset-password?token=${token}`;
    await this.mail.send(normalized, "Reset Your Password — LTIC SARL", this.mail.passwordResetEmail(resetUrl));
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    if (!newPassword || newPassword.length < 8) {
      throw new BadRequestException("Password must be at least 8 characters");
    }

    const result = await this.db.execute(drizzleSql`
      SELECT * FROM password_reset_tokens
      WHERE token = ${token}
        AND used = FALSE
        AND expires_at > NOW()
      LIMIT 1
    `);
    const row = result.rows[0] as { email: string; id: number } | undefined;
    if (!row) throw new BadRequestException("Invalid or expired reset link");

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await this.db.update(customers).set({ passwordHash, updatedAt: new Date() }).where(eq(customers.email, row.email));
    await this.db.execute(drizzleSql`UPDATE password_reset_tokens SET used = TRUE WHERE id = ${row.id}`);
  }
}
