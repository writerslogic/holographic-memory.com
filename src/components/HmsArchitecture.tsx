// Architecture of the Holographic Memory engine, after the README diagram in
// github.com/writerslogic/holographic-memory. Portrait layout so it stays legible
// at 320px; colors come from theme utilities.

const MODULES = [
  {
    title: "Documents",
    body: "Chunking, stemmed BM25, exact cosine, filters",
  },
  {
    title: "Vector-symbolic layer",
    body: "Bind, bundle, permute; fact memory, Hopfield cleanup",
  },
  {
    title: "Optional ANN indexes",
    body: "NSG graph, IVF, sparse inverted index",
  },
  {
    title: "Provenance (optional)",
    body: "Signed audit log; COSE, SCITT and C2PA statements",
  },
];

const W = 360;
const MOD_Y = 176;
const MOD_H = 52;
const MOD_GAP = 10;
const CORE_BOTTOM = MOD_Y + MODULES.length * (MOD_H + MOD_GAP) + 4;
const STORE_Y = CORE_BOTTOM + 34;
const H = STORE_Y + 84;

function Arrow({ y1, y2 }: { y1: number; y2: number }) {
  return (
    <g className="stroke-slate-400 fill-slate-400">
      <line x1={W / 2} y1={y1} x2={W / 2} y2={y2 - 7} strokeWidth={1.5} />
      <path d={`M${W / 2 - 5} ${y2 - 8} L${W / 2} ${y2} L${W / 2 + 5} ${y2 - 8} Z`} stroke="none" />
    </g>
  );
}

export function HmsArchitecture() {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-labelledby="hms-arch-title hms-arch-desc"
      className="w-full h-auto"
      style={{ fontFamily: "var(--font-ui)" }}
    >
      <title id="hms-arch-title">Holographic Memory architecture</title>
      <desc id="hms-arch-desc">
        Applications in Rust, Node.js, Python, Go, Java or .NET, or any HTTP
        client through hms-server, call the HmsCore engine inside their own
        process. The engine contains document search, a vector-symbolic fact
        layer, optional approximate-nearest-neighbour indexes and optional
        provenance signing. Everything persists to an append-only log on local
        disk with CRC32 checks, LZ4 compression, memory mapping and optional
        AES-256-GCM encryption.
      </desc>

      {/* Applications */}
      <rect x={8} y={8} width={W - 16} height={82} rx={12} className="fill-slate-800/40 stroke-slate-500" strokeWidth={1} />
      <text x={W / 2} y={32} textAnchor="middle" className="fill-slate-100" fontSize={14} fontWeight={600}>
        Your application
      </text>
      <text x={W / 2} y={54} textAnchor="middle" className="fill-slate-300" fontSize={12}>
        Rust · Node.js · Python SDK
      </text>
      <text x={W / 2} y={72} textAnchor="middle" className="fill-slate-300" fontSize={12}>
        Go · Java · .NET (C ABI) · hms-server HTTP
      </text>

      <Arrow y1={92} y2={120} />

      {/* Engine */}
      <rect x={8} y={122} width={W - 16} height={CORE_BOTTOM - 122} rx={14} className="fill-teal-400/5 stroke-teal-400" strokeWidth={1.5} />
      <text x={W / 2} y={146} textAnchor="middle" className="fill-slate-100" fontSize={14} fontWeight={600}>
        HmsCore engine
      </text>
      <text x={W / 2} y={164} textAnchor="middle" className="fill-slate-300" fontSize={11.5}>
        in your process · no network calls · no telemetry
      </text>
      {MODULES.map((m, i) => {
        const y = MOD_Y + i * (MOD_H + MOD_GAP);
        return (
          <g key={m.title}>
            <rect x={22} y={y} width={W - 44} height={MOD_H} rx={9} className="fill-slate-900/50 stroke-teal-400/50" strokeWidth={1} />
            <text x={36} y={y + 21} className="fill-teal-300" fontSize={13} fontWeight={600}>
              {m.title}
            </text>
            <text x={36} y={y + 39} className="fill-slate-300" fontSize={11.5}>
              {m.body}
            </text>
          </g>
        );
      })}

      <Arrow y1={CORE_BOTTOM + 2} y2={STORE_Y - 2} />

      {/* Storage */}
      <rect x={8} y={STORE_Y} width={W - 16} height={76} rx={12} className="fill-gold-400/5 stroke-gold-400/70" strokeWidth={1.5} />
      <text x={W / 2} y={STORE_Y + 24} textAnchor="middle" className="fill-slate-100" fontSize={14} fontWeight={600}>
        Append-only log on your disk
      </text>
      <text x={W / 2} y={STORE_Y + 44} textAnchor="middle" className="fill-slate-300" fontSize={12}>
        CRC32 frames · LZ4 · memory-mapped
      </text>
      <text x={W / 2} y={STORE_Y + 62} textAnchor="middle" className="fill-slate-300" fontSize={12}>
        optional AES-256-GCM, Argon2id-derived key
      </text>
    </svg>
  );
}
