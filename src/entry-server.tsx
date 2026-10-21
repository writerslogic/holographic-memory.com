import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { App } from "./App";
import {
  HMS_CANONICAL,
  HMS_JSON_LD,
  HMS_META,
  HMS_OG_IMAGE,
  HMS_OG_IMAGE_ALT,
} from "./content/hms";

export function render(): string {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

export function head(): string {
  const m = HMS_META;
  return [
    `<title>${esc(m.title)}</title>`,
    `<meta name="description" content="${esc(m.description)}" />`,
    `<link rel="canonical" href="${HMS_CANONICAL}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${esc(HMS_JSON_LD.name)}" />`,
    `<meta property="og:url" content="${HMS_CANONICAL}" />`,
    `<meta property="og:title" content="${esc(m.ogTitle)}" />`,
    `<meta property="og:description" content="${esc(m.ogDescription)}" />`,
    `<meta property="og:image" content="${HMS_OG_IMAGE}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${esc(HMS_OG_IMAGE_ALT)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(m.ogTitle)}" />`,
    `<meta name="twitter:description" content="${esc(m.ogDescription)}" />`,
    `<meta name="twitter:image" content="${HMS_OG_IMAGE}" />`,
    `<meta name="twitter:image:alt" content="${esc(HMS_OG_IMAGE_ALT)}" />`,
    `<script type="application/ld+json">${JSON.stringify(HMS_JSON_LD).replace(/</g, "\\u003c")}</script>`,
  ].join("\n    ");
}
