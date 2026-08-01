import { chromium } from 'playwright';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 20000 });
await page.waitForTimeout(2500);
try { await page.click('button:has-text("Accept All")', { timeout: 2000 }); await page.waitForTimeout(400); } catch {}
await page.screenshot({ path: 'C:/Users/Stainx/AppData/Local/Temp/hero-current.png' });
await browser.close();
console.log('done');
