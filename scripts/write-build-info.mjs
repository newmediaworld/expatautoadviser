#!/usr/bin/env node
/**
 * write-build-info.mjs — emit `public/build-info.json` at build time so the
 * commit that is actually LIVE is externally observable at
 * https://www.expatautoadviser.com/build-info.json
 *
 * Why this exists
 * ---------------
 * On 6–7 Aug 2026 two pushes to ExpatAutoAdviser failed to deploy. Vercel
 * errored 4 seconds into the build on a `prebuild` drift check, and the CDN
 * carried on serving a 22-hour-old build — including dead affiliate links and
 * broken 404 handling that those very commits were meant to fix. Every
 * downstream monitor kept reporting green, because every monitor was checking
 * that pages *responded*, not that they were the pages we pushed.
 *
 * A live build fingerprint turns "is what's live actually what I pushed?" from
 * an inference into a lookup. `infrastructure/scripts/check_deploys.py` reads
 * this file on the Mac Mini and diffs it against `origin/main`.
 *
 * HARD RULE — THIS SCRIPT MUST NEVER FAIL A BUILD
 * -----------------------------------------------
 * A build-observability tool that can break a deploy is strictly worse than no
 * tool at all; that is the precise mistake being corrected here. Every step is
 * wrapped, every failure degrades to the string "unknown", and the process
 * always exits 0. The npm script also appends `|| true` as a second layer, in
 * case this file itself fails to parse.
 *
 * SHA resolution order
 * --------------------
 *   1. VERCEL_GIT_COMMIT_SHA  — set by Vercel in the build container. Preferred,
 *      because Vercel's clone is shallow and `.git` may be absent or partial.
 *   2. GITHUB_SHA             — if this ever runs under GitHub Actions.
 *   3. `git rev-parse HEAD`   — local builds.
 *   4. "unknown"              — never a guess. The checker treats "unknown" as
 *                               UNKNOWN, not as a match.
 *
 * Usage: runs automatically via the `prebuild` npm hook. Also `node scripts/write-build-info.mjs`.
 */

import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SITE = "expatautoadviser";
const SITE_URL = "https://www.expatautoadviser.com";

function main() {
  const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
  const OUT_DIR = join(ROOT, "public");
  const OUT_FILE = join(OUT_DIR, "build-info.json");

  /** Run git; return trimmed stdout or null. Never throws, never prints. */
  const git = (args) => {
    try {
      const out = execFileSync("git", args, {
        cwd: ROOT,
        encoding: "utf8",
        timeout: 10_000,
        stdio: ["ignore", "pipe", "ignore"],
      });
      const trimmed = String(out || "").trim();
      return trimmed || null;
    } catch {
      return null;
    }
  };

  const env = process.env;

  let commit = null;
  let commitSource = "unavailable";
  if (env.VERCEL_GIT_COMMIT_SHA) {
    commit = env.VERCEL_GIT_COMMIT_SHA.trim();
    commitSource = "VERCEL_GIT_COMMIT_SHA";
  } else if (env.GITHUB_SHA) {
    commit = env.GITHUB_SHA.trim();
    commitSource = "GITHUB_SHA";
  } else {
    const fromGit = git(["rev-parse", "HEAD"]);
    if (fromGit) {
      commit = fromGit;
      commitSource = "git rev-parse HEAD";
    }
  }
  if (!commit || !/^[0-9a-f]{7,40}$/i.test(commit)) {
    commit = "unknown";
    commitSource = "unavailable";
  }

  // Commit date: no Vercel env var carries it, so this is git-or-nothing, and
  // "unknown" is an honest answer where a fabricated timestamp is not. Note we
  // only ever ask git about the exact SHA being stamped, never about HEAD as a
  // stand-in — if the two ever diverged, a HEAD fallback would attach a wrong
  // date to a right SHA, which is worse than carrying no date at all.
  const commitDate =
    (commit !== "unknown" && git(["show", "-s", "--format=%cI", commit])) || "unknown";

  const commitMessage = (
    env.VERCEL_GIT_COMMIT_MESSAGE ||
    (commit !== "unknown" && git(["log", "-1", "--pretty=%s", commit])) ||
    ""
  )
    .split("\n")[0]
    .slice(0, 200);

  const branch =
    env.VERCEL_GIT_COMMIT_REF ||
    env.GITHUB_REF_NAME ||
    git(["rev-parse", "--abbrev-ref", "HEAD"]) ||
    "unknown";

  const buildEnv = env.VERCEL
    ? `vercel:${env.VERCEL_ENV || "unknown"}`
    : env.GITHUB_ACTIONS
      ? "github-actions"
      : "local";

  const info = {
    schema: 1,
    site: SITE,
    siteUrl: SITE_URL,
    commit,
    commitShort: commit === "unknown" ? "unknown" : commit.slice(0, 7),
    commitDate,
    commitMessage,
    branch,
    builtAt: new Date().toISOString(),
    buildEnv,
    commitSource,
    generator: "scripts/write-build-info.mjs",
  };

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, JSON.stringify(info, null, 2) + "\n", "utf8");
  console.log(
    `✓ build-info.json: ${info.commitShort} (${commitSource}) → /build-info.json`,
  );
}

try {
  main();
} catch (err) {
  // Warn, never fail. A missing build stamp downgrades the deploy checker to
  // UNKNOWN for this site, which is visible and safe. A failed build is not.
  console.warn(
    `⚠ write-build-info.mjs failed (${err && err.message ? err.message : err}) — ` +
      `continuing without a build stamp. The deploy checker will report UNKNOWN.`,
  );
}

process.exit(0);
