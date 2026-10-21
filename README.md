# holographic-memory.com

Product site for WritersLogic Holographic Memory, served by Cloudflare Pages.

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
