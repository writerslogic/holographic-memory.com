const LEGACY_HOSTS = new Set(["holographic-memory.com", "www.holographic-memory.com", "docs.holographic-memory.com"]);
const DESTINATION = "https://writerslogic.com/warm";

export function migrationRedirect(url: URL, method: string): string | null {
  if (!LEGACY_HOSTS.has(url.hostname) || !["GET", "HEAD"].includes(method)) return null;
  if (url.pathname === "/api" || url.pathname.startsWith("/api/")) return null;
  const docsHost = url.hostname === "docs.holographic-memory.com";
  const path = url.pathname === "/" ? "" : url.pathname;
  return `${DESTINATION}${docsHost ? "/docs" : ""}${path}${url.search}${url.hash}`;
}

export const onRequest = async ({ request, next }: {
  request: Request;
  next: () => Promise<Response>;
}): Promise<Response> => {
  const target = migrationRedirect(new URL(request.url), request.method);
  return target ? Response.redirect(target, 301) : next();
};
