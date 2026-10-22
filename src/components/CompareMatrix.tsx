export type Mark = "yes" | "partial" | "no" | "unknown";

const GLYPH: Record<Mark, string> = { yes: "✓", partial: "◐", no: "✕", unknown: "–" };
const WORD: Record<Mark, string> = {
  yes: "Yes",
  partial: "Partly",
  no: "No",
  unknown: "Not documented",
};

export interface MatrixRow {
  property: string;
  cells: { mark: Mark; note: string }[];
}

// Compact checkmark matrix. Each glyph carries its full note as visually hidden
// text, so screen readers get the detail the sighted view folds away.
export function CompareMatrix({
  columns,
  rows,
  label,
}: {
  columns: string[];
  rows: MatrixRow[];
  label: string;
}) {
  return (
    <div className="matrix" tabIndex={0} role="region" aria-label={`${label}, scrollable`}>
      <table className="matrix__table">
        <caption className="sr-only">{label}</caption>
        <thead>
          <tr>
            <th scope="col">
              <span className="sr-only">Property</span>
            </th>
            {columns.map((c, i) => (
              <th key={c} scope="col" className={i === 0 ? "matrix__self" : undefined}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.property}>
              <th scope="row">{r.property}</th>
              {r.cells.map((c, i) => (
                <td key={columns[i]} className={`matrix__cell matrix__cell--${c.mark}`} title={c.note}>
                  <span aria-hidden="true">{GLYPH[c.mark]}</span>
                  <span className="sr-only">{`${WORD[c.mark]}: ${c.note}`}</span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const MATRIX_LEGEND = (Object.keys(GLYPH) as Mark[]).map((m) => ({
  mark: m,
  glyph: GLYPH[m],
  word: WORD[m],
}));
