import { chromium } from "playwright";

const browser = await chromium.launch({
  executablePath: "/home/devsupreme/.cache/ms-playwright/chromium-1223/chrome-linux64/chrome",
  headless: true,
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.goto("http://localhost:3010/", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(2000);

const inspect = await page.evaluate(() => {
  const pri = document.querySelector(".sv-hero2d__h1-primary");
  const sec = document.querySelector(".sv-hero2d__h1-secondary");
  if (!pri || !sec) return { error: "not found" };
  const cs1 = getComputedStyle(pri);
  const cs2 = getComputedStyle(sec);
  return {
    primary: { text: pri.textContent, fontSize: cs1.fontSize, lang: pri.getAttribute("lang"), fontFamily: cs1.fontFamily },
    secondary: { text: sec.textContent, fontSize: cs2.fontSize, lang: sec.getAttribute("lang"), fontFamily: cs2.fontFamily },
    htmlLang: document.documentElement.lang,
  };
});
console.log(JSON.stringify(inspect, null, 2));

await browser.close();
