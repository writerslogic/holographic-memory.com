import { afterEach, describe, expect, it, vi } from "vitest";
import { onRequest, target } from "../functions/api/hms/[[path]]";

describe("/api/hms proxy", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("maps the three routes to the live Worker, previews to the test twin", () => {
    expect(target(new URL("https://holographic-memory.com/api/hms/checkout?plan=team"), "GET")).toBe(
      "https://writerslogic.com/api/warm/checkout?plan=team",
    );
    expect(target(new URL("https://feat-hms-billing.holographic-memory.pages.dev/api/hms/portal"), "POST")).toBe(
      "https://hms-billing-test.writerslogic.com/api/hms-staging/portal",
    );
    expect(target(new URL("https://holographic-memory.com/api/hms/welcome?session_id=cs_test_x"), "GET")).toContain("/welcome?session_id=");
    // The Stripe webhook is not reachable through the site, nor anything else.
    for (const [path, method] of [["/api/hms/stripe", "POST"], ["/api/hms/checkout", "POST"], ["/api/hms/../x", "GET"], ["/api/hms", "GET"]]) {
      expect(target(new URL(`https://holographic-memory.com${path}`), method)).toBeNull();
    }
  });

  it("forwards with this site's origin and passes the redirect through", async () => {
    const fetchMock = vi.fn(async () => new Response(null, { status: 303, headers: { location: "https://checkout.stripe.com/c/pay/cs_test_1" } }));
    vi.stubGlobal("fetch", fetchMock);
    const res = await onRequest({
      request: new Request("https://holographic-memory.com/api/hms/checkout?plan=cloud", { headers: { cookie: "s=1", "x-hms-site-origin": "https://evil.example" } }),
    });
    expect(res.status).toBe(303);
    expect(res.headers.get("location")).toBe("https://checkout.stripe.com/c/pay/cs_test_1");
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://writerslogic.com/api/warm/checkout?plan=cloud");
    const headers = new Headers(init.headers);
    expect(headers.get("x-hms-site-origin")).toBe("https://holographic-memory.com");
    expect(headers.get("cookie")).toBeNull();
    expect(init.redirect).toBe("manual");
  });

  it("answers 404 without calling the Worker for other paths", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const res = await onRequest({ request: new Request("https://holographic-memory.com/api/hms/stripe", { method: "POST", body: "{}" }) });
    expect(res.status).toBe(404);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
