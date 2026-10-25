import { useState } from "react";
import { SEARCH_EXAMPLES, SEARCH_EXAMPLE_SOURCE } from "../content/search-example";

export function SearchExample() {
  const [selected, setSelected] = useState(0);
  const result = SEARCH_EXAMPLES[selected];
  return (
    <div className="search-example">
      <div className="search-example__query">
        <p className="search-example__eyebrow">01 / Ask a question</p>
        <label htmlFor="example-query">Choose a quickstart query</label>
        <select id="example-query" value={selected} onChange={(event) => setSelected(Number(event.target.value))}>
          {SEARCH_EXAMPLES.map((example, index) => (
            <option key={example.id} value={index}>{example.query}</option>
          ))}
        </select>
        <p>30 public-domain articles. Eight questions with known answers. No model or account needed to run the Rust example.</p>
        <a href="https://docs.holographic-memory.com/dev/guides/evaluate-search/">Evaluate your own documents →</a>
      </div>
      <div className="search-example__result" role="status" aria-live="polite" aria-atomic="true">
        <p className="search-example__eyebrow">02 / Inspect the source</p>
        <h3>{result.title} <code>{result.id}</code></h3>
        <blockquote>{result.text}</blockquote>
        <dl>
          <div><dt>HMS top result</dt><dd>{result.id}</dd></div>
          <div><dt>SQLite FTS5 top result</dt><dd>{result.baseline}</dd></div>
        </dl>
      </div>
      <p className="search-example__note">Recorded Rust/Node quickstart results, not a live engine or a benchmark. <a href={SEARCH_EXAMPLE_SOURCE}>Inspect the expected output</a>.</p>
    </div>
  );
}
