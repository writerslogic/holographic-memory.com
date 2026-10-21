# WritersLogic Display — modifications & attribution

`WritersLogic-Display.woff2` is a derivative of **Fraunces**, produced by a
reproducible build (`scripts/build-display-font.py`).

## Upstream source

- **Font:** Fraunces (variable roman), by Undercase Type.
- **Repo / pin:** `undercasetype/Fraunces` @ commit
  `7ccdec31c6028118dce3e47fe864e3744460371d` (version 1.003).
- **License:** SIL Open Font License 1.1 — preserved verbatim in
  [`OFL-Fraunces.txt`](./OFL-Fraunces.txt). Fraunces declares **no Reserved Font
  Name**, so renaming a derivative is permitted.
- **Axes (verified by the build):** `opsz [9–144]`, `wght [100–900]`,
  `SOFT [0–100]`, `WONK [0–1]`.

## Modifications (what makes this a derivative, not a rename)

1. **Restrained axis instance.** `SOFT` pinned to **20** and `WONK` to **0** (the
   wonky, high-contrast defaults removed), producing a rational, restrained cut.
   `wght` and `opsz` axes are retained, so headings still vary weight and track
   optical size. Instancing removes the two axes' `gvar` deltas (smaller file).
2. **`ss01` baked as default.** Fraunces' `ss01` stylistic set — **straight-leg
   `h m n s`** and a **cleaner ampersand** (plus their accented variants, 26
   glyphs) — is remapped into the default `cmap`. This changes the actual
   outlines each of those characters renders by default; it is a genuine glyph
   change, not metadata. (Chosen after an in-browser bake-off; see the specimen
   at `/type-specimen` and the reproducible before/after proof
   `scripts/font-proof.html`, verified in-browser.)
3. **Rename + attribution.** Family renamed to `WritersLogic Display`; the
   upstream Fraunces copyright is preserved in the name table (ID 0), the OFL is
   preserved, and this modification note is embedded (name ID 10). Vendor URL set
   to writerslogic.com.
4. **Subset** to the audited Latin + Greek + technical/symbol keep-set (shared
   with `scripts/subset-fonts.mjs`); the brand caps W/R/L are asserted present +
   non-empty by the build's validation step.

## Not yet done — remaining type-design task

The prompt prioritizes **bespoke redrawing of the brand caps W, R, L** (and
optionally G/P/O). Fraunces exposes **no alternates** for these letters, so
genuine customization would require *newly-drawn contours* — real manual type
design, which is not safely automatable and is out of scope for this build. The
current derivative therefore leaves W/R/L as upstream Fraunces. This is the
documented remaining task; it is **not** claimed as customization.

## WritersLogic vs WritersProof

WritersProof's app ships **default** Fraunces; WritersLogic ships this
ss01-modified derivative. The two wordmarks are therefore already
distinguishable in their lowercase (`s` and the letters covered by ss01). Once
the W/R/L redraw lands, the caps will diverge too — that is the intended point
of differentiation.

## Reproducing

```sh
# Pinned toolchain; fetches the pinned upstream into build/ (gitignored),
# never touches installed system fonts, uses no absolute paths.
uv run --with 'fonttools==4.63.0' --with brotli python scripts/build-display-font.py
```

Output: `public/fonts/WritersLogic-Display.woff2`. The script fails loudly if the
upstream axes don't match, if `ss01` is absent, if a brand glyph is empty, or if
a required codepoint is dropped.
