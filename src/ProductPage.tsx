import { HmsMark } from "./components/HmsMark";
import { HmsArchitecture } from "./components/HmsArchitecture";
import {
  HMS_BENCHMARKS,
  HMS_CAPABILITIES,
  HMS_CLOUD_NAME,
  HMS_COMPETITOR_CHECKED,
  HMS_COMPETITOR_ROWS,
  HMS_COMPETITOR_SOURCES,
  HMS_COMPETITORS,
  HMS_DURABILITY,
  HMS_FAQ,
  HMS_FULL_NAME,
  HMS_IN_PROGRESS,
  HMS_LICENSE_NOTE,
  HMS_LIMITS,
  HMS_LINKS,
  HMS_NAME,
  HMS_OSS_VS_CLOUD,
  HMS_ONE_LINER,
  HMS_TAGLINE,
  HMS_TIERS,
  hmsCheckoutUrl,
  hmsSource,
  hmsWaitlistUrl,
  type HmsTier,
} from "./content/hms";
import { HMS_CHECKOUT_ENABLED } from "./content/flags";

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

const PY_SHELL = `# hms-server stores vectors you supply; the SDK is its HTTP client
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
    title: "Deletion that erases",
    body: "Delete removes a record from every query at once and zeroes its stored text. Purge rewrites the journal and overwrites the old generation before it returns.",
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
        className="rounded-xl bg-slate-950/60 border border-white/10 p-4 overflow-x-auto"
        tabIndex={0}
        role="region"
        aria-label={`${label} code, scrollable`}
      >
        <pre className="text-sm leading-relaxed text-slate-100 font-mono m-0">
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

export function ProductPage() {
  return (
    <main id="main-content" className="relative">
      <div className="overlay" aria-hidden="true">
        <div className="grid-overlay blueprint-grid" />
        <div className="grain-overlay paper-grain" />
      </div>

      {/* Hero */}
      <section
        className="relative pt-24 pb-16 section-x"
        aria-labelledby="hms-heading"
      >
        <div className="max-w-4xl mx-auto text-center">
          <HmsMark className="h-20 sm:h-24 mx-auto mb-8 text-slate-100" />
          <p className="text-teal-400 text-xs font-semibold tracking-widest uppercase mb-4">
            {HMS_FULL_NAME}
          </p>
          <h1
            id="hms-heading"
            className="font-serif text-4xl sm:text-5xl font-semibold leading-tight tracking-tight mb-6 text-balance text-slate-100"
          >
            {HMS_TAGLINE}
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
            {HMS_ONE_LINER}
          </p>
          <div className="cta-stack mb-5">
            <a
              href="#quickstart"
              className="btn-primary select-none"
              data-umami-event="cta_hms_quickstart"
              data-umami-event-page="hms"
            >
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
          <p className="text-sm text-slate-300">
            Open source.{" "}
            <a
              href="#pricing"
              className="underline underline-offset-4 decoration-teal-400/50 hover:text-teal-300"
            >
              {HMS_CLOUD_NAME}
            </a>{" "}
            is in development.
          </p>
        </div>
      </section>

      {/* Why */}
      <section
        className="relative section-x pb-20"
        aria-labelledby="hms-why-heading"
      >
        <div className="max-w-5xl mx-auto">
          <h2 id="hms-why-heading" className="section-heading text-center">
            Why it exists
          </h2>
          <p className="text-slate-300 text-center max-w-2xl mx-auto leading-relaxed mb-10">
            Agent memory is mostly sold as a hosted API or a database server you
            run and secure yourself. {HMS_NAME} puts the memory inside your
            application, with encryption, provenance and erasure in the
            open-source engine.
          </p>
          <div className="grid sm:grid-cols-2 gap-5">
            {WHY.map((w) => (
              <div key={w.title} className="surface surface-panel rounded-2xl">
                <h3 className="card-heading text-teal-300">{w.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed m-0">
                  {w.body}
                </p>
              </div>
            ))}
          </div>

          <h3 className="card-heading text-center mt-14">
            How the alternatives document it
          </h3>
          <div
            className="overflow-x-auto rounded-2xl border border-white/10 mt-4"
            tabIndex={0}
            role="region"
            aria-label="Comparison with Mem0, Zep, Chroma and Qdrant, scrollable"
          >
            <table className="w-full min-w-[760px] text-sm text-left">
              <thead className="bg-white/[0.03] text-slate-100">
                <tr>
                  <th scope="col" className="p-4 font-semibold">Property</th>
                  <th scope="col" className="p-4 font-semibold text-teal-300">{HMS_NAME}</th>
                  {HMS_COMPETITORS.map((c) => (
                    <th key={c} scope="col" className="p-4 font-semibold">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-slate-300">
                {HMS_COMPETITOR_ROWS.map((r) => (
                  <tr key={r.property} className="border-t border-white/10 align-top">
                    <th scope="row" className="p-4 font-medium text-slate-100">{r.property}</th>
                    <td className="p-4 text-slate-100">{r.hms}</td>
                    {HMS_COMPETITORS.map((c) => (
                      <td key={c} className="p-4">{r.others[c]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-300 mt-4 leading-relaxed">
            From each vendor&rsquo;s own documentation, checked{" "}
            {HMS_COMPETITOR_CHECKED}. &ldquo;Not documented&rdquo; means we
            found no page saying so. Sources:{" "}
            {HMS_COMPETITOR_SOURCES.map((s, i) => (
              <span key={s.href}>
                {i > 0 && ", "}
                <ExternalLink href={s.href}>{s.label}</ExternalLink>
              </span>
            ))}
            .
          </p>
        </div>
      </section>

      {/* What ships */}
      <section
        className="relative section-x py-16 border-y border-white/5 bg-white/[0.01]"
        aria-labelledby="hms-ships-heading"
      >
        <div className="max-w-5xl mx-auto">
          <h2 id="hms-ships-heading" className="section-heading text-center">
            What ships today
          </h2>
          <p className="text-slate-300 text-center max-w-2xl mx-auto mb-10">
            From the{" "}
            <ExternalLink href={`${HMS_LINKS.github}#what-ships-today`}>
              capability table in the repository
            </ExternalLink>
            .
          </p>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 list-none p-0 m-0">
            {HMS_CAPABILITIES.map((c) => (
              <li key={c.title} className="surface surface-panel rounded-2xl">
                <p className="text-xs text-teal-300 font-mono mb-2">
                  {c.status}
                </p>
                <h3 className="card-heading">{c.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed m-0">
                  {c.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Quickstart */}
      <section
        id="quickstart"
        className="relative section-x py-20 scroll-mt-24"
        aria-labelledby="hms-quickstart-heading"
      >
        <div className="max-w-3xl mx-auto">
          <h2 id="hms-quickstart-heading" className="section-heading text-center">
            Quickstart
          </h2>
          <p className="text-slate-300 text-center max-w-2xl mx-auto mb-10">
            Store a document and find it again, in Rust or Python. The{" "}
            <ExternalLink href={HMS_LINKS.quickstart}>
              five-minute quickstart
            </ExternalLink>{" "}
            adds encryption, filters and Node.js.
          </p>

          <h3 className="card-heading">Rust</h3>
          <div className="grid gap-4 mb-10">
            <CodeBlock label="shell: install" code={RUST_SNIPPET} />
            <CodeBlock label="src/main.rs" code={RUST_CODE} />
          </div>

          <h3 className="card-heading">Python</h3>
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            Python talks to <code className="mono">hms-server</code> over HTTP
            through{" "}
            <ExternalLink href={HMS_LINKS.pypiSdk}>holographic-sdk</ExternalLink>
            . Embed your text with any model and send the vectors.
          </p>
          <div className="grid gap-4 mb-8">
            <CodeBlock label="shell: server and SDK" code={PY_SHELL} />
            <CodeBlock label="quickstart.py" code={PY_CODE} />
          </div>

          <p className="text-slate-300 text-sm leading-relaxed">
            Node.js: build the native module from the repository (the npm
            package is deprecated). Go, Java and .NET: use the C ABI bindings in{" "}
            <ExternalLink href={`${HMS_LINKS.github}/tree/main/bindings`}>
              bindings/
            </ExternalLink>
            .
          </p>
        </div>
      </section>

      {/* Architecture */}
      <section
        className="relative section-x py-16 border-y border-white/5 bg-white/[0.01]"
        aria-labelledby="hms-arch-heading"
      >
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 id="hms-arch-heading" className="section-heading">
              How it fits together
            </h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              One engine, linked into your process. Document search is
              conventional: stemmed BM25 fused with exact cosine over the
              embeddings you supply. The holographic part is the fact memory,
              where bound facts are superposed into fixed-size vectors and
              recalled by similarity.
            </p>
            <p className="text-slate-300 leading-relaxed m-0">
              Everything lands in one append-only log with checksummed frames,
              so a crash leaves the last committed state, and turning on
              encryption makes the files ciphertext.
            </p>
          </div>
          <div className="max-w-md w-full mx-auto">
            <HmsArchitecture />
          </div>
        </div>
      </section>

      {/* Benchmarks */}
      <section
        id="benchmarks"
        className="relative section-x py-20 scroll-mt-24"
        aria-labelledby="hms-bench-heading"
      >
        <div className="max-w-5xl mx-auto">
          <h2 id="hms-bench-heading" className="section-heading text-center">
            Benchmarks
          </h2>
          <p className="text-slate-300 text-center max-w-2xl mx-auto mb-10">
            Every number below comes from a results file committed to the
            repository, including the one where {HMS_NAME} loses. They are
            single runs on the stated hardware, not a substitute for testing
            your data.
          </p>
          <div
            className="overflow-x-auto rounded-2xl border border-white/10"
            tabIndex={0}
            role="region"
            aria-label="Benchmark results, scrollable"
          >
            <table className="w-full min-w-[640px] text-sm text-left">
              <thead className="bg-white/[0.03] text-slate-100">
                <tr>
                  <th scope="col" className="p-4 font-semibold">Measure</th>
                  <th scope="col" className="p-4 font-semibold">{HMS_NAME}</th>
                  <th scope="col" className="p-4 font-semibold">Reference</th>
                  <th scope="col" className="p-4 font-semibold">Source</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                {HMS_BENCHMARKS.map((b) => (
                  <tr key={b.label} className="border-t border-white/10 align-top">
                    <th scope="row" className="p-4 font-medium text-slate-100">
                      {b.label}
                      <span className="block mt-1 text-xs font-normal text-slate-300">
                        {b.note}
                      </span>
                    </th>
                    <td className="p-4">
                      <span className={b.outcome === "ahead" ? "text-teal-300 font-semibold" : "text-slate-100 font-semibold"}>
                        {b.hms}
                      </span>
                      {b.outcome === "behind" && (
                        <span className="block text-xs mt-1">Behind</span>
                      )}
                    </td>
                    <td className="p-4">{b.reference}</td>
                    <td className="p-4">
                      <ExternalLink href={hmsSource(b.source)} className="font-mono text-xs break-all">
                        {b.source.split("/").pop()}
                      </ExternalLink>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid md:grid-cols-2 gap-5 mt-8">
            <div className="surface surface-panel rounded-2xl">
              <h3 className="card-heading">Crash and corruption testing</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-2">
                {HMS_DURABILITY.summary}
              </p>
              <p className="text-xs text-slate-300 m-0">
                {HMS_DURABILITY.note} Source:{" "}
                <ExternalLink href={hmsSource(HMS_DURABILITY.source)} className="font-mono">
                  {HMS_DURABILITY.source.split("/").pop()}
                </ExternalLink>
              </p>
            </div>
            <div className="surface surface-panel rounded-2xl">
              <h3 className="card-heading">Benchmarks in progress</h3>
              <ul className="text-slate-300 text-sm leading-relaxed list-disc pl-5 m-0">
                {HMS_IN_PROGRESS.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          </div>

          <details className="mt-8 surface surface-panel rounded-2xl">
            <summary className="cursor-pointer font-semibold text-slate-100">
              Known limits
            </summary>
            <ul className="mt-4 text-slate-300 text-sm leading-relaxed list-disc pl-5">
              {HMS_LIMITS.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
            <p className="text-xs text-slate-300 m-0">
              Full statement:{" "}
              <ExternalLink href={HMS_LINKS.privacy}>docs/PRIVACY.md</ExternalLink>
            </p>
          </details>
        </div>
      </section>

      {/* Open source vs Cloud */}
      <section
        className="relative section-x py-16 border-y border-white/5 bg-white/[0.01]"
        aria-labelledby="hms-oss-heading"
      >
        <div className="max-w-5xl mx-auto">
          <h2 id="hms-oss-heading" className="section-heading text-center">
            Open source and Cloud
          </h2>
          <p className="text-slate-300 text-center max-w-2xl mx-auto mb-10">
            The engine stays open. {HMS_CLOUD_NAME} adds what a team would
            otherwise operate itself. Cloud features are planned and not yet
            available.
          </p>
          <div
            className="overflow-x-auto rounded-2xl border border-white/10"
            tabIndex={0}
            role="region"
            aria-label="Open source and Cloud comparison, scrollable"
          >
            <table className="w-full min-w-[560px] text-sm text-left">
              <thead className="bg-white/[0.03] text-slate-100">
                <tr>
                  <th scope="col" className="p-4 font-semibold">Feature</th>
                  <th scope="col" className="p-4 font-semibold">Open source</th>
                  <th scope="col" className="p-4 font-semibold">Cloud (planned)</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                {HMS_OSS_VS_CLOUD.map((r) => (
                  <tr key={r.feature} className="border-t border-white/10 align-top">
                    <th scope="row" className="p-4 font-medium text-slate-100">
                      {r.feature}
                    </th>
                    <td className="p-4">{r.oss}</td>
                    <td className="p-4">{r.cloud}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-300 mt-4 text-center">
            {HMS_LICENSE_NOTE}
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section
        id="pricing"
        className="relative section-x py-20 scroll-mt-24"
        aria-labelledby="hms-pricing-heading"
      >
        <div className="max-w-6xl mx-auto">
          <h2 id="hms-pricing-heading" className="section-heading text-center">
            Plans
          </h2>
          <p className="text-slate-300 text-center max-w-2xl mx-auto mb-10">
            Community is free and available now. Paid plans are in development;
            prices are published at launch.
          </p>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 list-none p-0 m-0">
            {HMS_TIERS.map((t) => (
              <li
                key={t.plan}
                className={`surface surface-panel rounded-2xl flex flex-col ${t.plan === "community" ? "border-teal-400/40" : ""}`}
              >
                <h3 className="card-heading mb-1">{t.name}</h3>
                <p className="text-xs text-teal-300 font-mono mb-3">{t.status}</p>
                <p className="text-2xl font-semibold text-slate-100 mb-2">
                  {t.price}
                </p>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  {t.summary}
                </p>
                <ul className="text-slate-300 text-sm leading-relaxed list-disc pl-5 mb-6 flex-grow">
                  {t.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <TierCta tier={t} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section
        id="faq"
        className="relative section-x py-16 border-t border-white/5 scroll-mt-24"
        aria-labelledby="hms-faq-heading"
      >
        <div className="max-w-3xl mx-auto">
          <h2 id="hms-faq-heading" className="section-heading text-center">
            Questions
          </h2>
          <div className="grid gap-3 mt-8">
            {HMS_FAQ.map((f) => (
              <details key={f.q} className="surface surface-panel rounded-2xl">
                <summary className="cursor-pointer font-semibold text-slate-100">
                  {f.q}
                </summary>
                <p className="mt-3 mb-0 text-slate-300 text-sm leading-relaxed">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Links */}
      <section className="relative section-x pb-20" aria-label="Project links">
        <div className="max-w-3xl mx-auto text-center">
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-slate-300 list-none p-0 mb-6">
            <li><ExternalLink href={HMS_LINKS.github}>GitHub</ExternalLink></li>
            <li><ExternalLink href={HMS_LINKS.docs}>Documentation</ExternalLink></li>
            <li><ExternalLink href={HMS_LINKS.crates}>crates.io</ExternalLink></li>
            <li><ExternalLink href={HMS_LINKS.docsRs}>docs.rs</ExternalLink></li>
            <li><ExternalLink href={HMS_LINKS.pypiSdk}>PyPI (holographic-sdk)</ExternalLink></li>
            <li><ExternalLink href={HMS_LINKS.server}>Server docs</ExternalLink></li>
          </ul>
          <p className="text-xs text-slate-300 m-0">
            {HMS_FULL_NAME} is made by WritersLogic, Inc.
          </p>
        </div>
      </section>
    </main>
  );
}
