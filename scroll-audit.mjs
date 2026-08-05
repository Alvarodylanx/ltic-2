import { chromium } from 'playwright';

const TMP = 'C:/Users/Stainx/AppData/Local/Temp/audit_';

const browser = await chromium.launch();

async function scrollShots(url, slug, vw, vh) {
  const page = await browser.newPage();
  await page.setViewportSize({ width: vw, height: vh });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 });
  await page.waitForTimeout(1500);
  // dismiss cookie
  try { await page.locator('button', { hasText: 'Accept All' }).first().click({ timeout: 1500 }); await page.waitForTimeout(300); } catch {}

  const totalHeight = await page.evaluate(() => document.body.scrollHeight);
  const step = vh - 60;
  let y = 0, idx = 0;
  while (y < totalHeight) {
    await page.evaluate(pos => window.scrollTo(0, pos), y);
    await page.waitForTimeout(700); // let animations fire
    await page.screenshot({ path: TMP + slug + '_' + String(idx).padStart(2,'0') + '.png' });
    console.log(`${slug} scroll ${y}px -> frame ${idx}`);
    y += step; idx++;
  }
  await page.close();
}

await scrollShots('http://localhost:3000', 'home_mob', 390, 844);
await scrollShots('http://localhost:3000/about', 'about_mob', 390, 844);
await scrollShots('http://localhost:3000/about', 'about_desk', 1280, 800);

await browser.close();
console.log('Done');
