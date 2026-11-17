# holographic-memory.com (legacy redirect to WARM)

**This repository no longer serves a product page.** WARM (WritersLogic Adaptive Retention & Memory) lives at [writerslogic.com/warm](https://writerslogic.com/warm/). Its site source is `warm-site/` in the [writerslogic.com repository](https://github.com/writerslogic/writerslogic.com), and the engine is [writerslogic/warm](https://github.com/writerslogic/warm).

What this Cloudflare Pages project still does: it redirects every page request on every host it answers on to `https://writerslogic.com/warm/` (see [WARM migration](#warm-migration)), and it keeps the billing API proxy under `/api/hms/`.

The page under `src/` is the product page from before the migration. It is kept so the project still builds, it describes packages and licence terms that have been superseded, and it is not reachable once the redirect is deployed. Do not copy from it.

React 19, Vite 7 and Tailwind CSS 4, using the writerslogic.com design system (tokens, fonts and components copied into `src/styles/parts`). One page, server-rendered at build time and hydrated on the client.

```sh
npm ci
npm run dev             # http://localhost:5173
npm run build           # client build, SSR build, then scripts/prerender.mjs injects markup and <head> metadata
npm run lint && npm test
npm run test:e2e        # Playwright: overflow at 320-1280px, axe incl. contrast, prerendered metadata, CTA flag
npm run deploy:preview  # Cloudflare Pages project `holographic-memory`, branch `preview`
```

- Content and claims: `src/content/hms.ts`. Every benchmark cites a file committed on `main` of github.com/writerslogic/holographic-memory; anything without one is listed as in progress.
- Checkout buttons: build with `VITE_HMS_CHECKOUT_ENABLED=true` to point the Cloud, Team and Enterprise tiers at `/api/hms/checkout?plan=<cloud|team|enterprise>`. When the flag is off (the default) they open a waitlist email, and the checkout links are not in the bundle.
- Social card: `public/og-image.png`, generated from `scripts/assets/og-image.html` with `npm run og`.

## WARM migration

`functions/_middleware.ts` answers every GET and HEAD page request with a 301 to the matching path under `https://writerslogic.com/warm`, on the legacy domains and on the `*.pages.dev` deployment hosts alike, preserving paths, queries and fragments. API paths and writes continue to their existing handlers, and loopback hosts are left alone for local development. If a static file is ever served without the middleware, `public/_headers` marks it `noindex` and names `https://writerslogic.com/warm/` as canonical. `workers/docs-redirect` redirects the old GitHub Pages documentation hostname while serving the exact immutable `/ns/hms/v1.jsonld` context bytes at their original URI.
