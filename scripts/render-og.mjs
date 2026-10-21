// Render a 1200x630 social card from a local HTML source with headless Chrome.
// Usage: node scripts/render-og.mjs <source.html> <output.png>
import { resolve } from "node:path";
import { statSync } from "node:fs";
import { pathToFileURL } from "node:url";
import puppeteer from "puppeteer-core";

const [source, output] = process.argv.slice(2);
if (!source || !output) {
  console.error("usage: node scripts/render-og.mjs <source.html> <output.png>");
  process.exit(2);
}

const chrome =
  process.env.PUPPETEER_EXECUTABLE_PATH ||
  [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium-browser",
  ].find((p) => {
    try {
      statSync(p);
      return true;
    } catch {
      return false;
    }
  });
if (!chrome) {
  console.error("no Chrome found; set PUPPETEER_EXECUTABLE_PATH");
  process.exit(1);
}

const browser = await puppeteer.launch({ executablePath: chrome, headless: true });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(resolve(source)).href, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: resolve(output), type: "png" });
  console.log(`wrote ${output}`);
} finally {
  await browser.close();
}
