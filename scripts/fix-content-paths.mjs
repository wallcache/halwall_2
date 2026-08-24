/**
 * The migration slugified every filename and folder, so the ported content
 * modules still point at the old casing and extensions. Rather than guess the
 * transform, index what actually landed on disk and rewrite by lookup — then
 * fail loudly on anything that cannot be resolved.
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const ROOTS = [
  ["public/media", "/media"],
  ["private-media", "/api/gated"],
];

const norm = (p) =>
  p
    .toLowerCase()
    .replace(/\.[^./]+$/, "")
    .replace(/[_\s]+/g, "-")
    .replace(/[^a-z0-9/.-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/(^|\/)-|-(\/|$)/g, "$1$2");

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (!e.name.startsWith(".")) out.push(p);
  }
  return out;
}

const index = new Map();
for (const [dir, urlPrefix] of ROOTS) {
  for (const file of await walk(path.join(ROOT, dir))) {
    const url = urlPrefix + "/" + path.relative(path.join(ROOT, dir), file).split(path.sep).join("/");
    index.set(norm(url), url);
  }
}
console.log(`indexed ${index.size} files on disk`);

const files = (await readdir(path.join(ROOT, "content"))).filter((f) => f.endsWith(".ts"));
let rewritten = 0;
const unresolved = [];

for (const f of files) {
  const p = path.join(ROOT, "content", f);
  const src = await readFile(p, "utf8");
  const out = src.replace(/(["'`])((?:\/media|\/api\/gated)\/[^"'`]+)\1/g, (m, q, url) => {
    // Leave anything already correct, and anything not yet created (brand SVGs).
    if (index.has(norm(url))) {
      const real = index.get(norm(url));
      if (real !== url) rewritten++;
      return `${q}${real}${q}`;
    }
    unresolved.push(`${f}: ${url}`);
    return m;
  });
  if (out !== src) await writeFile(p, out);
}

console.log(`rewrote ${rewritten} paths`);
if (unresolved.length) {
  console.log(`\n${unresolved.length} unresolved:`);
  for (const u of unresolved.slice(0, 15)) console.log("  " + u);
  if (unresolved.length > 15) console.log(`  ...and ${unresolved.length - 15} more`);
}
