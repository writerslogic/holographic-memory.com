import { useEffect, useRef, useState } from "react";

export interface InstallLine {
  lang: string;
  cmd: string;
}

// navigator.clipboard needs a secure context and a permission the browser may
// refuse; the textarea + execCommand path covers older and locked-down browsers.
async function copyText(text: string, restoreFocus: HTMLElement): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to the legacy path
  }
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  let ok: boolean;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  ta.remove();
  restoreFocus.focus();
  return ok;
}

function ClipboardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="8" y="3" width="8" height="4" rx="1" />
      <path d="M16 5h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

// Each install line is one button: a click or Enter/Space anywhere on it copies
// the full command. The status region is in the server-rendered markup (empty)
// so screen readers register it before the first announcement.
export function InstallCommands({ lines }: { lines: InstallLine[] }) {
  const [copied, setCopied] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onCopy = async (line: InstallLine, button: HTMLElement) => {
    const ok = await copyText(line.cmd, button);
    window.clearTimeout(timer.current);
    setCopied(ok ? line.lang : null);
    setStatus(ok ? `Copied the ${line.lang} install command` : "Copy failed. Select the command to copy it.");
    timer.current = window.setTimeout(() => {
      setCopied(null);
      setStatus("");
    }, 2000);
  };

  return (
    <div className="hero-install-wrap">
      <ul className="hero-install list-none p-0 m-0" aria-label="Install">
        {lines.map((line) => {
          const done = copied === line.lang;
          return (
            <li key={line.cmd}>
              <button
                type="button"
                className="hero-install__btn"
                data-copied={done || undefined}
                title={`Copy the ${line.lang} install command`}
                onClick={(e) => void onCopy(line, e.currentTarget)}
              >
                <span className="hero-install__lang">{line.lang}</span>
                <code className="hero-install__cmd">{line.cmd}</code>
                <span className="hero-install__icon" aria-hidden="true">
                  {done ? <CheckIcon /> : <ClipboardIcon />}
                  <span className="hero-install__done">{done ? "Copied" : ""}</span>
                </span>
                <span className="sr-only">, copy to clipboard</span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="sr-only" role="status" aria-live="polite">
        {status}
      </p>
    </div>
  );
}
