import { describe, expect, it } from "vitest";
import { apexRedirect, docsRedirect, onRequest } from "../functions/_middleware";

describe("www to apex redirect", () => {
  it("sends www to the apex with path and query kept, leaves other hosts alone", () => {
    expect(apexRedirect(new URL("http://www.holographic-memory.com/about?q=1#x"))).toBe(
      "https://holographic-memory.com/about?q=1#x",
    );
    expect(apexRedirect(new URL("https://holographic-memory.com/"))).toBeNull();
    expect(apexRedirect(new URL("https://www.holographic-memory.pages.dev/"))).toBeNull();
  });

  it("answers www with a 301 and passes the apex through", async () => {
    const passed = new Response("ok");
    const next = () => Promise.resolve(passed);
    const www = await onRequest({ request: new Request("https://www.holographic-memory.com/a"), next });
    expect(www.status).toBe(301);
    expect(www.headers.get("location")).toBe("https://holographic-memory.com/a");
    expect(await onRequest({ request: new Request("https://holographic-memory.com/a"), next })).toBe(passed);
  });

  it("sends /docs and its subpaths to the docs subdomain from either host", async () => {
    expect(docsRedirect(new URL("https://holographic-memory.com/docs"))).toBe("https://docs.holographic-memory.com/");
    expect(docsRedirect(new URL("https://www.holographic-memory.com/docs/latest/quickstart/?q=1"))).toBe(
      "https://docs.holographic-memory.com/latest/quickstart/?q=1",
    );
    expect(docsRedirect(new URL("https://holographic-memory.com/docsearch"))).toBeNull();
    const next = () => Promise.resolve(new Response("ok"));
    const res = await onRequest({ request: new Request("https://www.holographic-memory.com/docs/dev/"), next });
    expect(res.status).toBe(301);
    expect(res.headers.get("location")).toBe("https://docs.holographic-memory.com/dev/");
  });
});
