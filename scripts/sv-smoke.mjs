import { chromium } from "playwright";

const browser = await chromium.launch({
  executablePath:
    "/home/devsupreme/.cache/ms-playwright/chromium-1223/chrome-linux64/chrome",
  headless: true,
});

const ROUTES_EN = [
  "/en",
  "/en/services",
  "/en/products",
  "/en/about",
  "/en/blog",
  "/en/contact",
  "/en/work",
  "/en/legal/privacy",
  "/en/legal/terms",
];
const ROUTES_AR = [
  "/",
  "/services",
  "/products",
  "/about",
  "/blog",
  "/contact",
  "/work",
  "/legal/privacy",
  "/legal/terms",
];

const BASE = process.env.PROBE_URL || "http://localhost:3010";
const results = [];

for (const path of [...ROUTES_AR, ...ROUTES_EN]) {
  const isAr = !path.startsWith("/en");
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    locale: isAr ? "ar-SA" : "en-US",
    extraHTTPHeaders: { "Accept-Language": isAr ? "ar" : "en" },
  });
  const page = await ctx.newPage();
  const errs = [];
  const conErrs = [];
  page.on("pageerror", (e) => errs.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") conErrs.push(m.text());
  });
  const resp = await page.goto(`${BASE}${path}`, {
    waitUntil: "domcontentloaded",
    timeout: 30000,
  });
  await page.waitForTimeout(1500);
  results.push({
    path,
    status: resp?.status() ?? "?",
    pageErrors: errs.length,
    consoleErrors: conErrs.length,
    firstError: errs[0] ?? conErrs[0] ?? "",
  });
  await ctx.close();
}

console.log("path".padEnd(28), "status", "pe", "ce", "first error");
console.log("-".repeat(80));
for (const r of results) {
  console.log(
    r.path.padEnd(28),
    String(r.status).padEnd(6),
    String(r.pageErrors).padEnd(2),
    String(r.consoleErrors).padEnd(2),
    r.firstError.slice(0, 80),
  );
}

await browser.close();

const failed = results.filter(
  (r) => r.status >= 400 || r.pageErrors > 0
);
console.log("");
console.log(`failed=${failed.length}/${results.length}`);
process.exit(failed.length ? 1 : 0);
