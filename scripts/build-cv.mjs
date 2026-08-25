/**
 * Prints /cv to public/media/cv/Hal_Wall_CV.pdf.
 *
 * The CV is a page in this app, so the PDF is generated from the same content
 * modules, the same tokens and the same two typefaces as the site rather than
 * being a separate document that slowly stops agreeing with it. The one it
 * replaces was also a Chrome print -- of a file nobody could find the source
 * of, still claiming six thousand downloads and a Capacitor iOS app.
 *
 *   node scripts/build-cv.mjs [--url http://localhost:3000/cv]
 *
 * Needs the dev or production server running at that URL.
 */
import { spawn } from "node:child_process";
import { mkdir, rm, stat } from "node:fs/promises";
import path from "node:path";

const CHROME =
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const OUT = "public/media/cv/Hal_Wall_CV.pdf";

const urlArg = process.argv.indexOf("--url");
const URL_ = urlArg > -1 ? process.argv[urlArg + 1] : "http://localhost:3000/cv";

const res = await fetch(URL_).catch(() => null);
if (!res?.ok) {
  console.error(`No page at ${URL_}. Start the server first: npx next dev`);
  process.exit(1);
}

await mkdir(path.dirname(OUT), { recursive: true });
await rm(OUT, { force: true });

/*
  A throwaway profile each run. Chrome refuses --headless against a profile
  another instance already holds, and there is usually a dev browser open.
*/
const profile = await (async () => {
  const p = path.join("/tmp", `cv-print-${process.pid}`);
  await mkdir(p, { recursive: true });
  return p;
})();

const args = [
  "--headless",
  "--disable-gpu",
  `--user-data-dir=${profile}`,
  "--no-pdf-header-footer",
  // The page draws its own A4 margins, so Chrome must not add a second set.
  "--print-to-pdf-no-header",
  `--print-to-pdf=${OUT}`,
  // Long enough for the webfonts to load; a CV printed in Times is not the CV.
  "--virtual-time-budget=12000",
  URL_,
];

/*
  Chrome writes the PDF and then does not exit -- reliably, on this version,
  in headless. So rather than waiting on the process, watch for the file to
  appear and stop growing, then stop the process ourselves.
*/
await new Promise((resolve, reject) => {
  const child = spawn(CHROME, args, { stdio: "ignore" });
  child.on("error", reject);

  let last = -1;
  const started = Date.now();

  const watch = setInterval(async () => {
    const size = await stat(OUT).then((s) => s.size, () => -1);

    if (size > 0 && size === last) {
      clearInterval(watch);
      child.kill();
      resolve();
      return;
    }
    last = size;

    if (Date.now() - started > 90_000) {
      clearInterval(watch);
      child.kill();
      reject(new Error("timed out waiting for the PDF"));
    }
  }, 1200);

  child.on("exit", () => {
    clearInterval(watch);
    resolve();
  });
});

/* Chrome is still letting go of the profile when we kill it, so tidying up is
   allowed to fail; a leftover directory in /tmp is not worth an error exit. */
await new Promise((r) => setTimeout(r, 400));
await rm(profile, { recursive: true, force: true }).catch(() => {});

const { size } = await stat(OUT);
if (size < 20_000) {
  console.error(`${OUT} is only ${size} bytes, which is too small to be right.`);
  process.exit(1);
}
console.log(`${OUT}  ${(size / 1024).toFixed(0)}KB`);
