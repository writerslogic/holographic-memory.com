import { expect, test } from "@playwright/test";

const SIZES = [
  [1440, 900],
  [1440, 700],
  [1920, 1080],
  [1280, 640],
  [1024, 768],
  [768, 1024],
  [390, 844],
  [360, 640],
] as const;

for (const [width, height] of SIZES) {
  test(`hero title through CTAs fit the first viewport at ${width}x${height}`, async ({ page }, info) => {
    await page.setViewportSize({ width, height });
    await page.goto("/");
    const title = await page.locator("#hms-heading").boundingBox();
    expect(title, "hero title").not.toBeNull();
    expect(title!.y).toBeGreaterThanOrEqual(0);
    for (const name of ["Get started", "View on GitHub"]) {
      const cta = page.locator(".hero__cta").getByRole("link", { name });
      await expect(cta).toBeVisible();
      const box = (await cta.boundingBox())!;
      expect(box.x, `${name} left`).toBeGreaterThanOrEqual(0);
      expect(box.y, `${name} top`).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width, `${name} right`).toBeLessThanOrEqual(width);
      expect(box.y + box.height, `${name} bottom`).toBeLessThanOrEqual(height);
    }
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    await page.screenshot({ path: info.outputPath(`hero-${width}x${height}.png`) });
  });
}

test("no horizontal scroll at 320x568", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto("/");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test("install lines copy their command by click and by keyboard", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  const status = page.locator(".hero-install-wrap [role=status]");
  await expect(status).toHaveAttribute("aria-live", "polite");

  const rust = page.locator(".hero-install__btn", { hasText: "Rust" });
  await rust.click({ position: { x: 8, y: 8 } });
  await expect(status).toHaveText("Copied the Rust install command");
  await expect(rust).toContainText("Copied");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "cargo add holographic-memory --git https://github.com/writerslogic/holographic-memory",
  );

  const python = page.locator(".hero-install__btn", { hasText: "Python" });
  await python.focus();
  await page.keyboard.press("Enter");
  await expect(status).toHaveText("Copied the Python install command");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("pip install holographic-sdk");
  await expect(python).toBeFocused();
});

test("select-all leaves UI chrome out and keeps content selectable", async ({ page }) => {
  await page.goto("/");
  const userSelect = (selector: string) =>
    page.locator(selector).first().evaluate((el) => getComputedStyle(el).userSelect);
  for (const chrome of [
    ".hero-install__lang",
    ".page-nav a",
    ".bench-chart__data summary",
    ".bench-chart__source",
    ".btn-primary",
    "button",
  ]) {
    expect(await userSelect(chrome), chrome).toBe("none");
  }
  expect(await userSelect(".hero-install__cmd")).toBe("text");
  expect(await userSelect("#hms-heading")).not.toBe("none");
  expect(await userSelect("pre code")).not.toBe("none");
});

test("hero mark is decorative and static under reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const mark = page.locator("picture.hero-mark");
  await expect(mark).toHaveAttribute("aria-hidden", "true");
  expect(await mark.evaluate((el) => getComputedStyle(el).pointerEvents)).toBe("none");
  const image = mark.locator("img");
  await expect(image).toBeVisible();
  expect(await image.evaluate((el: HTMLImageElement) => el.currentSrc)).toContain(
    "/images/crystal-halo/crystal-detailed-static.svg",
  );
  expect(await image.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
});

test("hydrates the prerendered page without console errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  expect(errors).toEqual([]);
});
