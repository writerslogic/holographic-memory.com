// Holographic Memory product content: names, links, claims and tiers in one place.
//
// Plain data (no import.meta.env, no React) so the page, the server render and the
// tests can all import it. Every factual claim carries the committed source in
// github.com/writerslogic/holographic-memory (main) that backs it; a claim without a
// committed source is worded as "in progress". writerslogic.com keeps a shorter copy
// of the shared claims in src/content/hms.ts; keep the two in step.

import { SIFT_QPS_FACTOR_095 } from "./benchmarks";

export const HMS_NAME = "Holographic Memory";
export const HMS_FULL_NAME = "WritersLogic Holographic Memory";
export const HMS_CLOUD_NAME = "WritersLogic Holographic Memory Cloud";
export const HMS_SHORT = "HMS";

export const HMS_PRODUCT_ORIGIN = "https://holographic-memory.com";
export const HMS_CANONICAL = `${HMS_PRODUCT_ORIGIN}/`;
export const HMS_COMPANY_URL = "https://writerslogic.com";
export const HMS_OG_IMAGE = `${HMS_PRODUCT_ORIGIN}/og-image.png`;
export const HMS_OG_IMAGE_ALT =
  "WritersLogic Holographic Memory: local, encrypted, provenance-aware memory for AI agents";

export const HMS_TAGLINE =
  "Local, encrypted, provenance-aware memory for AI agents.";
export const HMS_HERO_LINE =
  "Search and memory that run inside your app, on your machine. No service calls, no telemetry.";
export const HMS_HERO_LINE_SHORT = "Runs inside your app, on your machine. No service calls.";

export const HMS_REPO = "https://github.com/writerslogic/holographic-memory";
export const HMS_LINKS = {
  github: HMS_REPO,
  docs: "https://docs.holographic-memory.com/",
  quickstart:
    "https://docs.holographic-memory.com/latest/quickstart/",
  benchmarks: `${HMS_REPO}/tree/main/benchmarks/results`,
  crates: "https://crates.io/crates/holographic-memory",
  docsRs: "https://docs.rs/holographic-memory",
  pypiSdk: "https://pypi.org/project/holographic-sdk/",
  server: `${HMS_REPO}/blob/main/docs/SERVER.md`,
  privacy: `${HMS_REPO}/blob/main/docs/PRIVACY.md`,
  limits: `${HMS_REPO}#limits`,
  license: `${HMS_REPO}/blob/main/LICENSE`,
} as const;

/** Blob URL for a committed file on the HMS main branch. */
export const hmsSource = (path: string): string =>
  `${HMS_REPO}/blob/main/${path}`;

export const HMS_CONTACT_EMAIL = "david@writerslogic.com";

// ── Durability (committed results file) ─────────────────────────────────────

export const HMS_DURABILITY = {
  summary:
    "Killed mid-write at 200 points, mid-compaction at 200 points and at 50 simulated power losses: 0 committed documents lost; recovery median 13.8 ms after a killed write. 50 torn writes and 50 bit flips: every one detected or harmless, none served silently.",
  note: "4,000 documents, Linux x86 (WSL2). Measured on a pre-release build whose end-of-log marker change is now on main.",
  source: "benchmarks/results/durability_matrix_v2.json",
} as const;

// ── Known limits ────────────────────────────────────────────────────────────

export const HMS_LIMITS = [
  "The older sparse vector path (memorize_vector) is experimental and far behind HNSW libraries: on glove-100, Apple M4: recall@10 0.252 at 33.7 QPS against hnswlib 0.831 at 3,368 QPS (public_glove-100-angular.json). Use the vertex graph index for vector search.",
  "Hypervector sketches and term counts are not encryption; anyone holding a plaintext store can test candidate text against it. Use the encrypted store for confidentiality.",
  "Deleted bytes can survive in places no file API reaches: SSD wear levelling, snapshots, backups and swap. Pair purge with encryption or full-disk encryption.",
  "The MCP server builds from source with the mcp feature. Build the Node module from source while the npm package is deprecated. The Python SDK is an HTTP client for hms-server, not in-process document search.",
] as const;

// ── How alternatives document the same properties ──────────────────────────
// Each competitor cell paraphrases that vendor's own documentation, read on
// HMS_COMPETITOR_CHECKED. "Not documented" means no page in the vendor's docs says
// so, not that the feature cannot exist. Re-check before changing a cell.

export const HMS_COMPETITOR_CHECKED = "2026-10-21";

export const HMS_COMPETITORS = ["Mem0", "Zep", "Chroma", "Qdrant"] as const;

export interface HmsCompetitorRow {
  property: string;
  hms: string;
  others: Record<(typeof HMS_COMPETITORS)[number], string>;
  // Matrix glyphs, in the order HMS, then HMS_COMPETITORS. Derived from the text
  // cells: "Not documented" is unknown; a paid add-on or caveat is partial.
  marks: ("yes" | "partial" | "no" | "unknown")[];
}

export const HMS_COMPETITOR_ROWS: HmsCompetitorRow[] = [
  {
    property: "Runs inside your app, no service",
    marks: ["yes", "partial", "no", "partial", "partial"],
    hms: "Yes: Rust library, Node module, C ABI",
    others: {
      Mem0: "Open-source library; Mem0 Platform is hosted",
      Zep: "Hosted; Community Edition no longer maintained (April 2025)",
      Chroma: "In-process from Python; JS and Rust use a server",
      Qdrant: "Server or Cloud; the Python client has a local mode (exact scan)",
    },
  },
  {
    property: "Encryption at rest in the open-source product",
    marks: ["yes", "unknown", "partial", "unknown", "partial"],
    hms: "Built in (opt-in)",
    others: {
      Mem0: "Not documented",
      Zep: "Customer keys are an Enterprise add-on",
      Chroma: "Not documented for open source",
      Qdrant: "Self-hosted: customer configuration",
    },
  },
  {
    property: "Signed provenance of stored records",
    marks: ["yes", "unknown", "unknown", "unknown", "unknown"],
    hms: "COSE, SCITT, C2PA over Ed25519",
    others: {
      Mem0: "Not documented",
      Zep: "Not documented",
      Chroma: "Not documented",
      Qdrant: "Not documented",
    },
  },
  {
    property: "Deleted text erased from disk",
    marks: ["yes", "unknown", "partial", "unknown", "partial"],
    hms: "Purge rewrites the journal and zeroes old generations before returning",
    others: {
      Mem0: "Not documented",
      Zep: "Removed in the background; overwrite not documented",
      Chroma: "Not documented",
      Qdrant: "Marked deleted, cleaned up later by an optimizer",
    },
  },
];

export const HMS_COMPETITOR_SOURCES: { label: string; href: string }[] = [
  { label: "Mem0 open source", href: "https://docs.mem0.ai/open-source/overview" },
  { label: "Mem0 Platform", href: "https://docs.mem0.ai/platform/overview" },
  { label: "Zep open-source strategy", href: "https://www.getzep.com/blog/announcing-a-new-direction-for-zeps-open-source-strategy" },
  { label: "Zep bring your own key", href: "https://help.getzep.com/bring-your-own-key" },
  { label: "Chroma clients", href: "https://docs.trychroma.com/docs/run-chroma/clients" },
  { label: "Qdrant security", href: "https://qdrant.tech/security/" },
  { label: "Qdrant optimizer", href: "https://qdrant.tech/documentation/concepts/optimizer/" },
];

// ── Licensing ───────────────────────────────────────────────────────────────

export const HMS_LICENSE_NOTE =
  "The source on main is Apache-2.0. Packages published so far (crate 0.6.1, holographic-sdk 0.1.2 on PyPI) were released under AGPL-3.0-or-later and stay available under those terms.";

// ── Open source vs Cloud ────────────────────────────────────────────────────
// Cloud is not a hosted engine. Memory and the engine stay on the user's machine;
// Cloud adds end-to-end encrypted sync and backup (the server holds ciphertext
// only), provenance and deletion-certificate verification against a transparency
// log, and team key management, audit and SSO, run on Cloudflare.

export const HMS_LOCAL_FIRST_NOTE =
  `Your memory stays on your machines. Cloud keeps your machines in step: encrypted sync across your laptops, desktops and team, a backup you can restore anywhere, and independent verification of the provenance and deletion records your stores sign. We never hold your keys, never see your documents and never run your searches. ${HMS_CLOUD_NAME} runs its sync, backup and verification on Cloudflare.`;

export interface HmsCompareRow {
  feature: string;
  oss: string;
  cloud: string;
}

export const HMS_OSS_VS_CLOUD: HmsCompareRow[] = [
  { feature: "Engine, search and fact memory", oss: "On your machine", cloud: "Still on your machine" },
  { feature: "Where plaintext lives", oss: "Only on your devices", cloud: "Only on your devices; the server stores ciphertext" },
  { feature: "Encryption at rest and signed provenance", oss: "Included (opt-in features)", cloud: "Included" },
  { feature: "End-to-end encrypted sync and backup across devices", oss: "Not included", cloud: "Included" },
  { feature: "Tamper-evident, hash-chained change history", oss: "Local journal", cloud: "Checked on every device" },
  { feature: "Provenance and deletion-record verification, transparency log", oss: "Verify locally", cloud: "Hosted verification, your own append-only log, offline-verifiable receipts" },
  { feature: "Scoped API keys, signed audit export, SSO (OIDC)", oss: "Not included", cloud: "Audit export in Cloud; all three in Team and Enterprise" },
  { feature: "Support", oss: "GitHub issues and discussions", cloud: "Email, shared channel or named contact by tier" },
];

// ── Tiers ───────────────────────────────────────────────────────────────────
// Prices are deliberately absent: offerings-and-pricing holds them as indicative
// until cost to serve is measured. The checkout CTA is behind
// VITE_HMS_CHECKOUT_ENABLED (see src/content/flags.ts).

export type HmsPlan = "community" | "cloud" | "team" | "enterprise";

export interface HmsTier {
  plan: HmsPlan;
  name: string;
  price: string;
  status: string;
  summary: string;
  features: string[];
  checkout: boolean; // false: always links out (free / sales) instead of checkout
}

export const HMS_TIERS: HmsTier[] = [
  {
    plan: "community",
    name: "Community",
    price: "Free",
    status: "Available now",
    summary: "The open-source engine and server on your own machines.",
    features: [
      "Rust library, Python SDK, C ABI with Go, Java and .NET",
      "Hybrid search, fact memory, crash-safe log",
      "Optional encryption at rest and signed provenance",
      "Support through GitHub",
    ],
    checkout: false,
  },
  {
    plan: "cloud",
    name: "Cloud",
    price: "Usage-based",
    status: "In development",
    summary: "Sync, backup and verification for the memory you keep locally. Pay for encrypted storage, sync operations and verifications, each with a free monthly allowance.",
    features: [
      "End-to-end encrypted sync (AES-256-GCM, keys only on your devices); concurrent edits converge and conflicts are reported",
      "Encrypted backup of each store's full history; restore any device with your sync key",
      "Tamper-evident history: reordered, altered or spliced changes are detected on your device",
      "Provenance and deletion-record verification with receipts you can check offline",
      "Signed audit export; business-hours email support",
    ],
    checkout: true,
  },
  {
    plan: "team",
    name: "Team",
    price: "Monthly plan",
    status: "In development",
    summary: "Encrypted sync and verification shared across a team, with usage included each month.",
    features: [
      "Everything in Cloud, with included monthly usage and a larger storage quota",
      "Scoped API keys with rotation and instant revocation",
      "SSO through your identity provider (OIDC) and a signed, exportable audit log",
      "Shared support channel and uptime commitment",
    ],
    checkout: true,
  },
  {
    plan: "enterprise",
    name: "Enterprise",
    price: "Talk to us",
    status: "Talk to us",
    summary: "Your keys, your infrastructure, compliance reporting.",
    features: [
      "Annual agreement with custom quotas",
      "Bring your own key (KMS / HSM)",
      "Transparency log and verification you can run yourself",
      "Compliance reports and audit retention",
      "Named support contact",
    ],
    checkout: true,
  },
];

export const hmsCheckoutUrl = (plan: HmsPlan): string =>
  `/api/hms/checkout?plan=${plan}`;

export const hmsWaitlistUrl = (plan: HmsPlan): string =>
  `mailto:${HMS_CONTACT_EMAIL}?subject=${encodeURIComponent(
    `${HMS_CLOUD_NAME} waitlist: ${plan}`,
  )}`;

// ── FAQ ─────────────────────────────────────────────────────────────────────

export const HMS_FAQ: { q: string; a: string }[] = [
  {
    q: "Does it send my data anywhere?",
    a: "No. The engine makes no network calls and sends no telemetry. Embeddings are either supplied by you or computed by local models from weights you provide; it never downloads a model.",
  },
  {
    q: "How is this different from Mem0, Zep, Chroma or Qdrant?",
    a: `Holographic Memory is a library you embed, not a service you call, and it puts encryption at rest, signed provenance and a text-erasing purge in the open-source engine itself. Vector search runs on a vertex graph index; on SIFT-1M it served ${SIFT_QPS_FACTOR_095} the queries per second of hnswlib at recall 0.95 on the same machine (benchmarks section).`,
  },
  {
    q: "Why is it called holographic?",
    a: "The fact memory uses holographic reduced representations: many bound facts are superposed into one fixed-size vector, so every part carries a little of the whole and damage degrades recall gradually. Document search is conventional BM25 and cosine and does not claim that property.",
  },
  {
    q: "Is it really deleted when I delete it?",
    a: "Delete removes a record from every query at once; its journal frame stays until compaction or purge. Purge rewrites the journal and overwrites the old generation with zeros before it returns. Copies outside the store's files, such as backups, snapshots and SSD wear levelling, are out of any library's reach; encrypt the store when those matter. Signed deletion certificates are research, not yet in the shipped API.",
  },
  {
    q: "Which license applies?",
    a: HMS_LICENSE_NOTE,
  },
  {
    q: "Which languages can I use?",
    a: "Rust natively; MCP for editors and agents; Node.js bindings built from source; a Python HTTP client (holographic-sdk) for hms-server; and a C ABI with Go, Java and .NET bindings.",
  },
  {
    q: "What does the Cloud do if the engine runs locally?",
    a: `${HMS_CLOUD_NAME} is sync, backup and verification, not a hosted engine. Your documents, embeddings, memory index, queries and sync key never leave your devices. Every change is sealed on your device before upload, so the service holds only sealed bytes and the metadata needed to order them (change counts, sizes, times, device and key identifiers) plus your account and billing details. For verification it keeps hashes, the signer's public identity and the claim time, never the statement's contents. It is in development: join the waitlist and we will write when the beta opens. Prices are published at launch.`,
  },
];

// ── Static-shell metadata (written into dist/index.html by scripts/prerender.mjs)

export const HMS_META = {
  title: `${HMS_FULL_NAME}: Local, Encrypted Memory for AI Agents`,
  description:
    "Embeddable memory for AI agents that runs on your machine. Hybrid search, vector-symbolic fact memory, optional encryption at rest and signed provenance in one open-source Rust engine. No service calls.",
  ogTitle: `${HMS_FULL_NAME}`,
  ogDescription:
    "Local, encrypted, provenance-aware memory for AI agents. Open-source Rust engine that stays on your machine; encrypted sync, backup and verification Cloud in development.",
} as const;

export const HMS_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": `${HMS_CANONICAL}#software`,
  name: HMS_FULL_NAME,
  alternateName: [HMS_NAME, HMS_SHORT],
  applicationCategory: "DeveloperApplication",
  applicationSubCategory: "Embedded database and memory engine",
  operatingSystem: "macOS, Linux, Windows",
  url: HMS_CANONICAL,
  image: HMS_OG_IMAGE,
  description: HMS_META.description,
  license: "https://spdx.org/licenses/Apache-2.0.html",
  codeRepository: HMS_REPO,
  programmingLanguage: "Rust",
  isAccessibleForFree: true,
  offers: {
    "@type": "Offer",
    name: "Community",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  },
  sameAs: [HMS_REPO, HMS_LINKS.crates],
  publisher: {
    "@type": "Organization",
    name: "WritersLogic, Inc.",
    url: HMS_COMPANY_URL,
  },
} as const;

// ── Use cases, integrations and the provenance platform ─────────────────────

export const HMS_USE_CASES = [
  {
    title: "Agent memory",
    body: "Give an agent durable recall of facts, conversations and decisions that lives in its own process, survives crashes and can be purged on request.",
  },
  {
    title: "RAG over private documents",
    body: "Index contracts, notes or code on the machine that already holds them. BM25 and the embeddings you choose, fused, with byte offsets back to the source; nothing is uploaded.",
  },
  {
    title: "On-device apps",
    body: "Ship search and memory inside a desktop or edge app through the Rust crate or the C ABI, with encryption at rest and no server to run.",
  },
] as const;

export interface HmsIntegration {
  name: string;
  detail: string;
  href: string;
}

// Adapters from integrations/ in the HMS repo (PR #106). None is published to a
// registry yet, so every entry installs from source.
export const HMS_INTEGRATIONS: HmsIntegration[] = [
  {
    name: "Python: holographic-integrations",
    detail: "LangChain, LangGraph, LlamaIndex, Haystack, DSPy, OpenAI Agents, Pydantic AI, smolagents, LiteLLM, CrewAI, AutoGen, AG2, Semantic Kernel, Mem0 and Letta, one extra per framework",
    href: `${HMS_REPO}/tree/main/integrations/python`,
  },
  {
    name: "JavaScript: @holographic-memory/*",
    detail: "LangChain.js, LlamaIndex.TS, Mastra, OpenAI Agents SDK and the Vercel AI SDK",
    href: `${HMS_REPO}/tree/main/integrations/js`,
  },
];

export const HMS_PLATFORM = {
  intro:
    "Holographic Memory is part of the WritersLogic provenance platform: the same signed-statement substrate (COSE and SCITT over Ed25519, W3C DID identity) runs through every product.",
  links: [
    { name: "WritersProof", detail: "Records how a document is written and seals that process into signed evidence anyone can verify", href: "https://writersproof.com" },
    { name: "Draftbridge", detail: "Coming soon", href: "" },
  ],
};
