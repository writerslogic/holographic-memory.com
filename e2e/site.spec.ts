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
  await page.goto("/");
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
