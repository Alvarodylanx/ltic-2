import { chromium } from 'playwright';

const TMP = 'C:/Users/Stainx/AppData/Local/Temp/';

async function shot(page, name) {
  try {
    await page.locator('button', { hasText: 'Accept All' }).first().click({ timeout: 2000 });
    await page.waitForTimeout(400);
  } catch {}
  await page.screenshot({ path: TMP + name + '.png', fullPage: true });
  console.log('Saved ' + name);
}

const browser = await chromium.launch();

// About desktop
let page = await browser.newPage();
await page.setViewportSize({ width: 1280, height: 900 });
await page.goto('http://localhost:3000/about', { waitUntil: 'networkidle', timeout: 20000 });
await page.waitForTimeout(2000);
await shot(page, 'about_desk_full');
await page.close();

// About mobile
page = await browser.newPage();
await page.setViewportSize({ width: 390, height: 844 });
await page.goto('http://localhost:3000/about', { waitUntil: 'networkidle', timeout: 20000 });
await page.waitForTimeout(2000);
await shot(page, 'about_mob_full');
await page.close();

// Home desktop
page = await browser.newPage();
await page.setViewportSize({ width: 1280, height: 900 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 20000 });
await page.waitForTimeout(2000);
await shot(page, 'home_desk_full');
await page.close();

// Home mobile
page = await browser.newPage();
await page.setViewportSize({ width: 390, height: 844 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 20000 });
await page.waitForTimeout(2000);
await shot(page, 'home_mob_full');
await page.close();

await browser.close();
console.log('All done');
