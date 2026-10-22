# Self-hosted web fonts — provenance & licenses

All faces are self-hosted, subsetted WOFF2 (no network font requests, no
absolute local paths — all served from `/fonts/…`). Every family is licensed
under the SIL Open Font License 1.1 (OFL), which permits self-hosting,
subsetting, and derivatives provided the license and copyright are preserved.

| Role | Family | File | Version | Source / commit | License |
|---|---|---|---|---|---|
| Display | WritersLogic Display | `WritersLogic-Display.woff2` | derivative of Fraunces 1.003 | undercasetype/Fraunces @ `7ccdec31` | OFL 1.1 — [`OFL-Fraunces.txt`](./OFL-Fraunces.txt), mods in [`MODIFICATIONS.md`](./MODIFICATIONS.md) |
| Body | Source Serif 4 (variable + italic) | `source-serif-4-variable.woff2`, `…-italic.woff2` | 4.004 | adobe-fonts/source-serif | OFL 1.1 |
| UI | DM Sans (variable) | `dm-sans-variable.woff2` | 4.004 | googlefonts/dm-fonts | OFL 1.1 |
| Code | JetBrains Mono | `jetbrains-mono-regular.woff2`, `…-light.woff2` | 2.211 | JetBrains/JetBrainsMono | OFL 1.1 |

## WritersLogic Display (Fraunces derivative)

Built reproducibly from **official upstream** Fraunces (pinned commit `7ccdec31`,
v1.003, OFL 1.1, no Reserved Font Name) by
[`scripts/build-display-font.py`](../../scripts/build-display-font.py) — pinned
toolchain (`fonttools==4.63.0`), fetches to `build/` (gitignored), no absolute
paths, installed system fonts untouched. Modifications: `SOFT` pinned to 20,
`WONK` to 0 (restrained instance; `wght`+`opsz` retained), and the `ss01`
stylistic set (straight-leg `h m n s` + cleaner ampersand) baked into the default
`cmap` — a genuine outline change, not a rename. Full attribution + the remaining
W/R/L redraw task: [`MODIFICATIONS.md`](./MODIFICATIONS.md). Reproducible
before/after glyph proof: [`scripts/font-proof.html`](../../scripts/font-proof.html)
(verified in-browser — the ampersand and the h/m/n/s legs visibly change; W/R/L
are unchanged).

## Removed

- **Spectral** (6 static faces) — replaced by Source Serif 4 for body (decision
  record in `docs/design-tokens.md`).
- **InterVariable.woff2** (344 KB) — dead; no `@font-face` referenced it.
- **Fraunces-Var.woff2** — replaced by the `WritersLogic Display` derivative.

## Cache-busting (important)

`_headers` serves `/*.woff2` as `immutable, max-age=31536000` at stable
(un-fingerprinted) URLs. So when a font's *content* changes, its URL must change
or returning visitors keep the year-cached old file. All font references in
`src/index.css` and `index.html` therefore carry a `?v=N` token — **bump it
whenever any font file is regenerated** (subset re-applied, derivative rebuilt,
etc.). Current: `?v=2`. (A more automated option is to move fonts into the Vite
asset pipeline for content-hashed filenames.)

## Request count

Production font requests dropped from up to **12 → 6** faces: Spectral's 6 static
faces removed and the on-demand Fraunces hook replaced by a single global display
face. No family loads more than one file above the fold.

## Subsetting (applied)

`node scripts/subset-fonts.mjs` (measure) / `--apply` / always runs a
source-relative lossless verify. Keep-set is derived from an audit of every
codepoint ≥ U+00A0 rendered in `src/**`: Latin (Basic/Latin-1/Ext-A/Ext-B),
combining marks, **Greek** (σ μ δ …), General Punctuation (smart quotes, dashes,
…, †‡, ′″), super/subscripts, currency, letterlike/number-forms, arrows, math
operators, misc-technical (⌘), **box-drawing + block + geometric** (═ ─ │ ▼ ▶ ●
— used in terminal/diagram displays), misc-symbols (⚠ ★), and **dingbats**
(✓ ✗ ✅ ❌). Dropped: unused scripts (Cyrillic/Hebrew/Arabic/CJK, Greek Extended)
and emoji (which always render via the system color-emoji font). Applied,
lossless-verified (`VERIFY OK`): **905 KB → 679 KB (25%)**; Source Serif 4 alone
−33%.

`unicode-range` splitting was evaluated and not used: with one file per role
there is no second range to gate, so it would only add requests.

## Signed letter PDF

`dm-sans-pdf-regular.ttf` is the unmodified static DM Sans Regular from
[googlefonts/dm-fonts, Sans/Exports/DMSans-Regular.ttf](https://github.com/googlefonts/dm-fonts/blob/main/Sans/Exports/DMSans-Regular.ttf).
Its [OFL license](./OFL-DMSans.txt) is included. The PDF generator subsets this
static TTF; the web WOFF2 variable font cannot be subset reliably by pdf-lib.
This file is fetched only by the submission endpoint and is not a new page font.

## Latin subset for holographic-memory.com

`source-serif-4-variable.woff2`, `WritersLogic-Display.woff2` and `dm-sans-variable.woff2` are re-subset with pyftsubset to Basic Latin, Latin-1 and the punctuation and symbols the page uses (layout features and name tables kept). Source Serif 4 is additionally pinned at opsz 18 (the wght axis is kept); this site uses it only for body copy. 382 KB of fonts per cold load became about 176 KB.
