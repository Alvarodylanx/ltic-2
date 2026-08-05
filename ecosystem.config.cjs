/**
 * PM2 Process Manager Configuration — LTIC SARL
 * Manages both the Next.js frontend and NestJS API with auto-restart.
 *
 * Usage:
 *   pm2 start ecosystem.config.cjs   ← first time
 *   pm2 reload ecosystem.config.cjs  ← after a deploy (zero-downtime)
 *   pm2 save                          ← save process list for auto-start
 */

const path = require('path');
const ROOT = __dirname; // project root (where this file lives)

module.exports = {
  apps: [
    /* ── 1. Next.js Frontend ─────────────────────────────────────────── */
    {
      name: 'ltic-web',
      script: path.join(ROOT, 'apps/web/.next/standalone/server.js'),
      cwd: path.join(ROOT, 'apps/web/.next/standalone'),
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '127.0.0.1',
      },
      error_file: path.join(ROOT, 'logs/web-error.log'),
      out_file:   path.join(ROOT, 'logs/web-out.log'),
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },

    /* ── 2. NestJS API ───────────────────────────────────────────────── */
    {
      name: 'ltic-api',
      script: path.join(ROOT, 'apps/api/dist/main.js'),
      cwd: ROOT,
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
      },
      error_file: path.join(ROOT, 'logs/api-error.log'),
      out_file:   path.join(ROOT, 'logs/api-out.log'),
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
  ],
};
