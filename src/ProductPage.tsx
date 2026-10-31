import { SearchExample } from "./components/SearchExample";
import { HmsMarkBackdrop } from "./components/HmsMark";
import { InstallCommands } from "./components/InstallCommands";
import { BenchChart } from "./components/BenchChart";
import { CodeTabs } from "./components/CodeTabs";
import { CompareMatrix, MATRIX_LEGEND } from "./components/CompareMatrix";
import {
  HMS_CLOUD_NAME,
  HMS_COMPANY_URL,
  HMS_COMPETITOR_CHECKED,
  HMS_COMPETITOR_ROWS,
  HMS_COMPETITOR_SOURCES,
  HMS_COMPETITORS,
  HMS_DURABILITY,
  HMS_FAQ,
  HMS_FULL_NAME,
  HMS_INTEGRATIONS,
  HMS_LICENSE_NOTE,
  HMS_LIMITS,
  HMS_LINKS,
  HMS_LOCAL_FIRST_NOTE,
  HMS_NAME,
  HMS_TECHNICAL_LINE,
  HMS_HERO_LINE,
  HMS_HERO_LINE_SHORT,
  HMS_OSS_VS_CLOUD,
  HMS_PLATFORM,
  HMS_TAGLINE,
  HMS_TIERS,
  HMS_USE_CASES,
  hmsCheckoutUrl,
  hmsSource,
  hmsWaitlistUrl,
  type HmsTier,
} from "./content/hms";
import { HMS_CHECKOUT_ENABLED } from "./content/flags";
import {
  BENCH_COMPARISON_URL,
  BENCH_HARDWARE,
  BENCH_LOSSES,
  PROOF_CHIPS,
  TEXT_GROUPS,
  TEXT_QUALITY,
  VECTOR_GROUPS,
} from "./content/benchmarks";

const RUST_SNIPPET = `# Cargo.toml: Apache-2.0 source from main
cargo add holographic-memory --git https://github.com/writerslogic/holographic-memory
cargo add serde_json anyhow`;

const RUST_CODE = `use holographic_memory::{DocumentInput, HmsCore, SearchOptions};

fn main() -> anyhow::Result<()> {
    // 4,096-dimension store in ./memory; nothing leaves this machine.
    let hms = HmsCore::new(4096, Some("./memory".into()), None)?;
    hms.memorize_document(DocumentInput {
        id: "backups".into(),
        text: "Restore deleted documents from verified backups.".into(),
        source_uri: Some("operations.md".into()),
        version: Some("1".into()),
        metadata: Some(serde_json::json!({ "project": "alpha" })),
        chunk_words: None, overlap_words: None, store_text: None,
        embeddings: None, title_weight: None,
    })?;
    let hits = hms.search_documents("restore backups", &SearchOptions::default())?;
    println!("{} {:?}", hits[0].document_id, hits[0].source_uri);
    Ok(())
}`;

const INSTALL = [
  { lang: "Rust", cmd: "cargo add holographic-memory --git https://github.com/writerslogic/holographic-memory" },
  { lang: "Python", cmd: "pip install holographic-sdk" },
];

const PY_SHELL = `git clone https://github.com/writerslogic/holographic-memory
cd holographic-memory
# hms-server stores vectors you supply; the SDK is its HTTP client
cargo build --release --features server --bin hms-server
HMS_API_KEY=change-me target/release/hms-server --input-dim 384 &
pip install holographic-sdk`;

const PY_CODE = `from holographic_sdk import HolographicClient

client = HolographicClient(url="http://127.0.0.1:8080",
                           api_key="change-me", tenant_id="demo")
client.add_documents([{"id": "a", "vector": [0.1] * 384,
                       "text": "hello", "metadata": {}}])
print(client.query([0.1] * 384, top_k=1)["matches"][0]["id"])`;

const WHY = [
  {
    title: "Local first",
    body: "A library you link into your agent, not a service you call. Search, memory and storage run in your process on your disk, with no network calls and no telemetry.",
  },
  {
    title: "Encryption in the open engine",
    body: "AES-256-GCM at rest, keyed by Argon2id, covering the log, index caches and stored text. It is part of the Apache-2.0 engine, not an enterprise add-on.",
  },
  {
    title: "Provenance you can verify",
    body: "A signed audit log and COSE, SCITT and C2PA statements over Ed25519 with W3C DID identity record what an agent stored, and when, in formats others can check.",
  },
  {
    title: "Purge that erases",
    body: "Delete removes a record from every query at once. Purge rewrites the journal without it and overwrites the old generation with zeros before it returns; a test scans every store file for the deleted text.",
  },
];

function ExternalLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`underline underline-offset-4 decoration-teal-400/50 hover:text-teal-300 ${className}`}
    >
      {children}
    </a>
  );
}

function CodeBlock({ label, code }: { label: string; code: string }) {
  return (
    <figure className="m-0">
      <figcaption className="text-xs text-slate-300 mb-2 font-mono">
        {label}
      </figcaption>
      <div
        className="code-surface rounded-xl p-4 overflow-x-auto"
        tabIndex={0}
        role="region"
        aria-label={`${label} code, scrollable`}
      >
        <pre className="text-sm leading-relaxed font-mono m-0">
          <code>{code}</code>
        </pre>
      </div>
    </figure>
  );
}

function TierCta({ tier }: { tier: HmsTier }) {
  if (!tier.checkout) {
    return (
      <a
        href={HMS_LINKS.github}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary text-sm w-full"
        data-umami-event="cta_hms_tier"
        data-umami-event-plan={tier.plan}
      >
        Get started on GitHub
      </a>
    );
  }
  if (HMS_CHECKOUT_ENABLED) {
    return (
      <a
        href={hmsCheckoutUrl(tier.plan)}
        className="btn-primary text-sm w-full"
        data-umami-event="cta_hms_checkout"
        data-umami-event-plan={tier.plan}
      >
        {tier.plan === "enterprise" ? "Contact sales" : `Choose ${tier.name}`}
      </a>
    );
  }
  return (
    <a
      href={hmsWaitlistUrl(tier.plan)}
      className="btn-ghost text-sm w-full"
      data-umami-event="cta_hms_waitlist"
      data-umami-event-plan={tier.plan}
    >
      Join the waitlist
    </a>
  );
}

const NAV = [
  { href: "#explore", label: "Explore" },
  { href: "#benchmarks", label: "Benchmarks" },
  { href: "#how", label: "How it works" },
  { href: "#use-cases", label: "Use cases" },
  { href: "#quickstart", label: "Quickstart" },
  { href: "#compare", label: "Compare" },
  { href: "#pricing", label: "Plans" },
  { href: "#faq", label: "FAQ" },
];

const STEPS = [
  {
    title: "Store",
    body: "Documents, facts and the embeddings you choose go into one append-only, checksummed log on your disk, encrypted if you turn it on.",
  },
  {
    title: "Index",
    body: "BM25 postings, a vertex-graph vector index and superposed fact vectors are built in the same process. No server, no network call.",
  },
  {
    title: "Recall",
    body: "Hybrid search fuses lexical and vector scores and returns byte offsets into the source; signed provenance records who stored what, and when.",
  },
];

function Section({
  id,
  title,
  intro,
  alt = false,
  children,
}: {
  id: string;
  title: string;
  intro?: React.ReactNode;
  alt?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={`relative section-x py-16 scroll-mt-28 ${alt ? "border-y border-white/5 bg-white/[0.01]" : ""}`}
      aria-labelledby={`${id}-heading`}
    >
      <div className="max-w-5xl mx-auto">
        <h2 id={`${id}-heading`} className="section-heading text-center">
          {title}
        </h2>
        {intro && (
          <p className="text-slate-300 text-center max-w-2xl mx-auto leading-relaxed mb-10">
            {intro}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}

export function ProductPage() {
  const competitorColumns = [HMS_NAME, ...HMS_COMPETITORS];
  return (
    <main id="main-content" className="relative">
      <div className="overlay" aria-hidden="true">
        <div className="grid-overlay blueprint-grid" />
        <div className="grain-overlay paper-grain" />
      </div>

      {/* Hero */}
      <section className="hero section-x" aria-labelledby="hms-heading">
        <HmsMarkBackdrop className="hero-mark" />
        <div className="hero__main max-w-4xl mx-auto text-center">
          <h1
            id="hms-heading"
            className="hero__title font-serif font-semibold tracking-tight text-balance text-slate-100"
          >
            {HMS_NAME}
          </h1>
          <p className="hero__technical-line text-slate-100 max-w-2xl mx-auto">
            {HMS_TECHNICAL_LINE}
          </p>
          <p className="hero__line text-slate-300 max-w-2xl mx-auto">
            <span className="hero__long">{HMS_TAGLINE} {HMS_HERO_LINE}</span>
            <span className="hero__short">{HMS_HERO_LINE_SHORT}</span>
          </p>
          <InstallCommands lines={INSTALL} />
          <div className="cta-stack hero__cta">
            <a href="#quickstart" className="btn-primary select-none" data-umami-event="cta_hms_quickstart" data-umami-event-page="hms">
              Get started
            </a>
            <a
              href={HMS_LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost select-none"
              data-umami-event="cta_hms_github"
              data-umami-event-page="hms"
            >
              View on GitHub
            </a>
          </div>
        </div>
        <div className="hero__proof max-w-4xl mx-auto text-center">
          <ul className="proof-chips list-none p-0 m-0" aria-label="Measured results">
            {PROOF_CHIPS.map((c) => (
              <li key={c.label}>
                <a href={c.href} className="proof-chip" target="_blank" rel="noopener noreferrer">
                  <span className="proof-chip__value">{c.value}</span>
                  <span className="proof-chip__label">{c.label}</span>
                </a>
              </li>
            ))}
          </ul>
          <p className="text-xs text-slate-300 mt-4">
            {BENCH_HARDWARE}. <a href="#benchmarks" className="underline underline-offset-4">Method and losses</a>.
          </p>
        </div>
      </section>

      <nav className="page-nav" aria-label="On this page">
        <ul>
          {NAV.map((n) => (
            <li key={n.href}>
              <a href={n.href}>{n.label}</a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Why */}
      <section className="relative section-x pt-14 pb-4" aria-labelledby="hms-why-heading">
        <div className="max-w-5xl mx-auto">
          <h2 id="hms-why-heading" className="sr-only">Why it exists</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {WHY.map((w) => (
              <div key={w.title} className="surface surface-panel rounded-2xl">
                <h3 className="card-heading text-teal-300">{w.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed m-0">{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Section id="explore" title="From a question to its source" intro="Explore a real quickstart result, then run the same example on your machine.">
        <SearchExample />
      </Section>

      <Section id="start" title="Choose your way in" alt intro="One engine, different ways to connect. Pick the setup that matches your application.">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { title: "Editors & agents", body: "Persistent memory through MCP. Start a local process or connect to a shared server.", href: "integrations/editors/", link: "Connect your editor" },
            { title: "Rust", body: "Embed search directly in your process. Own the store and enable encryption when you need it.", href: "quickstart/", link: "Run the Rust example" },
            { title: "Python", body: "Use holographic-sdk to call your hms-server. Supply vectors from the model you choose.", href: "get-started/choose/", link: "Choose the right package" },
            { title: "Node.js", body: "Build the native module from source and call the Rust engine from JavaScript or TypeScript.", href: "get-started/install/", link: "Build the Node module" },
          ].map((path) => (
            <a key={path.title} href={`https://docs.holographic-memory.com/dev/${path.href}`} className="start-card surface surface-panel rounded-2xl">
              <h3 className="card-heading">{path.title}</h3>
              <p>{path.body}</p>
              <span>{path.link} →</span>
            </a>
          ))}
        </div>
      </Section>

      <Section
        id="benchmarks"
        title="Benchmarks"
        intro={
          <>
            Same machine, same queries, every competitor at its tuned operating point. Bars are
            single-thread queries per second; every number links to a committed results file.{" "}
            <ExternalLink href={BENCH_COMPARISON_URL}>Full comparison and method</ExternalLink>.
          </>
        }
      >
        <h3 className="card-heading">Vector search: SIFT-1M against hnswlib</h3>
        <div className="grid md:grid-cols-3 gap-4 mb-10">
          {VECTOR_GROUPS.map((g) => (
            <BenchChart key={g.id} group={g} />
          ))}
        </div>
        <h3 className="card-heading">Text search: BEIR against tantivy, Lucene and SQLite FTS5</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {TEXT_GROUPS.map((g) => (
            <BenchChart key={g.id} group={g} />
          ))}
        </div>
        <details className="mt-4 surface surface-panel rounded-2xl">
          <summary className="cursor-pointer font-semibold text-slate-100">
            Same answers: nDCG@10 on each dataset
          </summary>
          <div className="overflow-x-auto mt-3" tabIndex={0} role="region" aria-label="nDCG@10 by system, scrollable">
            <table className="w-full text-sm text-left text-slate-300">
              <thead>
                <tr>
                  <th scope="col" className="p-2">Dataset</th>
                  {TEXT_QUALITY[0].values.map((v) => (
                    <th key={v.label} scope="col" className="p-2">{v.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TEXT_QUALITY.map((q) => (
                  <tr key={q.dataset} className="border-t border-white/10">
                    <th scope="row" className="p-2 font-medium text-slate-100">{q.dataset}</th>
                    {q.values.map((v) => (
                      <td key={v.label} className="p-2">{v.text}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>

        <div className="grid md:grid-cols-2 gap-5 mt-8">
          <div className="surface surface-panel rounded-2xl">
            <h3 className="card-heading">Where we&rsquo;re not ahead yet</h3>
            <ul className="text-slate-300 text-sm leading-relaxed list-disc pl-5 m-0">
              {BENCH_LOSSES.map((l) => (
                <li key={l.what}>
                  <strong className="text-slate-100">{l.what}.</strong> {l.detail}
                </li>
              ))}
            </ul>
          </div>
          <div className="surface surface-panel rounded-2xl">
            <h3 className="card-heading">How these were measured</h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-2">
              {BENCH_HARDWARE}, under WSL2. Three serve rounds per system with bootstrap intervals;
              tested range is SIFT-1M (1,000,000 vectors) and three BEIR sets of 3,633 to 57,600
              documents, not larger. HMS is timed through its native Rust API; hnswlib through its
              Python binding, one call per query. Text runs use HMS in BM25 lexical mode.
            </p>
            <p className="text-slate-300 text-sm leading-relaxed m-0">
              Durability: {HMS_DURABILITY.summary}{" "}
              <ExternalLink href={hmsSource(HMS_DURABILITY.source)}>Source</ExternalLink>.
            </p>
          </div>
        </div>
        <details className="mt-5 surface surface-panel rounded-2xl">
          <summary className="cursor-pointer font-semibold text-slate-100">Known limits</summary>
          <ul className="mt-4 text-slate-300 text-sm leading-relaxed list-disc pl-5">
            {HMS_LIMITS.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </details>
      </Section>

      <Section id="how" title="How it works" alt intro="One engine, linked into your process.">
        <ol className="steps list-none p-0 m-0">
          {STEPS.map((s, i) => (
            <li key={s.title} className="steps__item surface surface-panel rounded-2xl">
              <span className="steps__num" aria-hidden="true">{i + 1}</span>
              <h3 className="card-heading">{s.title}</h3>
              <p className="text-slate-300 text-sm leading-relaxed m-0">{s.body}</p>
            </li>
          ))}
        </ol>
        <p className="text-slate-300 text-sm text-center max-w-2xl mx-auto mt-8 mb-0">
          The holographic part is the fact memory: bound facts are superposed into fixed-size
          vectors and recalled by similarity. Document search is conventional BM25 and cosine.
        </p>
      </Section>

      <Section id="use-cases" title="Use cases">
        <div className="grid md:grid-cols-3 gap-5">
          {HMS_USE_CASES.map((u) => (
            <div key={u.title} className="surface surface-panel rounded-2xl">
              <h3 className="card-heading text-teal-300">{u.title}</h3>
              <p className="text-slate-300 text-sm leading-relaxed m-0">{u.body}</p>
            </div>
          ))}
        </div>
        <h3 className="card-heading text-center mt-12">Integrations</h3>
        <p className="text-slate-300 text-sm text-center max-w-2xl mx-auto mb-6">
          Framework adapters live in the repository and install from source until they are
          published.
        </p>
        <ul className="grid md:grid-cols-2 gap-5 list-none p-0 m-0">
          {HMS_INTEGRATIONS.map((g) => (
            <li key={g.name} className="surface surface-panel rounded-2xl">
              <h4 className="font-semibold text-slate-100 mb-2">
                <ExternalLink href={g.href}>{g.name}</ExternalLink>
              </h4>
              <p className="text-slate-300 text-sm leading-relaxed m-0">{g.detail}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="quickstart"
        title="Quickstart"
        alt
        intro={
          <>
            Store a document and find it again. The{" "}
            <ExternalLink href={HMS_LINKS.quickstart}>complete quickstart</ExternalLink> adds
            encryption and filters.
          </>
        }
      >
        <div className="max-w-3xl mx-auto">
          <CodeTabs
            label="Quickstart language"
            tabs={[
              {
                id: "rust",
                label: "Rust",
                panel: (
                  <div className="grid gap-4">
                    <CodeBlock label="shell: install" code={RUST_SNIPPET} />
                    <CodeBlock label="src/main.rs" code={RUST_CODE} />
                  </div>
                ),
              },
              {
                id: "python",
                label: "Python",
                panel: (
                  <div className="grid gap-4">
                    <p className="text-slate-300 text-sm leading-relaxed m-0">
                      Python talks to <code className="mono">hms-server</code> over HTTP through{" "}
                      <ExternalLink href={HMS_LINKS.pypiSdk}>holographic-sdk</ExternalLink>. Embed
                      your text with any model and send the vectors.
                    </p>
                    <CodeBlock label="shell: server and SDK" code={PY_SHELL} />
                    <CodeBlock label="quickstart.py" code={PY_CODE} />
                  </div>
                ),
              },
              {
                id: "mcp",
                label: "MCP",
                panel: (
                  <div className="grid gap-4">
                    <p className="text-slate-300 text-sm leading-relaxed m-0">Build the local MCP server, then configure your editor to launch the absolute path to the binary. The editor owns the stdio process.</p>
                    <CodeBlock label="shell: build MCP" code={`git clone https://github.com/writerslogic/holographic-memory
cd holographic-memory
cargo build --release --features mcp,security --bin hms-mcp`} />
                    <ExternalLink href="https://docs.holographic-memory.com/dev/integrations/editors/">Editor configuration and shared HTTP setup</ExternalLink>
                  </div>
                ),
              },
              {
                id: "node",
                label: "Node.js",
                panel: (
                  <div className="grid gap-4">
                    <p className="text-slate-300 text-sm leading-relaxed m-0">Build with Rust and Node 24 or newer, then run the complete ingest-and-search example.</p>
                    <CodeBlock label="shell: Node quickstart" code={`git clone https://github.com/writerslogic/holographic-memory
cd holographic-memory
npm ci --omit=optional
npm run build
node examples/quickstart/node/quickstart.mjs`} />
                  </div>
                ),
              },
            ]}
          />
          <p className="text-slate-300 text-sm leading-relaxed mt-6 mb-0">
            Node.js: build the native module from the repository (the npm package is deprecated).
            Go, Java and .NET: the C ABI bindings in{" "}
            <ExternalLink href={`${HMS_LINKS.github}/tree/main/bindings`}>bindings/</ExternalLink>.
          </p>
          <p className="text-slate-300 text-sm mt-4"><ExternalLink href="https://docs.holographic-memory.com/dev/get-started/troubleshooting/">Troubleshoot imports, authentication, dimensions and locked stores</ExternalLink>.</p>
        </div>
      </Section>

      <Section
        id="compare"
        title="Compare"
        intro={`How Mem0, Zep, Chroma and Qdrant document the same properties, checked ${HMS_COMPETITOR_CHECKED}.`}
      >
        <CompareMatrix
          label="Comparison with Mem0, Zep, Chroma and Qdrant"
          columns={competitorColumns}
          rows={HMS_COMPETITOR_ROWS.map((r) => ({
            property: r.property,
            cells: [r.hms, ...HMS_COMPETITORS.map((c) => r.others[c])].map((note, i) => ({
              mark: r.marks[i],
              note,
            })),
          }))}
        />
        <p className="text-xs text-slate-300 mt-4 leading-relaxed">
          {MATRIX_LEGEND.map((l) => `${l.glyph} ${l.word}`).join(" · ")}. Hover or use a screen
          reader for each vendor&rsquo;s wording. Sources:{" "}
          {HMS_COMPETITOR_SOURCES.map((s, i) => (
            <span key={s.href}>
              {i > 0 && ", "}
              <ExternalLink href={s.href}>{s.label}</ExternalLink>
            </span>
          ))}
          .
        </p>
      </Section>

      <Section id="pricing" title="Open source and plans" alt intro={HMS_LOCAL_FIRST_NOTE}>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 list-none p-0 m-0">
          {HMS_TIERS.map((t) => (
            <li
              key={t.plan}
              className={`surface surface-panel rounded-2xl flex flex-col ${t.plan === "community" ? "border-teal-400/40" : ""}`}
            >
              <h3 className="card-heading mb-1">{t.name}</h3>
              <p className="text-xs text-teal-300 font-mono mb-3">{t.status}</p>
              <p className="text-2xl font-semibold text-slate-100 mb-2">{t.price}</p>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">{t.summary}</p>
              <ul className="text-slate-300 text-sm leading-relaxed list-disc pl-5 mb-6 flex-grow">
                {t.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <TierCta tier={t} />
            </li>
          ))}
        </ul>
        <details className="mt-6 surface surface-panel rounded-2xl">
          <summary className="cursor-pointer font-semibold text-slate-100">
            What {HMS_CLOUD_NAME} adds to the open-source engine
          </summary>
          <div className="overflow-x-auto mt-3" tabIndex={0} role="region" aria-label="Open source and Cloud, scrollable">
            <table className="w-full min-w-[520px] text-sm text-left text-slate-300">
              <thead>
                <tr>
                  <th scope="col" className="p-2">Feature</th>
                  <th scope="col" className="p-2">Open source</th>
                  <th scope="col" className="p-2">Cloud (in development)</th>
                </tr>
              </thead>
              <tbody>
                {HMS_OSS_VS_CLOUD.map((r) => (
                  <tr key={r.feature} className="border-t border-white/10 align-top">
                    <th scope="row" className="p-2 font-medium text-slate-100">{r.feature}</th>
                    <td className="p-2">{r.oss}</td>
                    <td className="p-2">{r.cloud}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
        <p className="text-xs text-slate-300 mt-4 text-center">{HMS_LICENSE_NOTE}</p>
      </Section>

      <Section id="faq" title="Questions">
        <div className="grid gap-3 max-w-3xl mx-auto">
          {HMS_FAQ.map((f) => (
            <details key={f.q} className="surface surface-panel rounded-2xl">
              <summary className="cursor-pointer font-semibold text-slate-100">{f.q}</summary>
              <p className="mt-3 mb-0 text-slate-300 text-sm leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </Section>

      {/* Provenance platform */}
      <section className="relative section-x py-10 border-y border-white/5 bg-white/[0.01]" aria-labelledby="platform-heading">
        <div className="max-w-4xl mx-auto text-center">
          <h2 id="platform-heading" className="card-heading">
            Part of the <ExternalLink href={HMS_COMPANY_URL}>WritersLogic</ExternalLink> provenance platform
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-4">{HMS_PLATFORM.intro}</p>
          <ul className="flex flex-wrap justify-center gap-x-8 gap-y-2 list-none p-0 m-0 text-sm text-slate-300">
            {HMS_PLATFORM.links.map((l) => (
              <li key={l.name}>
                {l.href ? (
                  <ExternalLink href={l.href} className="font-semibold text-slate-100">{l.name}</ExternalLink>
                ) : (
                  <span className="font-semibold text-slate-100">{l.name}</span>
                )}
                : {l.detail}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Links */}
      <section className="relative section-x py-12" aria-label="Project links">
        <div className="max-w-3xl mx-auto text-center">
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-slate-300 list-none p-0 mb-6">
            <li><ExternalLink href={HMS_LINKS.github}>GitHub</ExternalLink></li>
            <li><ExternalLink href={HMS_LINKS.docs}>Documentation</ExternalLink></li>
            <li><ExternalLink href={HMS_LINKS.crates}>crates.io</ExternalLink></li>
            <li><ExternalLink href={HMS_LINKS.docsRs}>docs.rs</ExternalLink></li>
            <li><ExternalLink href={HMS_LINKS.pypiSdk}>PyPI (holographic-sdk)</ExternalLink></li>
            <li><ExternalLink href={HMS_LINKS.server}>Server docs</ExternalLink></li>
          </ul>
          <p className="text-xs text-slate-300 m-0">{HMS_FULL_NAME} is made by WritersLogic, Inc.</p>
        </div>
      </section>
    </main>
  );
}
