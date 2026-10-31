import legacyContext from "./legacy-context.js";

export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (!["GET", "HEAD"].includes(request.method)) {
      return new Response("Method not allowed", { status: 405, headers: { allow: "GET, HEAD" } });
    }
    if (url.pathname === "/ns/hms/v1.jsonld") {
      return new Response(request.method === "HEAD" ? null : legacyContext, {
        headers: {
          "content-type": "application/ld+json; charset=utf-8",
          "cache-control": "public, max-age=31536000, immutable",
          "access-control-allow-origin": "*",
        },
      });
    }
    const legacy = ["/v0.6.4", "/v0.6.3", "/v0.6.1"].find((version) => url.pathname === version || url.pathname.startsWith(`${version}/`));
    const path = legacy ? `/latest${url.pathname.slice(legacy.length) || "/"}` : url.pathname;
    return Response.redirect(`https://writerslogic.com/warm/docs${path}${url.search}`, 301);
  },
};
