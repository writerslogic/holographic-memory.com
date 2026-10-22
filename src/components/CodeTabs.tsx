import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

export interface CodeTab {
  id: string;
  label: string;
  panel: ReactNode;
}

// WAI-ARIA tabs with automatic activation and arrow-key navigation. The first
// tab is selected in the prerendered HTML; the others become reachable once
// the page hydrates.
export function CodeTabs({ tabs, label }: { tabs: CodeTab[]; label: string }) {
  const [active, setActive] = useState(0);
  const base = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const last = tabs.length - 1;
    const next =
      e.key === "ArrowRight" ? (i === last ? 0 : i + 1)
      : e.key === "ArrowLeft" ? (i === 0 ? last : i - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : -1;
    if (next < 0) return;
    e.preventDefault();
    setActive(next);
    refs.current[next]?.focus();
  };

  return (
    <div className="code-tabs">
      <div role="tablist" aria-label={label} className="code-tabs__list">
        {tabs.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${base}-${t.id}-tab`}
            aria-controls={`${base}-${t.id}-panel`}
            aria-selected={i === active}
            tabIndex={i === active ? 0 : -1}
            className="code-tabs__tab"
            onClick={() => setActive(i)}
            onKeyDown={(e) => onKey(e, i)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t, i) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`${base}-${t.id}-panel`}
          aria-labelledby={`${base}-${t.id}-tab`}
          hidden={i !== active}
          className="code-tabs__panel"
        >
          {t.panel}
        </div>
      ))}
    </div>
  );
}
