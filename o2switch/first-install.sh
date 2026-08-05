#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════
# LTIC SARL — First-Time Server Setup Script
# Run this ONCE after SSHing into your o2switch server.
#
# Usage:
#   chmod +x o2switch/first-install.sh
#   bash o2switch/first-install.sh
# ═══════════════════════════════════════════════════════════════════════════

set -e  # stop immediately if any command fails

echo ""
echo "══════════════════════════════════════════"
echo "  LTIC SARL — First-Time Install"
echo "══════════════════════════════════════════"

# ── 1. Install Node.js via NVM ───────────────────────────────────────────────
echo ""
echo "▶ Installing NVM and Node.js 20..."
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"
nvm install 20
nvm use 20
nvm alias default 20
echo "   Node $(node -v) installed"

# ── 2. Install pnpm ──────────────────────────────────────────────────────────
echo ""
echo "▶ Installing pnpm..."
npm install -g pnpm
echo "   pnpm $(pnpm -v) installed"

# ── 3. Install PM2 ───────────────────────────────────────────────────────────
echo ""
echo "▶ Installing PM2..."
npm install -g pm2
echo "   PM2 $(pm2 -v) installed"

# ── 4. Clone the repository ──────────────────────────────────────────────────
echo ""
echo "▶ Cloning repository..."
cd "$HOME"
git clone https://github.com/Alvarodylanx/ltic-2.git ltic-sarl
cd "$HOME/ltic-sarl"
git checkout v3-design
echo "   Repository cloned at $HOME/ltic-sarl"

# ── 5. Set up environment variables ─────────────────────────────────────────
echo ""
echo "▶ Setting up .env..."
cp o2switch/.env.production.example .env
echo ""
echo "  ⚠️  IMPORTANT: Edit .env now before continuing!"
echo "  Run:  nano .env"
echo "  Fill in: DATABASE_URL, SESSION_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD,"
echo "           MAIL_HOST, MAIL_USER, MAIL_PASS"
echo ""
read -p "  Press ENTER when you have finished editing .env ..."

# ── 6. Install dependencies ──────────────────────────────────────────────────
echo ""
echo "▶ Installing dependencies (this may take a few minutes)..."
pnpm install --frozen-lockfile

# ── 7. Run database migrations ───────────────────────────────────────────────
echo ""
echo "▶ Running database migrations..."
pnpm run db:push
echo "   Database schema created"

# ── 8. Build both apps ───────────────────────────────────────────────────────
echo ""
echo "▶ Building NestJS API..."
pnpm --filter api build

echo ""
echo "▶ Building Next.js frontend (this takes ~2 minutes)..."
pnpm --filter web build

# ── 9. Copy Next.js static files into standalone build ───────────────────────
echo ""
echo "▶ Copying static assets into standalone build..."
mkdir -p apps/web/.next/standalone/apps/web/public
mkdir -p apps/web/.next/standalone/apps/web/.next

cp -r apps/web/public/. apps/web/.next/standalone/apps/web/public/
cp -r apps/web/.next/static apps/web/.next/standalone/apps/web/.next/static
echo "   Static files copied"

# ── 10. Create logs directory ────────────────────────────────────────────────
mkdir -p logs
echo "   Log directory created at logs/"

# ── 11. Start apps with PM2 ──────────────────────────────────────────────────
echo ""
echo "▶ Starting apps with PM2..."
pm2 start ecosystem.config.cjs
pm2 save
echo "   PM2 processes started and saved"

# ── 12. Set up auto-start on server reboot ──────────────────────────────────
echo ""
echo "▶ Configuring auto-start..."
# Generate the crontab entry for pm2 resurrection
PM2_PATH=$(which pm2)
CRON_LINE="@reboot sleep 20 && $PM2_PATH resurrect"

# Add to crontab if not already there
(crontab -l 2>/dev/null | grep -v 'pm2 resurrect'; echo "$CRON_LINE") | crontab -
echo "   Auto-start crontab entry added:"
echo "   $CRON_LINE"

# ── 13. Set up Apache .htaccess files ────────────────────────────────────────
echo ""
echo "▶ Setting up Apache .htaccess files..."

# Web domain
WEB_DIR="$HOME/www.lticsarl.com"
if [ -d "$WEB_DIR" ]; then
    cp o2switch/web.htaccess "$WEB_DIR/.htaccess"
    echo "   ✓ web.htaccess copied to $WEB_DIR/"
else
    echo "   ⚠ Directory $WEB_DIR not found."
    echo "     Manually copy o2switch/web.htaccess to your domain's web root."
fi

# API subdomain
API_DIR="$HOME/api.lticsarl.com"
if [ -d "$API_DIR" ]; then
    cp o2switch/api.htaccess "$API_DIR/.htaccess"
    echo "   ✓ api.htaccess copied to $API_DIR/"
else
    echo "   ⚠ Directory $API_DIR not found."
    echo "     Create the subdomain in cPanel first, then copy o2switch/api.htaccess"
fi

# ── DONE ─────────────────────────────────────────────────────────────────────
echo ""
echo "══════════════════════════════════════════"
echo "  ✅  Installation complete!"
echo "══════════════════════════════════════════"
echo ""
echo "  Check app status:    pm2 status"
echo "  View live logs:      pm2 logs"
echo "  View web logs:       pm2 logs ltic-web"
echo "  View API logs:       pm2 logs ltic-api"
echo ""
echo "  Your site:   https://www.lticsarl.com"
echo "  Your API:    https://api.lticsarl.com/api/health"
echo ""
