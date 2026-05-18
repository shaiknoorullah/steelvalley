import { chromium } from 'playwright';

const browser = await chromium.launch({
  executablePath: '/home/devsupreme/.cache/ms-playwright/chromium-1223/chrome-linux64/chrome',
  headless: true,
});

const targets = [
  { url: 'http://localhost:3001/', file: 'home-ar.png', width: 1440, height: 900, waitFor: 4000 },
  { url: 'http://localhost:3001/', file: 'home-ar-mobile.png', width: 390, height: 844, waitFor: 4000 },
  { url: 'http://localhost:3001/en', file: 'home-en.png', width: 1440, height: 900, waitFor: 4000 },
  { url: 'http://localhost:3001/dev/components', file: 'showcase.png', width: 1440, height: 900, waitFor: 1500, full: true },
  { url: 'http://localhost:3001/dev/components', file: 'showcase-mobile.png', width: 390, height: 844, waitFor: 1500, full: true },
];

for (const t of targets) {
  const ctx = await browser.newContext({ viewport: { width: t.width, height: t.height } });
  const page = await ctx.newPage();
  try {
    await page.goto(t.url, { waitUntil: 'networkidle', timeout: 30000 });
  } catch (e) {
    console.log(`  WARN navigation timeout for ${t.url}: ${e.message.slice(0, 100)}`);
  }
  await page.waitForTimeout(t.waitFor);
  await page.screenshot({ path: `/tmp/sv-screenshots/${t.file}`, fullPage: !!t.full });
  console.log(`  ${t.file}: ok`);
  await ctx.close();
}

await browser.close();
