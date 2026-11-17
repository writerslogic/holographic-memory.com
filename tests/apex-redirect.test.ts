import { describe, expect, it } from "vitest";
import { migrationRedirect, onRequest } from "../functions/_middleware";

describe("WARM migration", () => {
  it("preserves product and documentation paths, queries and fragments", () => {
    for (const host of ["holographic-memory.com", "www.holographic-memory.com"]) {
      expect(migrationRedirect(new URL(`https://${host}/?plan=cloud#pricing`), "GET")).toBe("https://writerslogic.com/warm/?plan=cloud#pricing");
      expect(migrationRedirect(new URL(`https://${host}/docs/latest/quickstart/?q=1`), "HEAD")).toBe("https://writerslogic.com/warm/docs/latest/quickstart/?q=1");
    }
    expect(migrationRedirect(new URL("https://docs.holographic-memory.com/"), "GET")).toBe("https://writerslogic.com/warm/docs/");
    expect(migrationRedirect(new URL("https://docs.holographic-memory.com/latest/quickstart/"), "GET")).toBe("https://writerslogic.com/warm/docs/latest/quickstart/");
  });
  it("redirects the pages.dev deployment hosts, which used to serve the old page", async () => {
    const next = () => Promise.resolve(new Response("old page"));
    for (const [url, to] of [
      ["https://holographic-memory.pages.dev/", "https://writerslogic.com/warm/"],
      ["https://preview.holographic-memory.pages.dev/get-started/choose/?x=1", "https://writerslogic.com/warm/get-started/choose/?x=1"],
      ["https://holographic-memory.pages.dev/llms.txt", "https://writerslogic.com/warm/llms.txt"],
    ]) {
      const result = await onRequest({ request: new Request(url), next });
      expect(result.status).toBe(301);
      expect(result.headers.get("location")).toBe(to);
    }
  });
  it("leaves API requests, writes and local development alone", async () => {
    const next = () => Promise.resolve(new Response("passed"));
    for (const [url, method] of [
      ["https://holographic-memory.com/api/hms/checkout?plan=cloud", "GET"],
      ["https://preview.holographic-memory.pages.dev/api/hms/checkout?plan=cloud", "GET"],
      ["https://holographic-memory.com/api/hms/portal", "POST"],
      ["https://holographic-memory.com/webhook", "POST"],
      ["http://localhost:8788/", "GET"],
    ]) {
      expect(migrationRedirect(new URL(url), method)).toBeNull();
      expect(await (await onRequest({ request: new Request(url, { method }), next })).text()).toBe("passed");
    }
    const result = await onRequest({ request: new Request("https://holographic-memory.com/"), next });
    expect(result.status).toBe(301);
    expect(result.headers.get("location")).toBe("https://writerslogic.com/warm/");
  });
});
