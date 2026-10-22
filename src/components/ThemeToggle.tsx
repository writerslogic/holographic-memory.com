import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

// public/theme-init.js sets data-theme before paint; this button flips it and
// remembers the choice. The server snapshot is dark, matching index.html.
function subscribe(onChange: () => void) {
  const obs = new MutationObserver(onChange);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => obs.disconnect();
}
const current = (): Theme =>
  document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";

export function ThemeToggle() {
  const theme = useSyncExternalStore<Theme>(subscribe, current, () => "dark");
  const next: Theme = theme === "dark" ? "light" : "dark";
  const flip = () => {
    const root = document.documentElement;
    root.setAttribute("data-theme", next);
    root.style.colorScheme = next;
    try {
      localStorage.setItem("hms-theme", next);
    } catch {
      // storage blocked: the choice lasts for this page view
    }
  };
  return (
    <button type="button" className="theme-toggle" onClick={flip} aria-label={`Switch to ${next} theme`}>
      <span aria-hidden="true">{theme === "dark" ? "☀" : "☾"}</span>
    </button>
  );
}
