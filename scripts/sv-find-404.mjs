import { chromium } from "playwright";

const browser = await chromium.launch({
  executablePath:
    "/home/devsupreme/.cache/ms-playwright/chromium-1223/chrome-linux64/chrome",
  headless: true,
});

const page = await browser.newPage();
const failed = [];
page.on("requestfailed", (r) => failed.push({ url: r.url(), err: r.failure()?.errorText }));
page.on("response", (r) => {
  if (r.status() >= 400) failed.push({ url: r.url(), status: r.status() });
});

await page.goto("http://localhost:3010/", { waitUntil: "domcontentloaded", timeout: 30000 });
await page.waitForTimeout(5000);

console.log("Failed / 4xx resources:");
for (const f of failed) console.log(" ", JSON.stringify(f));
await browser.close();
