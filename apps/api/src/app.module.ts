import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { Pool } from "pg";
import * as dotenv from "dotenv";
dotenv.config();

import { DbModule } from "./db/db.module";
import { AdminModule } from "./admin/admin.module";
import { ProductsModule } from "./products/products.module";
import { CategoriesModule } from "./categories/categories.module";
import { QuotesModule } from "./quotes/quotes.module";
import { OrdersModule } from "./orders/orders.module";
import { NewsModule } from "./news/news.module";
import { ContactsModule } from "./contacts/contacts.module";
import { SettingsModule } from "./settings/settings.module";
import { CustomersModule } from "./customers/customers.module";
import { StatsModule } from "./stats/stats.module";
import { HealthModule } from "./health/health.module";
import { AuthModule } from "./auth/auth.module";
import { VersionModule } from "./version/version.module";
import { UploadModule } from "./upload/upload.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { UnifiedAuthModule } from "./auth/unified-auth.module";
import { PartnersModule } from "./partners/partners.module";
import { AiModule } from "./ai/ai.module";
import { SpotlightModule } from "./spotlight/spotlight.module";

export const DB_PROVIDER = "DB_POOL";

@Module({
  imports: [
    ThrottlerModule.forRoot([
      { name: "login",   ttl: 15 * 60 * 1000, limit: 20 },  // 20 attempts per 15 min
      { name: "form",    ttl: 60 * 60 * 1000, limit: 10 },  // 10 per hour
      { name: "general", ttl: 60 * 1000,      limit: 100 }, // 100 per minute
    ]),
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.register({
      global: true,
      secret: process.env.SESSION_SECRET,
      signOptions: { expiresIn: "24h" },
    }),
    DbModule,
    AuthModule,
    AdminModule,
    ProductsModule,
    CategoriesModule,
    QuotesModule,
    OrdersModule,
    NewsModule,
    ContactsModule,
    SettingsModule,
    StatsModule,
    HealthModule,
    CustomersModule,
    VersionModule,
    UploadModule,
    NotificationsModule,
    UnifiedAuthModule,
    PartnersModule,
    AiModule,
    SpotlightModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    {
      provide: DB_PROVIDER,
      useFactory: () => {
        return new Pool({
          connectionString: process.env.DATABASE_URL,
        });
      },
    },
  ],
  exports: [DB_PROVIDER],
})
export class AppModule {}
