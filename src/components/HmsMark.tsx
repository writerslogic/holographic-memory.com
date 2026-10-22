// The Holographic Memory mark (same geometry as /images/logos/holographic-memory.svg),
// drawn in currentColor so it reads in both themes.

const EDGES: [number, number, number, number][] = [
  [204, 150, 308, 150], [308, 150, 396, 250], [396, 250, 256, 432],
  [256, 432, 116, 250], [116, 250, 204, 150], [204, 150, 256, 196],
  [308, 150, 256, 196], [256, 196, 256, 250], [116, 250, 196, 250],
  [196, 250, 256, 250], [256, 250, 316, 250], [316, 250, 396, 250],
  [256, 196, 116, 250], [256, 196, 396, 250], [204, 150, 256, 432],
  [308, 150, 256, 432], [256, 250, 256, 432], [196, 250, 256, 432],
  [316, 250, 256, 432], [256, 196, 256, 432], [430, 300, 452, 300],
  [440, 330, 470, 330], [455, 360, 471, 360], [120, 300, 138, 300],
  [430, 210, 444, 210], [460, 250, 472, 250],
];

const NODES: [number, number, number][] = [
  [204, 150, 7], [308, 150, 7], [116, 250, 7], [396, 250, 7], [256, 196, 7],
  [256, 250, 7], [196, 250, 7], [316, 250, 7], [256, 432, 7],
  [470, 290, 3.5], [150, 210, 3.5], [440, 400, 3.5], [110, 360, 3.5],
];

function MarkShapes() {
  return (
    <>
      {EDGES.map(([x1, y1, x2, y2]) => (
        <line key={`${x1}-${y1}-${x2}-${y2}`} x1={x1} y1={y1} x2={x2} y2={y2} />
      ))}
      {NODES.map(([cx, cy, r]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} stroke="none" />
      ))}
    </>
  );
}

// Decorative hero backdrop: the same mark, turned once about (256, 291) as in the
// animated logo. The square viewBox is centered on that pivot and wide enough
// that the outer dots never clip mid-turn.
export function HmsMarkBackdrop({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="26 61 460 460"
      className={className}
      aria-hidden="true"
      focusable="false"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth={3.5}
      strokeLinecap="round"
    >
      <g className="hero-mark__spin">
        <MarkShapes />
      </g>
    </svg>
  );
}

export function HmsMark({
  className = "",
  title,
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="96 120 392 330"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      fill="currentColor"
      stroke="currentColor"
      strokeWidth={5}
      strokeLinecap="round"
    >
      <MarkShapes />
    </svg>
  );
}
