// /api/hms/{checkout,welcome,portal}: the pricing buttons' endpoints. Billing lives in the
// WritersLogic hms-billing Worker (writerslogic.com repo, workers/hms-billing); this forwards
// to it and names this site's origin so Checkout returns here. Preview deployments
// (*.pages.dev) use the Stripe test-mode twin; everything else uses the live Worker.

const LIVE = "https://writerslogic.com/api/warm";
const TEST = "https://hms-billing-test.writerslogic.com/api/hms-staging";
const ROUTES = new Set(["GET /checkout", "GET /welcome", "GET /portal", "POST /portal"]);

export function target(url: URL, method: string): string | null {
  const sub = url.pathname.replace(/^\/api\/hms/, "");
  if (!ROUTES.has(`${method} ${sub}`)) return null;
  const base = url.hostname.endsWith(".pages.dev") ? TEST : LIVE;
  return `${base}${sub}${url.search}`;
}

export const onRequest = async ({ request }: { request: Request }): Promise<Response> => {
  const url = new URL(request.url);
  const to = target(url, request.method);
  if (!to) {
    return new Response(JSON.stringify({ error: "not_found" }), {
      status: 404,
      headers: { "content-type": "application/json" },
    });
  }
  const headers = new Headers();
  for (const name of ["content-type", "origin", "accept", "accept-language", "user-agent"]) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  headers.set("x-hms-site-origin", url.origin);
  const upstream = await fetch(to, {
    method: request.method,
    headers,
    body: request.method === "POST" ? await request.arrayBuffer() : undefined,
    redirect: "manual",
  });
  // Pass status, Location and the Worker's security headers through unchanged.
  return new Response(upstream.body, { status: upstream.status, headers: upstream.headers });
};
