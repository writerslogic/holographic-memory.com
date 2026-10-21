import { describe, expect, it } from "vitest";
import {
  HMS_BENCHMARKS,
  HMS_CAPABILITIES,
  HMS_DURABILITY,
  HMS_FAQ,
  HMS_TIERS,
  hmsCheckoutUrl,
  hmsWaitlistUrl,
} from "../src/content/hms";

// Claims on the page must trace to committed files in the HMS repository, and paid
// prices stay off the site until the business plan publishes them.
describe("product content", () => {
  it("cites every benchmark to a committed results file", () => {
    for (const b of [...HMS_BENCHMARKS, HMS_DURABILITY]) {
      expect(b.source).toMatch(/^benchmarks\/results\/[\w.-]+\.json$/);
    }
  });

  it("cites every capability to a repository document", () => {
    for (const c of HMS_CAPABILITIES) expect(c.source).toMatch(/\.md$/);
  });

  it("publishes no dollar amounts", () => {
    const text = JSON.stringify({ HMS_TIERS, HMS_FAQ });
    expect(text).not.toMatch(/\$\s?\d/);
  });

  it("routes paid tiers to the checkout endpoint or the waitlist", () => {
    for (const t of HMS_TIERS.filter((t) => t.checkout)) {
      expect(hmsCheckoutUrl(t.plan)).toBe(`/api/hms/checkout?plan=${t.plan}`);
      expect(hmsWaitlistUrl(t.plan)).toMatch(/^mailto:/);
    }
  });
});
