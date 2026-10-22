import { describe, expect, it } from "vitest";
import {
  BENCH_SOURCE_SHA,
  PROOF_CHIPS,
  TEXT_GROUPS,
  VECTOR_GROUPS,
} from "../src/content/benchmarks";
import {
  HMS_DURABILITY,
  HMS_FAQ,
  HMS_TIERS,
  hmsCheckoutUrl,
  hmsWaitlistUrl,
} from "../src/content/hms";

// Claims on the page must trace to committed files in the HMS repository, and paid
// prices stay off the site until the business plan publishes them.
describe("product content", () => {
  it("cites every benchmark to a committed results file at a pinned commit", () => {
    expect(BENCH_SOURCE_SHA).toMatch(/^[0-9a-f]{40}$/);
    const pinned = new RegExp(
      `^https://github\\.com/writerslogic/holographic-memory/blob/${BENCH_SOURCE_SHA}/benchmarks/results/competitive/[\\w.-]+\\.json$`,
    );
    for (const g of [...VECTOR_GROUPS, ...TEXT_GROUPS]) expect(g.source).toMatch(pinned);
    for (const c of PROOF_CHIPS) expect(c.href).toMatch(pinned);
    expect(HMS_DURABILITY.source).toMatch(/^benchmarks\/results\/[\w.-]+\.json$/);
  });

  it("charts HMS against at least one competitor, measured", () => {
    for (const g of [...VECTOR_GROUPS, ...TEXT_GROUPS]) {
      expect(g.rows.filter((r) => r.hms)).toHaveLength(1);
      expect(g.rows.length).toBeGreaterThan(1);
      for (const r of g.rows) expect(r.value).toBeGreaterThan(0);
    }
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
