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
if (!html.includes("<!--app-->") || !html.includes("<!--head-->")) {
  throw new Error("dist/index.html is missing the <!--app--> or <!--head--> marker");
}
const app = render();
if (app.length < 2000) throw new Error(`server render is suspiciously small (${app.length} bytes)`);
writeFileSync(indexPath, html.replace("<!--head-->", head()).replace("<!--app-->", app));
rmSync(`${root}dist-ssr`, { recursive: true, force: true });
console.log(`prerendered dist/index.html (${app.length} bytes of markup)`);
