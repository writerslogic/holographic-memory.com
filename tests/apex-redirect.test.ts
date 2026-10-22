import { describe, expect, it } from "vitest";
import { apexRedirect, onRequest } from "../functions/_middleware";

describe("www to apex redirect", () => {
  it("sends www to the apex with path and query kept, leaves other hosts alone", () => {
    expect(apexRedirect(new URL("http://www.holographic-memory.com/docs?q=1#x"))).toBe(
      "https://holographic-memory.com/docs?q=1#x",
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
});
