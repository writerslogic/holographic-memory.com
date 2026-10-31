# Legacy WARM documentation hostname

`docs.holographic-memory.com` redirects documentation GET/HEAD requests to `https://writerslogic.com/warm/docs`, preserving paths and queries. Deploy only after the canonical documentation is available.

The original `/ns/hms/v1.jsonld` context remains HTTP 200 at its immutable URI. `legacy-context.js` contains its exact published UTF-8 bytes; SHA-256 is `ec2dbc721f02dc1f06a7d03f589c5a7e43b5fa0ff8184d6a384516b774790b45`. Do not rename strings inside this context. Writes receive 405 and are never redirected to marketing pages.

Run `npm test` and `wrangler deploy --config workers/docs-redirect/wrangler.toml`. The Worker custom domain replaces the former GitHub Pages CNAME. The product hostname remains a separate Pages project, retaining its existing billing proxy.

Retired `v0.6.4`, `v0.6.3` and `v0.6.1` documentation routes explicitly redirect to `/warm/docs/latest/` with their remaining path and query preserved. The destination identifies current documentation rather than presenting it as historical content; version-tagged source on GitHub remains unchanged.
