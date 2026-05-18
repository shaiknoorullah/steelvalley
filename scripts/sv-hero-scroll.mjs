/**
 * Capture the hero arc at multiple scroll positions.
 * The hero is pinned for 500vh (5 stages × 100vh).
 * We scroll to 10%, 30%, 50%, 70%, 90% of the pin to land in the middle of each stage.
 */
import { chromium } from "playwright";

const browser = await chromium.launch({
  executablePath:
    "/home/devsupreme/.cache/ms-playwright/chromium-1223/chrome-linux64/chrome",
  headless: true,
});

const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  // Skip the loader on subsequent navigations within the session.
  // First load will still show the loader; subsequent reloads won't.
});

const page = await ctx.newPage();

async function snap(url, locale, file, scrollY = 0, waitMs = 4000) {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
  // Wait for the loader to clear (it auto-dismisses ~1.5s after load)
  await page.waitForTimeout(waitMs);
  if (scrollY > 0) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), scrollY);
    // Give GSAP ScrollTrigger time to update on the scrub
    await page.waitForTimeout(800);
  }
  await page.screenshot({ path: `/tmp/sv-screenshots/${file}` });
  console.log(`  ${file} (${locale}, scrollY=${scrollY}): ok`);
}

const HERO_HEIGHT_VH = 500;
const PIN_PX_AT_900 = (HERO_HEIGHT_VH / 100) * 900; // 4500px total scroll

const stages = [
  { label: "00-loader-end", offsetPct: 0.0 },     // Earth (just out of loader)
  { label: "01-earth", offsetPct: 0.1 },
  { label: "02-heat", offsetPct: 0.3 },
  { label: "03-form", offsetPct: 0.5 },
  { label: "04-edge", offsetPct: 0.7 },
  { label: "05-place", offsetPct: 0.9 },
  { label: "06-post-hero", offsetPct: 1.05 },     // just past the pin end
];

for (const s of stages) {
  const y = Math.round(s.offsetPct * PIN_PX_AT_900);
  await snap("http://localhost:3002/", "ar", `hero-ar-${s.label}.png`, y, s.offsetPct === 0 ? 4000 : 2500);
}

for (const s of stages) {
  const y = Math.round(s.offsetPct * PIN_PX_AT_900);
  await snap("http://localhost:3002/en", "en", `hero-en-${s.label}.png`, y, s.offsetPct === 0 ? 4000 : 2500);
}

await browser.close();
console.log("done");
