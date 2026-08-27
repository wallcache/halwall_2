/**
 * content/canon-works.json, regenerated from The Daily Canon's live picker.
 *
 * The file this replaces was a copy of tdc/dataset/the-daily-canon.json -- the
 * legacy 366-day canon, one fixed work per calendar date. The app has since
 * moved to a per-reader greedy picker (tdc/scripts/picker-core.mjs, the same
 * reference implementation embedded in picker-sim.html), and the two had
 * drifted: 27 August served Miss Julie with no important day at all, where the
 * picker gives Du Bois's "Of Our Spiritual Strivings" on the anniversary of his
 * death. A page whose whole claim is "read live from the canon" cannot be
 * serving a canon the app retired.
 *
 * The picker is a SEQUENCE, not a calendar map: it takes a served set and
 * answers "what next", so a reader is never given the same work twice. That is
 * modelled here by running one reader through a whole year. Picking each date
 * independently instead -- the obvious alternative -- was tried and is wrong:
 * with a fresh served set per day, 81 works win more than one date (1984 takes
 * three) because nothing stops a strong work from being the best answer to
 * several questions.
 *
 * The year is a LEAP year, so all 366 dates exist and each is filled exactly
 * once. Floating feasts (Easter, Thanksgiving, MLK Day) are resolved for that
 * year, which is the one thing a date-keyed file cannot get right for every
 * year -- the same limitation the old file had, and the reason this is a build
 * step rather than a hand-maintained list.
 *
 * Run: npm run build:canon
 */
import { readFile, writeFile } from "node:fs/promises";
import { createPicker, DEFAULT_KNOBS } from "/Users/henrywall/Desktop/Claude_Brain/1-apps/tdc/scripts/picker-core.mjs";

const TDC = "/Users/henrywall/Desktop/Claude_Brain/1-apps/tdc";
const OUT = "content/canon-works.json";

/** A leap year, so 29 February is a real date with a work of its own. */
const YEAR = 2028;

const html = await readFile(`${TDC}/scripts/picker-sim.html`, "utf8");
const dataMatch = html.match(/<script id="data" type="application\/json">([\s\S]*?)<\/script>/);
if (!dataMatch) throw new Error("picker-sim.html: embedded dataset not found");
const DATA = JSON.parse(dataMatch[1]);

const catalogue = JSON.parse(await readFile(`${TDC}/content/catalogue/works-catalogue.json`, "utf8"));

/*
  Joined on title+author, not id. The picker's ids and the catalogue's do not
  line up -- 720 of the picker's 1086 works have no id match, and a good number
  of catalogue rows carry no id at all -- but the normalised title+author pair
  resolves every day of the year.
*/
const norm = (s) =>
  String(s ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "");

const byTitleAuthor = new Map();
for (const w of catalogue) {
  const key = `${norm(w.title)}|${norm(w.authors)}`;
  if (!byTitleAuthor.has(key)) byTitleAuthor.set(key, w);
}

const picker = createPicker(DATA);
const pad = (n) => String(n).padStart(2, "0");

const served = new Set();
const works = [];
const unjoined = [];

for (let d = new Date(YEAR, 0, 1); d.getFullYear() === YEAR; d.setDate(d.getDate() + 1)) {
  const date = new Date(d);
  const { pick } = picker.pickDay(date, served, DEFAULT_KNOBS);
  served.add(pick.work.id);

  const meta = byTitleAuthor.get(`${norm(pick.work.title)}|${norm(pick.work.author)}`);
  const key = `${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  if (!meta) {
    unjoined.push(`${key} ${pick.work.title} — ${pick.work.author}`);
    continue;
  }

  const pairing = pick.pairing;
  works.push({
    date: key,
    title: meta.title,
    author: meta.authors,
    year: meta.year,
    type: meta.work_type,
    language: meta.language,
    // The picker's own rule: an unverified anchor is silent and never labels a
    // day, however well it scores.
    day: pairing && pairing.verified ? pairing.anchor : null,
    extract: meta.extract ?? null,
    blurb: meta.blurb ?? null,
  });
}

if (unjoined.length) {
  throw new Error(`No catalogue metadata for ${unjoined.length} day(s):\n  ${unjoined.join("\n  ")}`);
}
if (works.length !== 366) {
  throw new Error(`Expected 366 days, built ${works.length}`);
}
const distinct = new Set(works.map((w) => w.title)).size;

await writeFile(OUT, JSON.stringify(works, null, 2) + "\n");

console.log(`${OUT}: ${works.length} days from the ${YEAR} sequence`);
console.log(`  distinct works   ${distinct}`);
console.log(`  important day    ${works.filter((w) => w.day).length}`);
console.log(`  no extract       ${works.filter((w) => !w.extract).length}`);
console.log(`  no blurb         ${works.filter((w) => !w.blurb).length}`);
