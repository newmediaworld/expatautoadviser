/**
 * Single source of truth for EAA's route table.
 *
 * Both `prerender.mjs` (which generates the 52 static HTML files + the
 * sitemap) and `scripts/gen-vercel-config.mjs` (which generates the edge
 * redirect rules in vercel.json) parse `src/App.jsx` through this module,
 * so the two can never disagree about what routes exist.
 *
 * Why this matters: until 2026-08-06 `vercel.json` contained a blanket
 * `/(.*)` → `/index.html` rewrite. Because Vercel evaluates rewrites AFTER
 * the filesystem step, that rule only ever fired for URLs with no matching
 * prerendered file — i.e. it turned every 404 into an HTTP 200 serving the
 * homepage prerender, complete with the homepage's canonical tag. Google
 * reads that as a soft 404 / duplicate homepage.
 *
 * The fix is to have no catch-all rewrite at all. Every real route is
 * prerendered to `dist/<route>/index.html`, so Vercel's filesystem step
 * serves it directly; anything unmatched now falls through to `dist/404.html`
 * with a real 404 status. The only rules left in vercel.json are genuine
 * legacy-slug redirects, and they are generated from the route table below
 * so they cannot drift as routes are added.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP_PATH = path.join(__dirname, '..', 'src', 'App.jsx');

/**
 * Matches every `<Route path="..." element={<X .../>} />` in App.jsx,
 * capturing the path AND the element so `<Navigate>` redirect routes can be
 * told apart from real page routes.
 *
 * Note the element group is `[^}]*?` rather than the `[^/>]+` that
 * prerender.mjs used until 2026-08-06. That older pattern could not match an
 * element containing a slash, so `<Navigate to="/hong-kong" replace />` never
 * matched the regex at all — the legacy-slug routes were being excluded by
 * accident rather than by the `<Navigate>` filter that was meant to exclude
 * them. Harmless for prerendering (same 52 pages either way), but it meant
 * the redirect list could not be read out of App.jsx.
 */
const ROUTE_REGEX = /<Route\s+path="([^"]+)"\s+element=\{\s*(<[^}]*?)\s*\}\s*\/>/g;

/** Route paths that are never prerendered and never redirected. */
function isSyntheticPath(routePath) {
  // Dynamic segments and the client-side catch-all have no static file.
  return routePath.includes(':') || routePath === '*';
}

/**
 * Parses src/App.jsx and returns:
 *   pages     — string[]  real page routes, in declaration order (prerendered)
 *   redirects — {from, to}[]  legacy slugs declared as <Navigate to="..." />
 */
export function parseRoutes(appPath = APP_PATH) {
  const src = fs.readFileSync(appPath, 'utf-8');

  const pages = [];
  const redirects = [];
  const seenPages = new Set();
  const seenRedirects = new Set();

  let m;
  while ((m = ROUTE_REGEX.exec(src)) !== null) {
    const [, routePath, element] = m;

    if (isSyntheticPath(routePath)) continue;

    if (/^<Navigate\b/.test(element)) {
      const to = element.match(/to="([^"]+)"/);
      if (!to) {
        throw new Error(
          `routes.mjs: <Navigate> route "${routePath}" has no literal to="..." — ` +
            `the redirect cannot be generated. Use a string literal.`
        );
      }
      if (seenRedirects.has(routePath)) continue;
      seenRedirects.add(routePath);
      redirects.push({ from: routePath, to: to[1] });
      continue;
    }

    if (seenPages.has(routePath)) continue;
    seenPages.add(routePath);
    pages.push(routePath);
  }

  // A legacy slug that collides with a real page would shadow that page at
  // the edge (redirects run before the filesystem step). Fail loudly.
  const collisions = redirects.filter((r) => seenPages.has(r.from));
  if (collisions.length > 0) {
    throw new Error(
      `routes.mjs: these paths are declared as BOTH a page and a redirect — ` +
        `the redirect would shadow the page: ${collisions
          .map((c) => c.from)
          .join(', ')}`
    );
  }

  return { pages, redirects };
}
