// The apex is canonical: requests for www.holographic-memory.com get a permanent redirect
// to the same path and query on holographic-memory.com. Every other host passes through.

const APEX = "holographic-memory.com";

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
  const to = apexRedirect(new URL(request.url));
  return to ? Response.redirect(to, 301) : next();
};
