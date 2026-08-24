/**
 * One-shot migration of the v5 public/assets tree into v6's public/media.
 *
 * Three things happen here beyond a copy:
 *  - every raster is capped at a sane longest edge and re-encoded to WebP,
 *    which is what takes the tree from 267MB to something shippable;
 *  - filenames are slugified, so no asset URL needs percent-encoding;
 *  - the Vivienne Westwood gallery is routed OUT of public/ into private-media/,
 *    because serving it from public/ is what made the old password gate a fiction.
 */
import { mkdir, readdir, copyFile, stat, access } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = "/Users/henrywall/Desktop/Claude_Brain/1-apps/portfolio-v5/public/assets";
const V6 = "/Users/henrywall/Desktop/Claude_Brain/1-apps/portfolio-v6";

// source dir -> [destination, max longest edge, webp quality]
const JOBS = [
  ["images/photography/portrait",             "public/media/photography/portrait",             2400, 78],
  ["images/photography/landscape",            "public/media/photography/landscape",            2400, 78],
  ["images/photography/cityscape",            "public/media/photography/cityscape",            2400, 78],
  ["images/photography/the-coffee-community", "public/media/photography/the-coffee-community", 2000, 78],
  ["images/photography/WeMetAtEight",         "public/media/photography/WeMetAtEight",         2000, 78],
  ["images/photography/vw-harrods",           "private-media/vw-harrods",                      2000, 78],
  ["images/hikes/west-highland-way",          "public/media/walking/west-highland-way",        2000, 78],
  ["images/hikes/cwm-llwch",                  "public/media/walking/cwm-llwch",                2000, 78],
  ["images/projects/logo-design",             "public/media/identity",                         2000, 82],
];

const RASTER = new Set([".jpg", ".jpeg", ".png", ".heic"]);
const SKIP_EXT = new Set([".xlsx", ".bak", ".bak2", ".bak3"]);

/**
 * Dotfiles report an empty extname, so an extension-only skip list silently
 * lets .DS_Store through and the destination path collapses to its directory.
 * Skip on the basename instead.
 */
const shouldSkip = (file) => {
  const base = path.basename(file);
  return base.startsWith(".") || SKIP_EXT.has(path.extname(file).toLowerCase());
};

/** Keep basenames URL-safe but still recognisable. Extension handled by caller. */
const slug = (name) =>
  name
    .replace(/\.[^.]+$/, "")
    .replace(/[_\s]+/g, "-")
    .replace(/[^A-Za-z0-9.-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

let converted = 0, copied = 0, skipped = 0, failed = 0, bytesIn = 0, bytesOut = 0;

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

async function processDir(srcRel, destRel, maxEdge, quality) {
  const srcDir = path.join(SRC, srcRel);
  const destDir = path.join(V6, destRel);
  let files;
  try {
    files = await walk(srcDir);
  } catch {
    console.warn(`  ! missing source: ${srcRel}`);
    return;
  }

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (shouldSkip(file)) { skipped++; continue; }

    // Preserve any nested folder (the identity tree is one level deep).
    const rel = path.relative(srcDir, file);
    const sub = path.dirname(rel);
    const targetDir = path.join(destDir, sub === "." ? "" : slug(sub));
    await mkdir(targetDir, { recursive: true });

    const base = slug(path.basename(file));
    bytesIn += (await stat(file)).size;

    if (RASTER.has(ext)) {
      const dest = path.join(targetDir, `${base}.webp`);
      if (await exists(dest)) { skipped++; continue; }
      try {
        await sharp(file, { failOn: "none" })
          .rotate()
          .resize({ width: maxEdge, height: maxEdge, fit: "inside", withoutEnlargement: true })
          .webp({ quality, effort: 5 })
          .toFile(dest);
        bytesOut += (await stat(dest)).size;
        converted++;
      } catch (err) {
        console.warn(`  ! failed ${rel}: ${err.message}`);
        failed++;
      }
    } else {
      const dest = path.join(targetDir, `${base}${ext}`);
      await copyFile(file, dest);
      bytesOut += (await stat(dest)).size;
      copied++;
    }
  }
  console.log(`  ${srcRel} -> ${destRel}`);
}

const exists = async (p) => access(p).then(() => true).catch(() => false);

const mb = (n) => (n / 1024 / 1024).toFixed(1) + "MB";

console.log("Migrating assets...");
for (const [s, d, m, q] of JOBS) await processDir(s, d, m, q);

// Flat passthroughs: motion, video, brand marks, the CV.
for (const [srcRel, destRel] of [
  ["images/animations", "public/media/motion"],
  ["images/videos", "public/media/video"],
  ["images/logos", "public/media/brand"],
  ["content/cv", "public/media/cv"],
]) {
  const srcDir = path.join(SRC, srcRel);
  const destDir = path.join(V6, destRel);
  await mkdir(destDir, { recursive: true });
  for (const file of await walk(srcDir)) {
    const ext = path.extname(file).toLowerCase();
    if (shouldSkip(file)) { skipped++; continue; }
    // The CV keeps its exact filename: it is linked from outside the site.
    const base = srcRel === "content/cv" ? path.basename(file) : `${slug(path.basename(file))}${ext}`;
    const dest = path.join(destDir, base);
    await copyFile(file, dest);
    bytesIn += (await stat(file)).size;
    bytesOut += (await stat(dest)).size;
    copied++;
  }
  console.log(`  ${srcRel} -> ${destRel}`);
}

console.log(`\nconverted ${converted} · copied ${copied} · skipped ${skipped} · failed ${failed}`);
console.log(`${mb(bytesIn)} in -> ${mb(bytesOut)} out`);
