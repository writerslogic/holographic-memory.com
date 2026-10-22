// The apex is canonical: requests for www.holographic-memory.com get a permanent redirect
// to the same path and query on holographic-memory.com. /docs and everything under it moves
// to the docs subdomain, as writerslogic.com/docs does. Every other request passes through.

const APEX = "holographic-memory.com";
const DOCS = `https://docs.${APEX}`;

export function docsRedirect(url: URL): string | null {
  if (url.pathname !== "/docs" && !url.pathname.startsWith("/docs/")) return null;
  return DOCS + (url.pathname.slice("/docs".length) || "/") + url.search;
}

export function apexRedirect(url: URL): string | null {
  if (url.hostname !== `www.${APEX}`) return null;
  const to = new URL(url.toString());
  to.hostname = APEX;
  to.protocol = "https:";
  to.port = "";
  return to.toString();
}

export const onRequest = async ({
  request,
  next,
}: {
  request: Request;
  next: () => Promise<Response>;
}): Promise<Response> => {
  const url = new URL(request.url);
  const to = docsRedirect(url) ?? apexRedirect(url);
  return to ? Response.redirect(to, 301) : next();
};
