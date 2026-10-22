import type { BarGroup } from "../content/benchmarks";

// Horizontal bar chart rendered to static SVG at prerender time. Colours come
// from classes in components.css (no inline styles, CSP-safe, theme-aware).
// The viewBox fixes the aspect ratio so the chart never shifts layout.
// Sized for a ~320 px column so 13 px labels render near 1:1 on phones and in
// the three-up desktop grid.
const W = 320;
const LABEL_W = 128;
const VALUE_W = 52;
const BAR_H = 20;
const GAP = 8;

export function BenchChart({ group }: { group: BarGroup }) {
  const max = Math.max(...group.rows.map((r) => r.value));
  const plot = W - LABEL_W - VALUE_W;
  const h = group.rows.length * (BAR_H + GAP) - GAP;
  const titleId = `${group.id}-title`;
  const descId = `${group.id}-desc`;
  const desc = group.rows.map((r) => `${r.label} ${r.text}`).join(", ");
  return (
    <figure className="bench-chart">
      <figcaption className="bench-chart__caption">
        <span className="bench-chart__title">{group.title}</span>
        <span className="bench-chart__meta">
          {group.subtitle}. Bars: {group.unit}.
        </span>
        <span className="bench-chart__factor">
          {group.factor} {group.rows.find((r) => !r.hms)?.label}
        </span>
      </figcaption>
      <svg
        viewBox={`0 0 ${W} ${h}`}
        className="bench-chart__svg"
        role="img"
        aria-labelledby={`${titleId} ${descId}`}
      >
        <title id={titleId}>{`${group.title}, ${group.unit}`}</title>
        <desc id={descId}>{desc}</desc>
        {group.rows.map((r, i) => {
          const y = i * (BAR_H + GAP);
          const w = Math.max(2, (r.value / max) * plot);
          return (
            <g key={r.system} className={r.hms ? "bench-bar bench-bar--hms" : "bench-bar"}>
              <text x={LABEL_W - 8} y={y + BAR_H / 2} className="bench-bar__label" textAnchor="end" dominantBaseline="central">
                {r.label}
              </text>
              <rect x={LABEL_W} y={y} width={w} height={BAR_H} rx={3} className="bench-bar__rect" />
              <text x={LABEL_W + w + 6} y={y + BAR_H / 2} className="bench-bar__value" dominantBaseline="central">
                {r.text}
              </text>
            </g>
          );
        })}
      </svg>
      <details className="bench-chart__data">
        <summary>Data table</summary>
        <table>
          <caption className="sr-only">{`${group.title}, ${group.unit}`}</caption>
          <thead>
            <tr>
              <th scope="col">System</th>
              <th scope="col">QPS</th>
            </tr>
          </thead>
          <tbody>
            {group.rows.map((r) => (
              <tr key={r.system}>
                <th scope="row">{r.label}</th>
                <td>{r.text}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <a href={group.source}>Raw results file</a>
      </details>
    </figure>
  );
}
