import { chromium } from "playwright";

const browser = await chromium.launch({
  executablePath:
    "/home/devsupreme/.cache/ms-playwright/chromium-1223/chrome-linux64/chrome",
  headless: true,
});

const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

const consoleMsgs = [];
const pageErrors = [];

page.on("console", (msg) => {
  consoleMsgs.push({
    type: msg.type(),
    text: msg.text(),
    location: msg.location(),
  });
});
page.on("pageerror", (err) => {
  pageErrors.push({ message: err.message, stack: err.stack });
});
page.on("requestfailed", (req) => {
  consoleMsgs.push({
    type: "REQFAIL",
    text: `${req.url()} - ${req.failure()?.errorText}`,
  });
});

const URL = process.env.PROBE_URL || "https://steelvalley.vercel.app/";
await page.goto(URL, {
  waitUntil: "networkidle",
  timeout: 30000,
});
await page.waitForTimeout(6000);

await page.screenshot({ path: "/tmp/sv-screenshots/prod-error.png" });

console.log("===== PAGE ERRORS =====");
for (const e of pageErrors) {
  console.log(e.message);
  console.log(e.stack);
  console.log("---");
}
console.log("");
console.log("===== CONSOLE (errors + warnings) =====");
for (const m of consoleMsgs) {
  if (m.type === "error" || m.type === "warning" || m.type === "REQFAIL") {
    console.log(`[${m.type}] ${m.text}`);
    if (m.location?.url) console.log(`   at ${m.location.url}:${m.location.lineNumber}`);
  }
}

await browser.close();
