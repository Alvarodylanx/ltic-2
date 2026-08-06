import "reflect-metadata";
import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

import { z } from "zod";

const optionalEmail = z.preprocess(
  (v) => (v === "" ? undefined : v),
  z.string().email().optional(),
);
const optionalUrl = z.preprocess(
  (v) => (v === "" ? undefined : v),
  z.string().url().optional(),
);

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL must be a non-empty PostgreSQL connection string"),
  SESSION_SECRET: z.string().min(32, "SESSION_SECRET must be at least 32 characters"),
  PORT: z.string().regex(/^\d+$/).optional(),
  ADMIN_PASSWORD: z.string().optional(),
  ADMIN_EMAIL: optionalEmail,
  MAIL_HOST: z.string().optional(),
  MAIL_USER: z.string().optional(),
  MAIL_PASS: z.string().optional(),
  NEXT_PUBLIC_SITE_URL: optionalUrl,
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error("FATAL: Invalid environment variables:");
  for (const issue of parsed.error.issues) {
    console.error(`  ${issue.path.join(".")}: ${issue.message}`);
  }
  process.exit(1);
}

import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app.module";
import * as fs from "fs";
import cookieParser from "cookie-parser";
import compression from "compression";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ["error", "warn", "log"],
  });

  app.setGlobalPrefix("api");
  app.use(compression());
  app.use(cookieParser());

  // Security headers
  const helmet = (await import("helmet")).default;
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https://images.unsplash.com", "https://res.cloudinary.com", "https://upload.wikimedia.org", "https://commons.wikimedia.org", "blob:"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'", "https:"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
  }));

  const uploadsDir = path.join(__dirname, "../../../uploads");
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
  app.useStaticAssets(uploadsDir, { prefix: "/uploads" });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const allowedOrigins = siteUrl
    ? [siteUrl, "http://localhost:3000", "http://127.0.0.1:3000"]
    : ["http://localhost:3000", "http://127.0.0.1:3000"];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`LTIC SARL API running on http://localhost:${port}/api`);
}

bootstrap();
