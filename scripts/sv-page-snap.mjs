import { chromium } from "playwright";
const browser = await chromium.launch({
  executablePath: "/home/devsupreme/.cache/ms-playwright/chromium-1223/chrome-linux64/chrome",
  headless: true,
});
const pairs = [
  ["/services", "page-services-ar"],
  ["/products", "page-products-ar"],
  ["/about", "page-about-ar"],
  ["/contact", "page-contact-ar"],
  ["/blog", "page-blog-ar"],
  ["/legal/privacy", "page-privacy-ar"],
  ["/en/services", "page-services-en"],
  ["/en/contact", "page-contact-en"],
  ["/en/about", "page-about-en"],
];
for (const [path, file] of pairs) {
  const isAr = !path.startsWith("/en");
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    locale: isAr ? "ar-SA" : "en-US",
    extraHTTPHeaders: { "Accept-Language": isAr ? "ar" : "en" },
  });
  const p = await ctx.newPage();
  await p.goto(`http://localhost:3010${path}`, { waitUntil: "domcontentloaded", timeout: 30000 });
  await p.waitForTimeout(2500);
  await p.screenshot({ path: `/tmp/sv-screenshots/${file}.png` });
  console.log(`  ${file}.png: ok`);
  await ctx.close();
}
await browser.close();
