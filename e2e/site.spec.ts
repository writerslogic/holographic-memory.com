import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const WIDTHS = [320, 375, 414, 768, 1280] as const;

for (const width of WIDTHS) {
  test(`no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
}

test("passes axe, including color contrast", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.evaluate(() =>
    document.querySelectorAll("details").forEach((d) => (d.open = true)),
  );
  const { violations } = await new AxeBuilder({ page }).analyze();
  expect(violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
});

test("ships server-rendered content and metadata", async ({ request }) => {
  const html = await (await request.get("/")).text();
  expect(html).toContain('<link rel="canonical" href="https://holographic-memory.com/"');
  expect(html).toContain('"@type":"SoftwareApplication"');
  expect(html).toContain("og-image.png");
  expect(html).toContain('id="benchmarks"');
});

test("paid tiers fall back to the waitlist when checkout is off", async ({ page }) => {
  await page.goto("/");
  const waitlist = page.locator('#pricing a[href^="mailto:"]');
  await expect(waitlist).toHaveCount(3);
  await expect(page.locator('#pricing a[href^="/api/hms/checkout"]')).toHaveCount(0);
});

test("no horizontal overflow at 1920px", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto("/");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test("light theme passes axe and persists", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.evaluate(() => document.querySelectorAll("details").forEach((d) => (d.open = true)));
  const { violations } = await new AxeBuilder({ page }).analyze();
  expect(violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("quickstart tabs switch by click and arrow key", async ({ page }) => {
  await page.goto("/");
  const python = page.getByRole("tab", { name: "Python" });
  await page.getByRole("tab", { name: "Rust" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(python).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tabpanel")).toContainText("holographic_sdk");
});

test("benchmark charts are prerendered SVG with data tables", async ({ request }) => {
  const html = await (await request.get("/")).text();
  expect((html.match(/<svg[^>]*class="bench-chart__svg"/g) ?? []).length).toBe(6);
  expect((html.match(/<summary>Data table<\/summary>/g) ?? []).length).toBe(6);
});

test("page nav stays visible while scrolling", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/");
  await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight / 2, behavior: "instant" }));
  const box = await page.getByRole("navigation", { name: "On this page" }).boundingBox();
  expect(box?.y).toBe(0);
});
