#!/usr/bin/env node
/**
 * Minimal, dependency-free build.
 *
 * Copies source modules into the deployable `public/` directory so the
 * browser can load them with relative ES-module imports. No bundler,
 * no framework — just a predictable, inspectable output tree.
 *
 * Run: `node scripts/build.mjs`  (or `npm run build`)
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "src");
const out = path.join(root, "public");

/** Files/dirs to copy from src/ -> public/ (preserving structure). */
const COPY = [
  ["render.js", "render.js"],
  ["theme-init.js", "theme-init.js"],
  ["styles/main.css", "styles/main.css"],
  ["config/portfolio.config.js", "config/portfolio.config.js"],
];

async function copyOne(from, to) {
  const ab2 = path.join(out, to);
  await fs.mkdir(path.dirname(ab2), { recursive: true });
  await fs.copyFile(path.join(src, from), ab2);
  return to;
}

async function main() {
  const done = [];
  for (const [from, to] of COPY) done.push(await copyOne(from, to));
  console.log("built public/:");
  for (const f of done) console.log("  ✓ " + f);
  console.log("  (index.html and assets/ are authored directly in public/)");
}

main().catch((e) => {
  console.error("build failed:", e.message);
  process.exit(1);
});
