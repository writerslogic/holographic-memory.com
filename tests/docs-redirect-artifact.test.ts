import { describe, expect, it } from "vitest";
import { runInNewContext } from "node:vm";
import { destination, redirectHtml } from "../scripts/build-docs-redirects.mjs";

describe("GitHub Pages documentation redirects", () => {
  it("retains documentation paths and names current documentation explicitly", () => {
    expect(destination("/latest/quickstart/")).toBe("https://writerslogic.com/warm/docs/latest/quickstart/");
    for (const version of ["v0.6.4", "v0.6.3", "v0.6.1"]) {
      expect(destination(`/${version}/quickstart/`)).toBe("https://writerslogic.com/warm/docs/latest/quickstart/");
      expect(destination(`/${version}`)).toBe("https://writerslogic.com/warm/docs/latest/");
    }
  });
  it("preserves queries and fragments during browser navigation, including fallback paths", () => {
    let target = "";
    const html = redirectHtml("/", true);
    const script = html.match(/<script>([\s\S]*?)<\/script>/)![1];
    runInNewContext(script, { location: { pathname: "/v0.6.4/guide/", search: "?query=a%26b", hash: "#setup", replace: (value: string) => { target = value; } } });
    expect(target).toBe("https://writerslogic.com/warm/docs/latest/guide/?query=a%26b#setup");
    expect(html).not.toContain('http-equiv="refresh"');
    expect(redirectHtml("/latest/")).toContain('http-equiv="refresh"');
  });
});
