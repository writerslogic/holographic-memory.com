import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { App } from "./App";
import {
  HMS_CANONICAL,
  HMS_COMPANY_URL,
  HMS_FAQ,
  HMS_JSON_LD,
  HMS_REPO,
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

const ORG_ID = `${HMS_COMPANY_URL}/#organization`;

// One JSON-LD graph: the publisher, the application, its source code and the FAQ
// exactly as rendered on the page.
function jsonLd(): string {
  const graph = [
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: "WritersLogic, Inc.",
      url: HMS_COMPANY_URL,
      logo: `${HMS_COMPANY_URL}/writerslogic.png`,
    },
    {
      "@type": "WebSite",
      "@id": `${HMS_CANONICAL}#website`,
      url: HMS_CANONICAL,
      name: HMS_JSON_LD.name,
      publisher: { "@id": ORG_ID },
    },
    { ...HMS_JSON_LD, "@context": undefined, publisher: { "@id": ORG_ID } },
    {
      "@type": "SoftwareSourceCode",
      "@id": `${HMS_CANONICAL}#source`,
      name: HMS_JSON_LD.name,
      codeRepository: HMS_REPO,
      programmingLanguage: "Rust",
      license: HMS_JSON_LD.license,
      author: { "@id": ORG_ID },
      targetProduct: { "@id": HMS_JSON_LD["@id"] },
    },
    {
      "@type": "FAQPage",
      "@id": `${HMS_CANONICAL}#faq`,
      mainEntity: HMS_FAQ.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c");
}

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
    `<meta property="og:locale" content="en_US" />`,
    `<script type="application/ld+json">${jsonLd()}</script>`,
  ].join("\n    ");
}
