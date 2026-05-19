import { chromium } from "playwright";

const browser = await chromium.launch({
  executablePath:
    "/home/devsupreme/.cache/ms-playwright/chromium-1223/chrome-linux64/chrome",
  headless: true,
});

const pageErrors = [];

async function snap({ url, file, accept, viewport }) {
  const ctx = await browser.newContext({
    viewport,
    locale: accept === "ar" ? "ar-SA" : "en-US",
    extraHTTPHeaders: { "Accept-Language": accept },
  });
  const p = await ctx.newPage();
  p.on("pageerror", (err) => pageErrors.push(err.message));
  await p.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
  await p.waitForTimeout(2500);
  await p.screenshot({ path: `/tmp/sv-screenshots/${file}` });
  console.log(`  ${file}: ok`);
  await ctx.close();
}

await snap({ url: "http://localhost:3010/", file: "hero2d-ar.png", accept: "ar", viewport: { width: 1440, height: 900 } });
await snap({ url: "http://localhost:3010/en", file: "hero2d-en.png", accept: "en", viewport: { width: 1440, height: 900 } });
await snap({ url: "http://localhost:3010/", file: "hero2d-ar-mobile.png", accept: "ar", viewport: { width: 390, height: 844 } });
await snap({ url: "http://localhost:3010/en", file: "hero2d-en-mobile.png", accept: "en", viewport: { width: 390, height: 844 } });

if (pageErrors.length) {
  console.log("PAGE ERRORS:");
  for (const e of pageErrors) console.log(" ", e);
} else {
  console.log("no page errors");
}

await browser.close();
