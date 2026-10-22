import { ThemeToggle } from "./components/ThemeToggle";
import { HmsMark } from "./components/HmsMark";
import { ProductPage } from "./ProductPage";
import {
  HMS_COMPANY_URL,
  HMS_FULL_NAME,
  HMS_LICENSE_NOTE,
  HMS_LINKS,
  HMS_NAME,
} from "./content/hms";

const NAV = [
  { href: "#quickstart", label: "Quickstart" },
  { href: "#benchmarks", label: "Benchmarks" },
  { href: "#pricing", label: "Plans" },
  { href: HMS_LINKS.docs, label: "Docs", external: true },
];

function Header() {
  return (
    <header className="relative z-10 section-x py-4 border-b border-white/5">
      <nav
        aria-label="Primary"
        className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-x-6 gap-y-2"
      >
        <a href="#top" className="flex items-center gap-3 text-slate-100 font-semibold">
          <HmsMark className="h-7 w-auto" />
          <span>{HMS_NAME}</span>
        </a>
        <ul className="flex flex-wrap items-center gap-x-5 gap-y-1 list-none p-0 m-0 text-sm text-slate-300">
          {NAV.map((n) => (
            <li key={n.label} className="hidden sm:block">
              <a
                href={n.href}
                className="hover:text-teal-300"
                {...(n.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {n.label}
              </a>
            </li>
          ))}
          <li>
            <ThemeToggle />
          </li>
          <li>
            <a
              href={HMS_LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-teal-300"
            >
              GitHub
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="relative section-x py-10 border-t border-white/5 text-sm text-slate-300">
      <div className="max-w-6xl mx-auto grid gap-4 sm:grid-cols-2 items-start">
        <div>
          <p className="text-slate-100 font-semibold mb-1">{HMS_FULL_NAME}</p>
          <p className="m-0">
            A product of{" "}
            <a href={HMS_COMPANY_URL} className="underline underline-offset-4 decoration-teal-400/50 hover:text-teal-300">
              WritersLogic, Inc.
            </a>
          </p>
        </div>
        <ul className="flex flex-wrap gap-x-5 gap-y-2 list-none p-0 m-0 sm:justify-end">
          <li><a href={HMS_LINKS.github} className="hover:text-teal-300">GitHub</a></li>
          <li><a href={HMS_LINKS.docs} className="hover:text-teal-300">Docs</a></li>
          <li><a href={HMS_LINKS.crates} className="hover:text-teal-300">crates.io</a></li>
          <li><a href={HMS_LINKS.pypiSdk} className="hover:text-teal-300">PyPI</a></li>
          <li><a href={`${HMS_COMPANY_URL}/privacy`} className="hover:text-teal-300">Privacy</a></li>
        </ul>
        <p className="text-xs m-0 sm:col-span-2">{HMS_LICENSE_NOTE}</p>
      </div>
    </footer>
  );
}

export function App() {
  return (
    <div id="top" className="page-shell bg-surface-dark bg-grain">
      <div className="ambient-bg" aria-hidden="true" />
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Header />
      <ProductPage />
      <Footer />
    </div>
  );
}
