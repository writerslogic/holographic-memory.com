// Holographic Memory product content: names, links, claims and tiers in one place.
//
// Plain data (no import.meta.env, no React) so the page, the server render and the
// tests can all import it. Every factual claim carries the committed source in
// github.com/writerslogic/holographic-memory (main) that backs it; a claim without a
// committed source is worded as "in progress". writerslogic.com keeps a shorter copy
// of the shared claims in src/content/hms.ts; keep the two in step.

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
export const HMS_ONE_LINER =
  "An embeddable memory and search engine that runs on your machine: hybrid document search and a vector-symbolic fact store in one Rust library, with optional encryption at rest and signed provenance. No service calls, no telemetry.";

export const HMS_REPO = "https://github.com/writerslogic/holographic-memory";
export const HMS_LINKS = {
  github: HMS_REPO,
  docs: "https://writerslogic.github.io/holographic-memory/",
  quickstart:
    "https://writerslogic.github.io/holographic-memory/latest/quickstart/",
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

// ── Benchmarks: committed results only ──────────────────────────────────────

export interface HmsBenchmark {
  label: string;
  hms: string;
  reference: string;
  note: string;
  source: string; // path in the HMS repo, main branch
  outcome: "ahead" | "behind";
}

export const HMS_BENCHMARKS: HmsBenchmark[] = [
  {
    label: "SciFact retrieval quality, nDCG@10",
    hms: "0.729 hybrid",
    reference: "HMS BM25 alone 0.688, HMS dense alone 0.645",
    note: "5,183 documents, 300 queries, MiniLM embeddings supplied by the harness. Quality only: the run was on a loaded machine, so no latency is quoted.",
    source: "benchmarks/results/public_scifact.json",
    outcome: "ahead",
  },
  {
    label: "NFCorpus retrieval quality, nDCG@10",
    hms: "0.355 hybrid",
    reference: "BM25 0.323, dense 0.317",
    note: "3,633 documents, 323 queries. Quality only.",
    source: "benchmarks/results/public_nfcorpus.json",
    outcome: "ahead",
  },
  {
    label: "Lexical search throughput vs SQLite FTS5",
    hms: "4.48x the queries per second",
    reference:
      "SQLite FTS5 (3.53.4); HMS p99 0.52 ms vs 5.13 ms; HMS peak memory 1.07x SQLite's",
    note: "NFCorpus, 324 queries x 8 passes, 11 interleaved rounds, both engines driven from Node 26 on one Intel Core Ultra 9 185H host (WSL2). One host, one workload.",
    source: "benchmarks/results/serving_memory_v40.json",
    outcome: "ahead",
  },
  {
    label: "Approximate vector search, glove-100-angular recall@10",
    hms: "0.252 at 33.7 QPS (sparse vector path)",
    reference: "FAISS HNSW 0.832 at 4,111 QPS; hnswlib 0.831 at 3,368 QPS",
    note: "1.18M vectors, one thread, Apple M4. HMS loses here; use a dedicated HNSW index if pure vector ANN is your workload.",
    source: "benchmarks/results/public_glove-100-angular.json",
    outcome: "behind",
  },
];

export const HMS_DURABILITY = {
  summary:
    "Killed mid-write at 200 points, mid-compaction at 200 points and at 50 simulated power losses: 0 committed documents lost; recovery median 13.8 ms after a killed write. 50 torn writes and 50 bit flips: every one detected or harmless, none served silently.",
  note: "4,000 documents, Linux x86 (WSL2). Measured on a pre-release build whose end-of-log marker change is now on main.",
  source: "benchmarks/results/durability_matrix_v2.json",
} as const;

export const HMS_IN_PROGRESS = [
  "Durable replace and delete latency against SQLite FTS5, tantivy and Lucene",
  "Head-to-head runs against Mem0, Zep, Chroma and Qdrant on the same hardware",
  "Held-out LongMemEval answer accuracy",
] as const;

// ── What ships (README "What ships today", main) ────────────────────────────

export interface HmsCapability {
  title: string;
  body: string;
  status: string;
  source: string;
}

export const HMS_CAPABILITIES: HmsCapability[] = [
  {
    title: "Hybrid document search",
    body: "Stemmed BM25 fused with exact cosine over embeddings you supply, metadata filters and byte offsets back into the source.",
    status: "Ships",
    source: "README.md",
  },
  {
    title: "Atomic updates, crash-safe storage",
    body: "Atomic replace and delete on a CRC-checked, append-only log with verified compaction and a single-writer process lock.",
    status: "Ships",
    source: "README.md",
  },
  {
    title: "Encryption at rest",
    body: "AES-256-GCM with an Argon2id-derived key over the log, index caches and stored text. Compile-time opt-in (security feature). Metadata, file names and sizes are not encrypted.",
    status: "Ships (opt-in)",
    source: "docs/PRIVACY.md",
  },
  {
    title: "Signed provenance",
    body: "A signed audit log, credential-gated agent access, and COSE, SCITT and C2PA statements over Ed25519 with W3C DID identity (provenance feature).",
    status: "Ships (opt-in)",
    source: "README.md",
  },
  {
    title: "Purge that erases text",
    body: "Deleting zeroes the deleted text records; purge rewrites the journal without them, overwrites the replaced generation with zeros and syncs before it returns. A test scans every file in the store for the deleted text.",
    status: "Ships",
    source: "docs/memory-api/README.md",
  },
  {
    title: "Vector-symbolic fact memory",
    body: "Bind, bundle and permute over sparse hypervectors; triples stored as bound composites, multi-hop queries and Hopfield cleanup.",
    status: "Ships (runtime opt-in)",
    source: "README.md",
  },
  {
    title: "On-device models",
    body: "Optional local Qwen3 embedding, reranking and generation from weights you provide. Never downloads.",
    status: "Ships (opt-in)",
    source: "README.md",
  },
  {
    title: "hms-server",
    body: "Multi-tenant HTTP API with scoped per-tenant keys, TLS, snapshots and an OpenAPI 3.1 contract. Single node.",
    status: "Ships",
    source: "docs/SERVER.md",
  },
];

export const HMS_LIMITS = [
  "Not a fast approximate-nearest-neighbour index: dedicated HNSW libraries are far ahead on pure vector search.",
  "Hypervector sketches and term counts are not encryption; anyone holding a plaintext store can test candidate text against it. Use the encrypted store for confidentiality.",
  "Deleted bytes can survive in places no file API reaches: SSD wear levelling, snapshots, backups and swap. Pair purge with encryption or full-disk encryption.",
  "No MCP server ships yet, the npm package is deprecated (build the Node module from source) and Python is an HTTP client, not in-process search.",
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
}

export const HMS_COMPETITOR_ROWS: HmsCompetitorRow[] = [
  {
    property: "Runs inside your app, no service",
    hms: "Yes: Rust library, Node module, C ABI",
    others: {
      Mem0: "Open-source library; Mem0 Platform is hosted",
      Zep: "Hosted; Community Edition no longer maintained (April 2025)",
      Chroma: "In-process from Python; JS and Rust use a server",
      Qdrant: "Server or Cloud",
    },
  },
  {
    property: "Encryption at rest in the open-source product",
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
    hms: "COSE, SCITT, C2PA over Ed25519",
    others: {
      Mem0: "Not documented",
      Zep: "Not documented",
      Chroma: "Not documented",
      Qdrant: "Not documented",
    },
  },
  {
    property: "Delete erases stored data",
    hms: "Text zeroed on delete; purge overwrites old generations",
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

export interface HmsCompareRow {
  feature: string;
  oss: string;
  cloud: string;
}

export const HMS_OSS_VS_CLOUD: HmsCompareRow[] = [
  { feature: "License", oss: "Apache-2.0 (source on main)", cloud: "Managed service" },
  { feature: "Where your data lives", oss: "Your machine or your servers", cloud: "Managed, multi-tenant; single-tenant and your-cloud options on Enterprise" },
  { feature: "Hybrid search, fact memory, atomic log", oss: "Included", cloud: "Included" },
  { feature: "Encryption at rest", oss: "Opt-in at compile time", cloud: "On by default" },
  { feature: "Signed provenance and audit log", oss: "Included (opt-in)", cloud: "Included, plus a hosted verification service on Enterprise" },
  { feature: "HTTP API", oss: "hms-server, single node, you operate it", cloud: "Operated for you, with high availability" },
  { feature: "Encrypted device and cloud sync", oss: "Not included", cloud: "Planned" },
  { feature: "Bring your own key (KMS), SSO, audit export", oss: "Not included", cloud: "Team and Enterprise" },
  { feature: "Support", oss: "GitHub issues and discussions", cloud: "Email, shared channel or named contact by tier" },
];

// ── Tiers ───────────────────────────────────────────────────────────────────
// Prices are deliberately absent: the business plan holds them as indicative until
// the Cloud prototype measures cost to serve. The checkout CTA is behind
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
    summary: "The open-source engine and server, self-hosted.",
    features: [
      "Rust library, Node and Python clients, C ABI",
      "Hybrid search, fact memory, atomic crash-safe log",
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
    summary: "Managed memory API with no minimum and a free monthly allowance.",
    features: [
      "Encrypted at rest by default",
      "Pay for storage, writes and queries",
      "Encrypted sync between devices and cloud",
      "Business-hours email support",
    ],
    checkout: true,
  },
  {
    plan: "team",
    name: "Team",
    price: "Monthly plan",
    status: "In development",
    summary: "Managed or self-hosted with support, for a team shipping agents.",
    features: [
      "Everything in Cloud, with included usage",
      "SSO and audit export",
      "Shared support channel",
      "Uptime commitment",
    ],
    checkout: true,
  },
  {
    plan: "enterprise",
    name: "Enterprise",
    price: "Annual contract",
    status: "Talk to us",
    summary: "Single-tenant, your cloud, or self-hosted, with key management and compliance.",
    features: [
      "Bring your own key (KMS / HSM)",
      "Provenance verification service and compliance reports",
      "Single-tenant or bring-your-own-cloud deployment",
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
    a: "Holographic Memory is a library you embed, not a service you call, and it puts encryption at rest, signed provenance and a text-erasing purge in the open-source engine itself. It is not the fastest vector index: on pure approximate-nearest-neighbour search, HNSW libraries beat it by a wide margin, and the benchmark table says so.",
  },
  {
    q: "Why is it called holographic?",
    a: "The fact memory uses holographic reduced representations: many bound facts are superposed into one fixed-size vector, so every part carries a little of the whole and damage degrades recall gradually. Document search is conventional BM25 and cosine and does not claim that property.",
  },
  {
    q: "Is it really deleted when I delete it?",
    a: "Delete removes a record from every query at once and zeroes its stored text. Purge also rewrites the journal and overwrites the old generation with zeros before it returns. Copies outside the store's files, such as backups, snapshots and SSD wear levelling, are out of any library's reach; encrypt the store when those matter. Signed deletion certificates are research, not yet in the shipped API.",
  },
  {
    q: "Which license applies?",
    a: HMS_LICENSE_NOTE,
  },
  {
    q: "Which languages can I use?",
    a: "Rust natively; Node.js bindings built from source; a Python HTTP client (holographic-sdk) for hms-server; and a C ABI with Go, Java and .NET bindings.",
  },
  {
    q: "When is the Cloud available?",
    a: `${HMS_CLOUD_NAME} is in development. Join the waitlist and we will write when the beta opens. Pricing is published at launch.`,
  },
];

// ── Static-shell metadata (written into dist/index.html by scripts/prerender.mjs)

export const HMS_META = {
  title: `${HMS_FULL_NAME}: Local, Encrypted Memory for AI Agents`,
  description:
    "Embeddable memory for AI agents that runs on your machine. Hybrid search, vector-symbolic fact memory, optional encryption at rest and signed provenance in one open-source Rust engine. No service calls.",
  ogTitle: `${HMS_FULL_NAME}`,
  ogDescription:
    "Local, encrypted, provenance-aware memory for AI agents. Open-source Rust engine; managed Cloud in development.",
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
  softwareVersion: "0.6.1",
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
