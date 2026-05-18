/**
 * Capture every page route end-to-end, including full-page scrolling
 * screenshots of the home page so we can see all sections.
 */
import { chromium } from "playwright";
import fs from "node:fs";

const OUT = "/tmp/sv-screenshots";
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  executablePath:
    "/home/devsupreme/.cache/ms-playwright/chromium-1223/chrome-linux64/chrome",
  headless: true,
});

async function snap({ url, name, viewport = { width: 1440, height: 900 }, full = false, scrollAfter = 0, wait = 4000 }) {
  const ctx = await browser.newContext({ viewport });
  const page = await ctx.newPage();
  // Pre-seed sessionStorage so the lead-magnet popup is suppressed during QA.
  await page.addInitScript(() => {
    try {
      window.sessionStorage.setItem("sv-lead-shown", "1");
      window.sessionStorage.setItem("sv-loader-shown", "1");
      window.localStorage.setItem("sv-analytics-consent", "0");
    } catch {}
  });
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
  } catch (e) {
    console.log(`  WARN ${name}: ${e.message.slice(0, 80)}`);
  }
  await page.waitForTimeout(wait);
  if (scrollAfter > 0) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), scrollAfter);
    await page.waitForTimeout(500);
  }
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: full });
  console.log(`  ${name}: ok`);
  await ctx.close();
}

const BASE = "http://localhost:3002";

// Full-page captures (long screenshots) for home, about, services, products
await snap({ url: `${BASE}/en`, name: "page-home-en-full", full: true, wait: 5000 });
await snap({ url: `${BASE}/`, name: "page-home-ar-full", full: true, wait: 5000 });
await snap({ url: `${BASE}/en/about`, name: "page-about-en", full: true, wait: 3000 });
await snap({ url: `${BASE}/about`, name: "page-about-ar", full: true, wait: 3000 });
await snap({ url: `${BASE}/en/services`, name: "page-services-en", full: true, wait: 3000 });
await snap({ url: `${BASE}/services`, name: "page-services-ar", full: true, wait: 3000 });
await snap({ url: `${BASE}/en/products`, name: "page-products-en", full: true, wait: 3000 });
await snap({ url: `${BASE}/products`, name: "page-products-ar", full: true, wait: 3000 });
await snap({ url: `${BASE}/en/products/workstation`, name: "page-product-detail-en", full: true, wait: 3000 });
await snap({ url: `${BASE}/en/contact`, name: "page-contact-en", full: true, wait: 3000 });
await snap({ url: `${BASE}/contact`, name: "page-contact-ar", full: true, wait: 3000 });
await snap({ url: `${BASE}/en/blog`, name: "page-blog-en", full: true, wait: 3000 });
await snap({ url: `${BASE}/en/blog/first-post`, name: "page-blog-post-en", full: true, wait: 3000 });
await snap({ url: `${BASE}/en/legal/privacy`, name: "page-legal-privacy-en", full: true, wait: 3000 });

// Mobile captures
await snap({ url: `${BASE}/en`, name: "mobile-home-en-full", viewport: { width: 390, height: 844 }, full: true, wait: 5000 });
await snap({ url: `${BASE}/en/services`, name: "mobile-services-en", viewport: { width: 390, height: 844 }, full: true, wait: 3000 });
await snap({ url: `${BASE}/en/products`, name: "mobile-products-en", viewport: { width: 390, height: 844 }, full: true, wait: 3000 });
await snap({ url: `${BASE}/en/contact`, name: "mobile-contact-en", viewport: { width: 390, height: 844 }, full: true, wait: 3000 });

// Sections-below-hero proof: load home, scroll past the hero pin (500vh = 4500px @900h)
await snap({ url: `${BASE}/en`, name: "home-en-below-hero", scrollAfter: 4800, wait: 5000 });
await snap({ url: `${BASE}/en`, name: "home-en-process", scrollAfter: 5400, wait: 5000 });
await snap({ url: `${BASE}/en`, name: "home-en-trust", scrollAfter: 6200, wait: 5000 });
await snap({ url: `${BASE}/en`, name: "home-en-feature", scrollAfter: 7000, wait: 5000 });
await snap({ url: `${BASE}/en`, name: "home-en-footer", scrollAfter: 9000, wait: 5000 });

await browser.close();
console.log("\nAll done.");
