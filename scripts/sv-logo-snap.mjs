import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const OUT = path.resolve("scripts", "_snaps");
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  executablePath: "C:\\Users\\moham\\AppData\\Local\\ms-playwright\\chromium-1194\\chrome-win\\chrome.exe",
});

const cases = [
  { name: "home-ar-desktop-top",   url: "http://localhost:3000/",            vp: { w: 1440, h: 900 }, scroll: 0   },
  { name: "home-ar-desktop-scrolled", url: "http://localhost:3000/",         vp: { w: 1440, h: 900 }, scroll: 400 },
  { name: "home-en-desktop-top",   url: "http://localhost:3000/en",          vp: { w: 1440, h: 900 }, scroll: 0   },
  { name: "services-en-desktop",   url: "http://localhost:3000/en/services", vp: { w: 1440, h: 900 }, scroll: 0   },
  { name: "home-ar-mobile",        url: "http://localhost:3000/",            vp: { w: 390,  h: 844 }, scroll: 0   },
  { name: "home-en-mobile",        url: "http://localhost:3000/en",          vp: { w: 390,  h: 844 }, scroll: 0   },
];

for (const c of cases) {
  const ctx = await browser.newContext({ viewport: { width: c.vp.w, height: c.vp.h } });
  const p = await ctx.newPage();
  try {
    await p.goto(c.url, { waitUntil: "networkidle", timeout: 60000 });
    // Wait for the brand img inside the header to be in the DOM and decoded
    await p.waitForSelector(".sv-header__brand-logo img", { state: "visible", timeout: 30000 }).catch(() => {});
    await p.waitForTimeout(800);
    if (c.scroll) {
      await p.evaluate((y) => window.scrollTo(0, y), c.scroll);
      await p.waitForTimeout(500);
    }
    // Crop to top 200px (where the header lives) to keep snapshots small
    await p.screenshot({
      path: path.join(OUT, `${c.name}.png`),
      clip: { x: 0, y: 0, width: c.vp.w, height: 200 },
    });
    console.log(`  ${c.name}.png ok`);
  } catch (e) {
    console.log(`  ${c.name}: ERROR ${e.message}`);
  }
  await ctx.close();
}
await browser.close();
