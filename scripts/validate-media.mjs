/**
 * Every media path referenced by the content layer must resolve to a real
 * file. Template-literal galleries never appear in server HTML, so a crawl
 * cannot see them — this compiles the content modules and walks the real
 * arrays instead.
 */
import { execFileSync } from "node:child_process";
import { existsSync, rmSync, writeFileSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const OUT = path.join(process.cwd(), ".validate");
rmSync(OUT, { recursive: true, force: true });

execFileSync("npx", ["tsc", "content/*.ts",
  "--outDir", OUT, "--module", "esnext", "--target", "es2022",
  "--moduleResolution", "bundler", "--skipLibCheck"],
  { stdio: "pipe", shell: true });

// The project has no "type": "module", so tsc's .js output would be loaded as
// CommonJS. Mark the temp dir as ESM.
writeFileSync(path.join(OUT, "package.json"), '{"type":"module"}');

// tsc leaves relative specifiers extensionless, which ESM will not resolve.
for (const f of readdirSync(OUT).filter((n) => n.endsWith(".js"))) {
  const file = path.join(OUT, f);
  writeFileSync(file, readFileSync(file, "utf8").replace(/from "(\.\/[^"]+)"/g, 'from "$1.js"'));
}

const collect = (value, into) => {
  if (typeof value === "string") {
    if (value.startsWith("/media/") || value.startsWith("/api/gated/")) into.add(value);
  } else if (Array.isArray(value)) {
    for (const v of value) collect(v, into);
  } else if (value && typeof value === "object") {
    for (const v of Object.values(value)) collect(v, into);
  }
};

const paths = new Set();
for (const f of ["photography", "identity-work", "motion", "walking", "doors", "canon", "identity"]) {
  const mod = await import(pathToFileURL(path.join(OUT, `${f}.js`)).href);
  collect(mod, paths);
}

const resolve = (p) =>
  p.startsWith("/api/gated/")
    ? path.join(process.cwd(), "private-media", p.slice("/api/gated/".length))
    : path.join(process.cwd(), "public", p);

const missing = [...paths].filter((p) => !existsSync(resolve(decodeURIComponent(p))));

rmSync(OUT, { recursive: true, force: true });

console.log(`checked ${paths.size} media paths`);
if (missing.length) {
  console.log(`\n${missing.length} MISSING:`);
  for (const m of missing.slice(0, 25)) console.log("  " + m);
  process.exitCode = 1;
} else {
  console.log("all resolve");
}
