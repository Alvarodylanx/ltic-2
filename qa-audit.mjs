/**
 * LTIC SARL – Full QA Audit Script
 * Tests: public pages, navigation, forms, auth guard, admin flow, 404, console errors, perf
 */
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

// Read credentials from the project .env so they never live in this script
function readEnv(file) {
  try {
    return Object.fromEntries(
      fs.readFileSync(file,'utf8').split('\n')
        .filter(l=>l&&!l.startsWith('#')&&l.includes('='))
        .map(l=>{ const i=l.indexOf('='); return [l.slice(0,i).trim(), l.slice(i+1).trim()]; })
    );
  } catch { return {}; }
}
const env = readEnv(path.resolve('../../.env'));

const BASE = 'http://localhost:3000';
const ADMIN_EMAIL = env.ADMIN_EMAIL || '';
const ADMIN_PASS  = env.ADMIN_PASSWORD || '';
const SHOTS_DIR   = 'qa-screenshots';
fs.mkdirSync(SHOTS_DIR, { recursive: true });

const results = [];
let shotIdx = 0;

async function shot(page, name) {
  const file = `${SHOTS_DIR}/${String(++shotIdx).padStart(3,'0')}-${name.replace(/[^a-z0-9]/gi,'-')}.png`;
  await page.screenshot({ path: file, fullPage: true });
  return file;
}

function pass(test, notes='')  { results.push({ status:'PASS', test, notes }); console.log(`  ✅  ${test}${notes?' — '+notes:''}`); }
function fail(test, notes='')  { results.push({ status:'FAIL', test, notes }); console.log(`  ❌  ${test}${notes?' — '+notes:''}`); }
function warn(test, notes='')  { results.push({ status:'WARN', test, notes }); console.log(`  ⚠️   ${test}${notes?' — '+notes:''}`); }
function info(test, notes='')  { results.push({ status:'INFO', test, notes }); console.log(`  ℹ️   ${test}${notes?' — '+notes:''}`); }

const consoleErrors = [];

async function auditPage(page, url, label) {
  const errors = [];
  const errHandler = msg => { if (msg.type() === 'error') errors.push(msg.text()); };
  page.on('console', errHandler);
  const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 }).catch(e => null);
  const status = resp?.status() ?? 0;
  page.off('console', errHandler);
  if (errors.length) { errors.forEach(e => consoleErrors.push(`[${label}] ${e}`)); }
  return { status, errors };
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) QA-Bot/1.0',
  });
  const page = await ctx.newPage();

  // ── 1. HOMEPAGE ───────────────────────────────────────────────────────────
  console.log('\n=== 1. PUBLIC PAGES ===');

  let r = await auditPage(page, BASE, 'homepage');
  if (r.status === 200) pass('Homepage loads (200)'); else fail('Homepage load', `HTTP ${r.status}`);
  await shot(page, 'homepage-full');

  // Hero section
  const heroHeading = await page.$('h1, [class*="hero"] h2').catch(()=>null);
  if (heroHeading) pass('Hero heading present'); else warn('Hero heading — h1 not found');

  // Navigation links
  const navLinks = await page.$$eval('nav a', els => els.map(a => ({ text: a.textContent?.trim(), href: a.href })));
  if (navLinks.length >= 3) pass(`Nav links present (${navLinks.length} found)`);
  else warn(`Nav links — only ${navLinks.length} found`);
  info('Nav links', navLinks.map(l => l.text).join(', '));

  // CTA buttons
  const ctaBtns = await page.$$eval('a[href*="quote"], a[href*="contact"], button', els =>
    els.filter(el => /quote|contact|get started|en savoir|devis/i.test(el.textContent ?? '')).map(el => el.textContent?.trim())
  );
  if (ctaBtns.length) pass(`CTA buttons found: ${ctaBtns.slice(0,3).join(', ')}`);
  else warn('No CTA buttons detected on homepage');

  // ── 2. PRODUCTS PAGE ─────────────────────────────────────────────────────
  console.log('\n=== 2. PRODUCTS PAGE ===');
  r = await auditPage(page, `${BASE}/products`, 'products');
  if (r.status === 200) pass('Products page loads'); else fail('Products page', `HTTP ${r.status}`);
  await shot(page, 'products-page');

  await page.waitForTimeout(2500); // allow client-side data fetch
  const productCards = await page.$$('[class*="card"], [class*="product"], article, li').catch(()=>[]);
  const productText = await page.textContent('main').catch(()=>'');
  info(`Product cards/items detected: ${productCards.length}`);
  if (productCards.length >= 1) pass('Product cards render');
  else if (/timber|oil|hay|alfa|tali|iroko|lubricant/i.test(productText)) pass('Product content visible in page text');
  else warn('No product cards or product text visible on products page');

  // ── 3. ABOUT PAGE ────────────────────────────────────────────────────────
  console.log('\n=== 3. ABOUT PAGE ===');
  r = await auditPage(page, `${BASE}/about`, 'about');
  if (r.status === 200) pass('About page loads'); else fail('About page', `HTTP ${r.status}`);
  await shot(page, 'about-page');

  // ── 4. CONTACT PAGE ──────────────────────────────────────────────────────
  console.log('\n=== 4. CONTACT PAGE ===');
  r = await auditPage(page, `${BASE}/contact`, 'contact');
  if (r.status === 200) pass('Contact page loads'); else fail('Contact page', `HTTP ${r.status}`);
  await shot(page, 'contact-page');

  // Contact form fields
  const contactInputs = await page.$$('form input, form textarea, form select').catch(()=>[]);
  info(`Contact form inputs: ${contactInputs.length}`);
  if (contactInputs.length >= 3) pass('Contact form has enough fields');
  else warn(`Contact form — only ${contactInputs.length} inputs found`);

  // ── 5. QUOTE REQUEST PAGE ────────────────────────────────────────────────
  console.log('\n=== 5. QUOTE PAGE ===');
  r = await auditPage(page, `${BASE}/quote`, 'quote');
  if (r.status === 200) pass('Quote page loads');
  else if (r.status === 404) warn('Quote page returns 404 — may not exist yet');
  else fail('Quote page', `HTTP ${r.status}`);
  await shot(page, 'quote-page');

  // ── 6. NEWS / BLOG PAGE ──────────────────────────────────────────────────
  console.log('\n=== 6. NEWS PAGE ===');
  r = await auditPage(page, `${BASE}/news`, 'news');
  if (r.status === 200) pass('News page loads');
  else if (r.status === 404) warn('News page returns 404');
  else fail('News page', `HTTP ${r.status}`);
  await shot(page, 'news-page');

  // ── 7. 404 HANDLING ──────────────────────────────────────────────────────
  console.log('\n=== 7. 404 PAGE ===');
  r = await auditPage(page, `${BASE}/this-page-does-not-exist`, '404');
  if (r.status === 404) pass('404 page returns correct HTTP 404');
  else warn(`404 page returned HTTP ${r.status} instead of 404`);
  const notFoundText = await page.textContent('body').catch(()=>'');
  if (/404|not found|introuvable/i.test(notFoundText)) pass('404 body content visible');
  else warn('404 page body has no 404 messaging');
  await shot(page, '404-page');

  // ── 8. AUTH GUARD — admin without login ──────────────────────────────────
  console.log('\n=== 8. ADMIN AUTH GUARD ===');
  await ctx.clearCookies();
  const adminAttempt = await page.goto(`${BASE}/admin/dashboard`, { waitUntil: 'networkidle', timeout: 20000 }).catch(()=>null);
  const finalUrl = page.url();
  if (finalUrl.includes('/auth/login') || finalUrl.includes('/login')) {
    pass('Admin route redirects unauthenticated user to login');
  } else {
    fail('Admin auth guard BROKEN — reached admin without login', `Final URL: ${finalUrl}`);
  }
  await shot(page, 'admin-auth-redirect');

  // ── 9. LOGIN FORM — invalid credentials ──────────────────────────────────
  console.log('\n=== 9. LOGIN FORM ===');
  await page.goto(`${BASE}/auth/login`, { waitUntil: 'networkidle' });
  await shot(page, 'login-page');

  const emailInput = await page.$('input[type="email"], input[name="email"]').catch(()=>null);
  const passInput  = await page.$('input[type="password"]').catch(()=>null);
  if (emailInput && passInput) pass('Login form fields present');
  else fail('Login form fields missing');

  if (emailInput && passInput) {
    // Bad credentials
    await emailInput.fill('wrong@test.com');
    await passInput.fill('wrongpassword');
    const submitBtn = await page.$('button[type="submit"], button:has-text("Login"), button:has-text("Sign in"), button:has-text("Connexion")').catch(()=>null);
    if (submitBtn) {
      await submitBtn.click();
      await page.waitForTimeout(3000);
      const errorVisible = await page.$('[class*="error"], [role="alert"], .toast, [class*="toast"]').catch(()=>null);
      if (errorVisible) pass('Login shows error on bad credentials');
      else warn('Login — no visible error shown for bad credentials');
      await shot(page, 'login-bad-creds');
    }

    // Good credentials
    await emailInput.fill(ADMIN_EMAIL);
    await passInput.fill(ADMIN_PASS);
    if (submitBtn) {
      // refetch the button (page may have re-rendered)
      const btn2 = await page.$('button[type="submit"], button:has-text("Login"), button:has-text("Sign in"), button:has-text("Connexion")').catch(()=>null);
      if (btn2) {
        await btn2.click();
        await page.waitForURL('**/admin/**', { timeout: 15000 }).catch(()=>{});
        const afterUrl = page.url();
        if (afterUrl.includes('/admin')) pass('Login with valid credentials — redirected to admin');
        else warn(`Login redirect not to admin, ended at: ${afterUrl}`);
        await shot(page, 'after-login');
      }
    }
  }

  // ── 10. ADMIN PAGES (if logged in) ───────────────────────────────────────
  console.log('\n=== 10. ADMIN PAGES ===');
  const isLoggedIn = page.url().includes('/admin');
  if (isLoggedIn) {
    const adminPages = ['dashboard','products','categories','quotes','orders','news','contacts','partners','notifications'];
    for (const p of adminPages) {
      const res = await auditPage(page, `${BASE}/admin/${p}`, `admin-${p}`);
      if (res.status === 200) pass(`Admin /${p} loads`);
      else if (page.url().includes('/auth/login')) fail(`Admin /${p} — redirected to login unexpectedly`);
      else warn(`Admin /${p} returned HTTP ${res.status}`);
      await shot(page, `admin-${p}`);
    }
  } else {
    warn('Skipping admin page checks — could not log in');
  }

  // ── 11. MOBILE VIEWPORT ──────────────────────────────────────────────────
  console.log('\n=== 11. MOBILE (375px) ===');
  const mobileCtx = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const mobilePage = await mobileCtx.newPage();
  await mobilePage.goto(BASE, { waitUntil: 'networkidle', timeout: 20000 });
  await mobilePage.screenshot({ path: `${SHOTS_DIR}/${String(++shotIdx).padStart(3,'0')}-mobile-home.png`, fullPage: true });
  const mobileNav = await mobilePage.$('[class*="hamburger"], [class*="menu-toggle"], [aria-label*="menu"], button[class*="mobile"]').catch(()=>null);
  if (mobileNav) pass('Mobile hamburger/menu toggle present');
  else warn('Mobile nav toggle not detected');
  await mobileCtx.close();

  // ── 12. TABLET VIEWPORT ──────────────────────────────────────────────────
  console.log('\n=== 12. TABLET (1024×768) ===');
  try {
    const tabletCtx = await browser.newContext({ viewport: { width: 1024, height: 768 } });
    const tabletPage = await tabletCtx.newPage();
    await tabletPage.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await tabletPage.waitForTimeout(2000);
    await tabletPage.screenshot({ path: `${SHOTS_DIR}/${String(++shotIdx).padStart(3,'0')}-tablet-home.png`, fullPage: false });
    pass('Tablet viewport renders');
    await tabletCtx.close();
  } catch (e) { warn('Tablet viewport test timed out', e.message.slice(0,60)); }

  // ── 13. PERFORMANCE — Core metrics ───────────────────────────────────────
  console.log('\n=== 13. PERFORMANCE ===');
  const perfCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const perfPage = await perfCtx.newPage();
  const t0 = Date.now();
  await perfPage.goto(BASE, { waitUntil: 'load', timeout: 30000 });
  const ttl = Date.now() - t0;
  info(`Time-to-load (onload): ${ttl}ms`);
  if (ttl < 3000) pass(`Page load fast: ${ttl}ms`);
  else if (ttl < 6000) warn(`Page load moderate: ${ttl}ms`);
  else fail(`Page load slow: ${ttl}ms`);

  // LCP-approximation via largest image/text
  const metrics = await perfPage.evaluate(() => {
    return new Promise(resolve => {
      let lcp = 0;
      new PerformanceObserver(list => {
        for (const e of list.getEntries()) lcp = e.startTime;
        resolve({ lcp: Math.round(lcp) });
      }).observe({ type: 'largest-contentful-paint', buffered: true });
      setTimeout(() => resolve({ lcp: Math.round(lcp) }), 3000);
    });
  }).catch(() => ({ lcp: -1 }));
  info(`LCP estimate: ${metrics.lcp}ms`);
  if (metrics.lcp > 0 && metrics.lcp < 2500) pass(`LCP good: ${metrics.lcp}ms`);
  else if (metrics.lcp >= 2500 && metrics.lcp < 4000) warn(`LCP needs improvement: ${metrics.lcp}ms`);
  else if (metrics.lcp >= 4000) fail(`LCP poor: ${metrics.lcp}ms`);

  // Resource counts
  const resources = await perfPage.evaluate(() =>
    performance.getEntriesByType('resource').map(r => ({ type: r.initiatorType, size: r.transferSize, name: r.name.split('/').pop()?.slice(0,40) }))
  );
  const byType = resources.reduce((acc, r) => { acc[r.type] = (acc[r.type]||0)+1; return acc; }, {});
  info(`Resources: ${JSON.stringify(byType)}`);
  const totalSize = resources.reduce((s,r) => s + (r.size||0), 0);
  info(`Total transfer: ${Math.round(totalSize/1024)}KB`);
  if (totalSize < 1500000) pass(`Total page weight OK: ${Math.round(totalSize/1024)}KB`);
  else warn(`Page weight heavy: ${Math.round(totalSize/1024)}KB`);
  await perfCtx.close();

  // ── 14. ACCESSIBILITY — basic ────────────────────────────────────────────
  console.log('\n=== 14. ACCESSIBILITY ===');
  const a11yPage = await ctx.newPage();
  await a11yPage.goto(BASE, { waitUntil: 'networkidle' });

  const images = await a11yPage.$$eval('img', imgs => imgs.map(i => ({ src: i.src?.slice(-40), alt: i.alt })));
  const missingAlt = images.filter(i => i.alt === '' || i.alt === null);
  if (missingAlt.length === 0) pass('All images have alt text');
  else warn(`${missingAlt.length} images missing alt text`, missingAlt.map(i=>i.src).join(', '));

  const h1Count = await a11yPage.$$eval('h1', els => els.length);
  if (h1Count === 1) pass('Exactly one h1 per page (homepage)');
  else if (h1Count === 0) warn('No h1 on homepage');
  else warn(`Multiple h1s on homepage: ${h1Count}`);

  const skipLink = await a11yPage.$('a[href="#main"], a[href="#content"], [class*="skip"]').catch(()=>null);
  if (skipLink) pass('Skip-to-content link present'); else warn('No skip-to-content link found');

  const langAttr = await a11yPage.$eval('html', el => el.lang).catch(()=>'');
  if (langAttr) pass(`html lang attribute set: "${langAttr}"`); else warn('html element missing lang attribute');

  await a11yPage.close();

  // ── 15. SEO basics ───────────────────────────────────────────────────────
  console.log('\n=== 15. SEO ===');
  const seoPage = await ctx.newPage();
  await seoPage.goto(BASE, { waitUntil: 'networkidle' });

  const title = await seoPage.title();
  if (title && title.length > 5) pass(`<title> present: "${title.slice(0,60)}"`);
  else fail('Page title missing or too short');

  const metaDesc = await seoPage.$eval('meta[name="description"]', el => el.content).catch(()=>'');
  if (metaDesc) pass(`Meta description present (${metaDesc.length} chars)`);
  else warn('Meta description missing');

  const ogTitle = await seoPage.$eval('meta[property="og:title"]', el => el.content).catch(()=>'');
  if (ogTitle) pass('og:title present'); else warn('og:title missing');

  const canonical = await seoPage.$eval('link[rel="canonical"]', el => el.href).catch(()=>'');
  if (canonical) pass(`Canonical URL: ${canonical}`); else warn('No canonical link tag');

  await seoPage.close();

  // ── 16. CONSOLE ERRORS SUMMARY ───────────────────────────────────────────
  console.log('\n=== 16. CONSOLE ERRORS ===');
  if (consoleErrors.length === 0) {
    pass('No JS console errors detected across tested pages');
  } else {
    consoleErrors.forEach(e => warn('Console error', e.slice(0, 120)));
  }

  // ── CONTACT FORM SUBMISSION TEST ─────────────────────────────────────────
  console.log('\n=== 17. CONTACT FORM SUBMISSION ===');
  const formPage = await ctx.newPage();
  await formPage.goto(`${BASE}/contact`, { waitUntil: 'networkidle' });
  const fEmail = await formPage.$('input[type="email"], input[name="email"]').catch(()=>null);
  const fMsg   = await formPage.$('textarea').catch(()=>null);
  const fName  = await formPage.$('input[name="name"], input[placeholder*="name" i], input[placeholder*="nom" i]').catch(()=>null);
  if (fEmail && fMsg) {
    if (fName) await fName.fill('QA Test User');
    await fEmail.fill('qa@test.com');
    await fMsg.fill('This is an automated QA test message. Please ignore.');
    await shot(formPage, 'contact-form-filled');
    pass('Contact form fields fillable');
    // Don't actually submit to avoid spam — just verify form is interactive
    info('Contact form submit NOT clicked — avoiding real submission during QA');
  } else {
    warn('Contact form — could not locate email+message fields');
  }
  await formPage.close();

  // ── FINAL REPORT ─────────────────────────────────────────────────────────
  console.log('\n\n══════════════════════════════════════════════════════');
  console.log('  LTIC SARL QA AUDIT — SUMMARY');
  console.log('══════════════════════════════════════════════════════');
  const passed = results.filter(r=>r.status==='PASS').length;
  const failed = results.filter(r=>r.status==='FAIL').length;
  const warned = results.filter(r=>r.status==='WARN').length;
  const infos  = results.filter(r=>r.status==='INFO').length;
  console.log(`  ✅ PASS: ${passed}   ❌ FAIL: ${failed}   ⚠️  WARN: ${warned}   ℹ️  INFO: ${infos}`);
  console.log('');
  if (failed > 0) {
    console.log('  FAILURES:');
    results.filter(r=>r.status==='FAIL').forEach(r => console.log(`    ❌ ${r.test} — ${r.notes}`));
  }
  if (warned > 0) {
    console.log('\n  WARNINGS:');
    results.filter(r=>r.status==='WARN').forEach(r => console.log(`    ⚠️  ${r.test}${r.notes?' — '+r.notes:''}`));
  }
  console.log(`\n  Screenshots saved to: ${SHOTS_DIR}/`);
  fs.writeFileSync('qa-report.json', JSON.stringify(results, null, 2));
  console.log('  Full report: qa-report.json');
  console.log('══════════════════════════════════════════════════════\n');

  await browser.close();
})();
