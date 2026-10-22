// Competitive benchmark figures for the product page. Every number comes from
// data/bench-cells.json, a snapshot of docs/benchmarks/comparison.cells.json in
// the HMS repo at BENCH_SOURCE_SHA, filtered to the Intel Core Ultra 9 185H runs.
// Pinned to the head of writerslogic/holographic-memory PR #158; repin to its
// squash commit on main after merge. Refresh: copy the cells file from a newer
// HMS commit and update the SHA.
import cells from "./data/bench-cells.json";

export const BENCH_SOURCE_SHA = "a860cab2324ee1b07a14ddcd3ff67352b139f1f8";
export const BENCH_REPO = "https://github.com/writerslogic/holographic-memory";
export const benchSource = (path: string): string =>
  `${BENCH_REPO}/blob/${BENCH_SOURCE_SHA}/${path}`;

export const BENCH_COMPARISON_URL = benchSource("docs/benchmarks/COMPARISON.md");
export const BENCH_HARDWARE =
  "Intel Core Ultra 9 185H (22 threads, 27 GB), Linux x86_64, measured 2026-10-21";

interface Cell {
  section: string;
  file: string;
  metric: string;
  system: string | null;
  value: number | null;
  text: string;
}

const CELLS = cells as Cell[];

export const SYSTEM_NAMES: Record<string, string> = {
  hms: "Holographic Memory",
  hnswlib: "hnswlib",
  tantivy: "tantivy",
  lucene: "Apache Lucene",
  "sqlite-fts5": "SQLite FTS5",
};

function sectionCells(prefix: string): Cell[] {
  const found = CELLS.filter((c) => c.section.startsWith(prefix));
  if (found.length === 0) throw new Error(`no benchmark cells for ${prefix}`);
  return found;
}

function cell(prefix: string, metric: string, system: string | null): Cell {
  const c = sectionCells(prefix).find((x) => x.metric === metric && x.system === system);
  if (!c || (system !== null && c.value === null)) {
    throw new Error(`missing benchmark cell ${prefix} ${metric} ${String(system)}`);
  }
  return c;
}

export interface BarRow {
  system: string;
  label: string;
  value: number;
  text: string;
  hms: boolean;
}

export interface BarGroup {
  id: string;
  title: string;
  subtitle: string;
  unit: string;
  rows: BarRow[];
  factor: string; // HMS advantage over the best other system, from the cells file
  source: string;
}

function group(prefix: string, metric: string, systems: string[], meta: Omit<BarGroup, "rows" | "factor" | "source">): BarGroup {
  const rows = systems
    .map((s) => {
      const c = cell(prefix, metric, s);
      return { system: s, label: SYSTEM_NAMES[s] ?? s, value: c.value as number, text: c.text, hms: s === "hms" };
    })
    .sort((a, b) => b.value - a.value);
  return {
    ...meta,
    rows,
    factor: cell(prefix, metric, null).text,
    source: benchSource(cell(prefix, metric, "hms").file),
  };
}

const SIFT = "sift-128-euclidean";
const TEXT_SYSTEMS = ["hms", "tantivy", "lucene", "sqlite-fts5"];

export const VECTOR_GROUPS: BarGroup[] = ["0.90", "0.95", "0.99"].map((r) =>
  group(SIFT, `qps@recall${r}`, ["hms", "hnswlib"], {
    id: `sift-${r.replace(".", "")}`,
    title: `SIFT-1M, recall@10 ${r}`,
    subtitle: "1,000,000 vectors, 10,000 queries",
    unit: "queries per second",
  }),
);

const TEXT_SETS: [string, string, string][] = [
  ["beir:scifact", "BEIR SciFact", "5,183 documents, 809 queries"],
  ["beir:nfcorpus", "BEIR NFCorpus", "3,633 documents, 324 queries"],
  ["beir:fiqa", "BEIR FiQA", "57,600 documents, 500 queries"],
];

export const TEXT_GROUPS: BarGroup[] = TEXT_SETS.map(([prefix, title, subtitle]) =>
  group(prefix, "qps", TEXT_SYSTEMS, {
    id: prefix.replace("beir:", "text-"),
    title,
    subtitle,
    unit: "queries per second, one thread",
  }),
);

export interface QualityRow {
  dataset: string;
  values: { label: string; text: string }[];
}

export const TEXT_QUALITY: QualityRow[] = TEXT_SETS.map(([prefix, title]) => ({
  dataset: title,
  values: TEXT_SYSTEMS.map((s) => ({ label: SYSTEM_NAMES[s], text: cell(prefix, "ndcg@10", s).text })),
}));

const vec95 = VECTOR_GROUPS[1];
const vecFactors = VECTOR_GROUPS.map((g) => g.factor);
const textFactors = TEXT_GROUPS.map((g) => g.factor);
const range = (xs: string[]): string => {
  const n = xs.map((x) => parseFloat(x)).sort((a, b) => a - b);
  return `${n[0].toFixed(2)}-${n[n.length - 1].toFixed(2)}x`;
};
const textP50 = TEXT_SETS.map(([p]) => cell(p, "p50_latency", "hms").value as number);

export const PROOF_CHIPS = [
  {
    value: range(vecFactors),
    label: "hnswlib throughput on SIFT-1M at recall 0.90-0.99",
    href: vec95.source,
  },
  {
    value: range(textFactors),
    label: "tantivy throughput on three BEIR datasets, same nDCG@10",
    href: TEXT_GROUPS[0].source,
  },
  {
    value: `${Math.round(Math.min(...textP50))}-${Math.round(Math.max(...textP50))} µs`,
    label: "median text query latency on BEIR",
    href: TEXT_GROUPS[2].source,
  },
];

export interface Loss {
  what: string;
  detail: string;
}

const loss = (prefix: string, metric: string, other: string): string =>
  `${cell(prefix, metric, "hms").text} vs ${SYSTEM_NAMES[other]} ${cell(prefix, metric, other).text}`;

export const BENCH_LOSSES: Loss[] = [
  {
    what: "Vector index build",
    detail: `SIFT-1M build takes ${loss(SIFT, "build_seconds", "hnswlib")} seconds, with peak build memory ${loss(SIFT, "build_peak_rss_mib", "hnswlib")} MiB.`,
  },
  {
    what: "Vector serving memory",
    detail: `Resident memory while serving SIFT-1M is ${loss(SIFT, "serving_rss_mib", "hnswlib")} MiB.`,
  },
  {
    what: "Text cold start",
    detail: `The store is read into memory at open: first answer on FiQA after ${loss("beir:fiqa", "cold_start_s", "tantivy")} seconds.`,
  },
  {
    what: "Text ingest and disk",
    detail: `Indexing FiQA takes ${loss("beir:fiqa", "build_seconds", "sqlite-fts5")} seconds; the index is larger on disk than Lucene's (${loss("beir:fiqa", "disk_mib", "lucene")} MiB).`,
  },
];
