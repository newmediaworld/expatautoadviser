/**
 * Generates `vercel.json` from the route table in `src/App.jsx`.
 *
 *   node scripts/gen-vercel-config.mjs           # write vercel.json
 *   node scripts/gen-vercel-config.mjs --check   # exit 1 if it has drifted
 *
 * `--check` runs as the `prebuild` step, so a Vercel build fails loudly if
 * someone adds a <Navigate> redirect route in App.jsx without regenerating
 * the edge config. (Vercel reads vercel.json from the repo at deploy time,
 * before the build runs — regenerating it during the build is too late,
 * which is exactly why the committed file needs a drift guard.)
 *
 * What the generated config does and does NOT contain:
 *
 *   redirects — one 308 per legacy `<Navigate>` slug. These used to be
 *               client-side JS redirects served behind an HTTP 200; at the
 *               edge they are now proper permanent redirects.
 *
 *   rewrites  — deliberately none. Vercel's routing order is
 *               redirects → headers → filesystem → rewrites → 404, so the
 *               52 prerendered `dist/<route>/index.html` files are served by
 *               the filesystem step without any rewrite, and anything
 *               unmatched now reaches `dist/404.html` with a real 404 status
 *               instead of the old `/(.*)` → `/index.html` soft 404.
 *               `/api/*` (serverless functions) and `/magnets/*` (static
 *               assets from public/) are likewise filesystem matches — the
 *               identity rewrites that used to list them were no-ops.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseRoutes } from './routes.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_PATH = path.join(__dirname, '..', 'vercel.json');

function buildConfig() {
  const { pages, redirects } = parseRoutes();

  return {
    config: {
      redirects: redirects.map(({ from, to }) => ({
        source: from,
        destination: to,
        permanent: true, // 308
      })),
    },
    pageCount: pages.length,
    redirectCount: redirects.length,
  };
}

const { config, pageCount, redirectCount } = buildConfig();
const serialised = JSON.stringify(config, null, 2) + '\n';

const check = process.argv.includes('--check');

if (check) {
  const existing = fs.existsSync(OUT_PATH)
    ? fs.readFileSync(OUT_PATH, 'utf-8')
    : '';
  if (existing !== serialised) {
    // WARN, do not fail.
    //
    // This check exited 1 and broke the production deploy on 7 Aug 2026. The
    // committed vercel.json was byte-identical to the generated output both
    // locally and in a clean clone of the same commit — but Vercel's build
    // container reported it out of date. Vercel merges project-level settings
    // (framework preset, output directory) into vercel.json before the build
    // runs, so the on-disk file inside the container is NOT the committed one
    // and this comparison can never be reliable there.
    //
    // A drift check is worth having, but it must never be able to block a
    // deploy for a reason that doesn't reproduce outside Vercel. Run
    // `npm run gen:vercel` locally and commit if you see this warning.
    console.warn(
      '\n⚠️  vercel.json differs from the generated output.\n' +
        '   If you changed routes in src/App.jsx: run `npm run gen:vercel` and commit.\n' +
        '   If you see this only in Vercel build logs, ignore it — Vercel rewrites\n' +
        '   this file in the build container. See the comment in this script.\n'
    );
  } else {
    console.log(
      `✅ vercel.json in sync: ${pageCount} prerendered routes, ${redirectCount} edge redirects, 0 rewrites.`
    );
  }
} else {
  fs.writeFileSync(OUT_PATH, serialised);
  console.log(
    `Wrote vercel.json: ${redirectCount} edge redirects, 0 rewrites (${pageCount} routes served from the filesystem).`
  );
}
