#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════
# LTIC SARL — Deploy / Update Script
# Run this every time you push new changes and want to update the live site.
#
# Usage (from project root on the server):
#   bash o2switch/deploy.sh
# ═══════════════════════════════════════════════════════════════════════════

set -e

source "$HOME/.nvm/nvm.sh"
nvm use 20

echo ""
echo "══════════════════════════════════════════"
echo "  LTIC SARL — Deploying update..."
echo "══════════════════════════════════════════"

START_TIME=$(date +%s)

# ── 1. Pull latest code ───────────────────────────────────────────────────────
echo ""
echo "▶ [1/6] Pulling latest code from GitHub..."
git pull origin v3-design
echo "   Done — $(git log --oneline -1)"

# ── 2. Install / update dependencies ─────────────────────────────────────────
echo ""
echo "▶ [2/6] Installing dependencies..."
pnpm install --frozen-lockfile

# ── 3. Build API ──────────────────────────────────────────────────────────────
echo ""
echo "▶ [3/6] Building NestJS API..."
pnpm --filter api build
echo "   API build complete"

# ── 4. Build Next.js frontend ────────────────────────────────────────────────
echo ""
echo "▶ [4/6] Building Next.js frontend..."
pnpm --filter web build
echo "   Frontend build complete"

# ── 5. Copy static files into standalone ─────────────────────────────────────
echo ""
echo "▶ [5/6] Copying static assets..."
rm -rf apps/web/.next/standalone/apps/web/public
rm -rf apps/web/.next/standalone/apps/web/.next/static

mkdir -p apps/web/.next/standalone/apps/web/public
mkdir -p apps/web/.next/standalone/apps/web/.next

cp -r apps/web/public/. apps/web/.next/standalone/apps/web/public/
cp -r apps/web/.next/static apps/web/.next/standalone/apps/web/.next/static
echo "   Static assets copied"

# ── 6. Reload apps with zero downtime ────────────────────────────────────────
echo ""
echo "▶ [6/6] Reloading apps (zero-downtime)..."
pm2 reload ecosystem.config.cjs --update-env
pm2 save
echo "   Apps reloaded"

# ── Summary ───────────────────────────────────────────────────────────────────
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

echo ""
echo "══════════════════════════════════════════"
echo "  ✅  Deploy complete in ${DURATION}s"
echo "══════════════════════════════════════════"
echo ""
pm2 status
echo ""
echo "  Tail logs:  pm2 logs --lines 50"
echo ""
