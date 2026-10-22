// Inject the server-rendered page and its <head> metadata into dist/index.html, so
// crawlers and link previews get full content and the client hydrates it.
import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const indexPath = `${root}dist/index.html`;
const { render, head } = await import(
  pathToFileURL(`${root}dist-ssr/entry-server.js`).href
);

const html = readFileSync(indexPath, "utf8");
if (!html.includes('<div id="root"><!--app--></div>') || !html.includes("<!--head-->")) {
  throw new Error("dist/index.html is missing the root <!--app--> or <!--head--> marker");
}
const app = render();
if (app.length < 2000) throw new Error(`server render is suspiciously small (${app.length} bytes)`);
// email_off keeps Cloudflare's email obfuscation from injecting its blocking
// decode script; the only address on the page is a public mailto link.
writeFileSync(
  indexPath,
  html
    .replace("<!--head-->", head())
    .replace('<div id="root"><!--app--></div>', `<!--email_off--><div id="root">${app}</div><!--/email_off-->`),
);
rmSync(`${root}dist-ssr`, { recursive: true, force: true });

// One canonical URL; lastmod is the build date, as on writerslogic.com.
const today = new Date().toISOString().slice(0, 10);
writeFileSync(
  `${root}dist/sitemap.xml`,
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://holographic-memory.com/</loc>
    <lastmod>${today}</lastmod>
  </url>
</urlset>
`,
);
console.log(`prerendered dist/index.html (${app.length} bytes of markup)`);
