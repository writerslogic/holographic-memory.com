import { describe, expect, it } from "vitest";
import { migrationRedirect, onRequest } from "../functions/_middleware";

describe("WARM migration", () => {
  it("preserves product and documentation paths, queries and fragments", () => {
    for (const host of ["holographic-memory.com", "www.holographic-memory.com"]) {
      expect(migrationRedirect(new URL(`https://${host}/?plan=cloud#pricing`), "GET")).toBe("https://writerslogic.com/warm?plan=cloud#pricing");
      expect(migrationRedirect(new URL(`https://${host}/docs/latest/quickstart/?q=1`), "HEAD")).toBe("https://writerslogic.com/warm/docs/latest/quickstart/?q=1");
    }
    expect(migrationRedirect(new URL("https://docs.holographic-memory.com/latest/quickstart/"), "GET")).toBe("https://writerslogic.com/warm/docs/latest/quickstart/");
  });
  it("leaves API requests, writes and preview hosts alone", async () => {
    const next = () => Promise.resolve(new Response("passed"));
    for (const [url, method] of [
      ["https://holographic-memory.com/api/hms/checkout?plan=cloud", "GET"],
      ["https://holographic-memory.com/api/hms/portal", "POST"],
      ["https://holographic-memory.com/webhook", "POST"],
      ["https://preview.holographic-memory.pages.dev/", "GET"],
    ]) {
      expect(migrationRedirect(new URL(url), method)).toBeNull();
      expect(await (await onRequest({ request: new Request(url, { method }), next })).text()).toBe("passed");
    }
    const result = await onRequest({ request: new Request("https://holographic-memory.com/"), next });
    expect(result.status).toBe(301);
    expect(result.headers.get("location")).toBe("https://writerslogic.com/warm");
  });
});
