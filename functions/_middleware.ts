// The product site moved to writerslogic.com/warm. Every host this project answers on,
// the legacy domains and the *.pages.dev deployment hosts alike, sends page requests
// there. Loopback stays local so `wrangler pages dev` can still serve the build.
const DOCS_HOST = "docs.holographic-memory.com";
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);
const DESTINATION = "https://writerslogic.com/warm";

export function migrationRedirect(url: URL, method: string): string | null {
  if (LOCAL_HOSTS.has(url.hostname) || !["GET", "HEAD"].includes(method)) return null;
  if (url.pathname === "/api" || url.pathname.startsWith("/api/")) return null;
  return `${DESTINATION}${url.hostname === DOCS_HOST ? "/docs" : ""}${url.pathname}${url.search}${url.hash}`;
}

export const onRequest = async ({ request, next }: {
  request: Request;
  next: () => Promise<Response>;
}): Promise<Response> => {
  const target = migrationRedirect(new URL(request.url), request.method);
  return target ? Response.redirect(target, 301) : next();
};
