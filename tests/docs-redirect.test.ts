import { describe, expect, it } from "vitest";
import { createHash } from "node:crypto";
import worker from "../workers/docs-redirect/index.js";

describe("legacy documentation migration", () => {
  it("preserves the published immutable context bytes at their original URI", async () => {
    const response = await worker.fetch(new Request("https://docs.holographic-memory.com/ns/hms/v1.jsonld"));
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("application/ld+json");
    expect(createHash("sha256").update(await response.text()).digest("hex")).toBe("ec2dbc721f02dc1f06a7d03f589c5a7e43b5fa0ff8184d6a384516b774790b45");
  });
  it("makes the latest destination explicit for retired documentation versions", async () => {
    for (const version of ["v0.6.4", "v0.6.3", "v0.6.1"]) {
      const result = await worker.fetch(new Request(`https://docs.holographic-memory.com/${version}/quickstart/?q=1`));
      expect(result.headers.get("location")).toBe("https://writerslogic.com/warm/docs/latest/quickstart/?q=1");
    }
  });

  it("redirects documentation paths and queries while refusing writes", async () => {
    const result = await worker.fetch(new Request("https://docs.holographic-memory.com/latest/quickstart/?q=1"));
    expect(result.status).toBe(301);
    expect(result.headers.get("location")).toBe("https://writerslogic.com/warm/docs/latest/quickstart/?q=1");
    const write = await worker.fetch(new Request("https://docs.holographic-memory.com/api", { method: "POST" }));
    expect(write.status).toBe(405);
    expect(write.headers.get("location")).toBeNull();
  });
});
