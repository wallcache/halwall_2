/**
 * The app icons, generated from the one committed jellyfish.
 *
 * Run on demand, not as part of `next build` -- the outputs are committed, and
 * Next picks them up by filename alone (app/favicon.ico, app/icon.png,
 * app/apple-icon.png), so nothing has to be declared in layout.tsx.
 *
 * Two things here are not a plain resize:
 *
 *  - The mark is inked, and only the iOS tile is grounded. The tab icons are
 *    transparent, which means they have no ground of their own to read
 *    against, so a single colour has to survive both a white tab strip and a
 *    dark one. #4e9a5f is that colour: a third brightness of the site's one
 *    hue, sitting between the recto's forest and the verso's spring, and
 *    clearing 3:1 on Chrome's light and dark chrome alike. The verso pair
 *    would fail one or the other -- the forest green is 2.1:1 on a dark strip,
 *    the spring green 1.6:1 on a light one. The iOS tile keeps its ground
 *    because iOS flattens transparency onto black regardless, and the site's
 *    own #242424 is a better black than that one.
 *
 *  - The strokes are dilated at the small sizes. The drawing's line is 4.8% of
 *    its own width, which is a comfortable 1.5px at 48 and a 0.6px ghost at 16.
 *    Without this the tentacles arrive in the tab as grey haze. The dilation is
 *    done by stamping the mark around a small circle on an 8x working canvas
 *    before the downscale, which is a real circular dilate rather than a blur
 *    that has to be talked back into a shape.
 */
import { readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

const SRC = "public/media/brand/jellyfish.png";

const VERSO_GROUND = { r: 0x24, g: 0x24, b: 0x24, alpha: 1 };
const VERSO_INK = { r: 0xe9, g: 0xed, b: 0xf1 };
/** Legible on a light tab strip and a dark one. See the note above. */
const TAB_INK = { r: 0x4e, g: 0x9a, b: 0x5f };

/** Working canvas is this many times the finished tile. */
const SCALE = 8;

/**
 * pad    fraction of the tile left as margin on each side
 * dilate how much to thicken the stroke, in finished pixels
 * ground omitted for a transparent tile
 */
const TILES = [
  { size: 16, pad: 0.06, dilate: 0.25, ink: TAB_INK, ico: true },
  { size: 32, pad: 0.08, dilate: 0.2, ink: TAB_INK, ico: true },
  { size: 48, pad: 0.08, dilate: 0.1, ink: TAB_INK, ico: true },
  { size: 512, pad: 0.12, dilate: 0, ink: TAB_INK, file: "app/icon.png" },
  {
    size: 180,
    pad: 0.12,
    dilate: 0,
    ink: VERSO_INK,
    ground: VERSO_GROUND,
    file: "app/apple-icon.png",
  },
];

/** Centre, plus eight around a circle of radius r. Duplicates cost nothing. */
const stamps = (r) =>
  r < 1
    ? [[0, 0]]
    : [
        [0, 0],
        [r, 0],
        [-r, 0],
        [0, r],
        [0, -r],
        [Math.round(r * 0.71), Math.round(r * 0.71)],
        [Math.round(r * 0.71), -Math.round(r * 0.71)],
        [-Math.round(r * 0.71), Math.round(r * 0.71)],
        [-Math.round(r * 0.71), -Math.round(r * 0.71)],
      ];

async function tile(src, { size, pad, dilate, ink, ground, ico: forIco }) {
  const work = size * SCALE;
  const radius = Math.round(dilate * SCALE);

  // Fit the mark inside the padded box, leaving room for the dilation so a
  // thickened stroke never runs off the edge of the tile.
  const box = Math.round(work * (1 - 2 * pad)) - 2 * radius;
  const mark = await sharp(src)
    .resize({ height: box, width: box, fit: "inside", kernel: "lanczos3" })
    .toBuffer({ resolveWithObject: true });

  const left = Math.round((work - mark.info.width) / 2);
  const top = Math.round((work - mark.info.height) / 2);

  const dilated = await sharp({
    create: { width: work, height: work, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite(
      stamps(radius).map(([dx, dy]) => ({ input: mark.data, left: left + dx, top: top + dy }))
    )
    .png()
    .toBuffer();

  // The silhouette is white. Keep its shape and swap the colour underneath it.
  const inked = await sharp({
    create: { width: work, height: work, channels: 3, background: ink },
  })
    .joinChannel(await sharp(dilated).extractChannel("alpha").raw().toBuffer(), {
      raw: { width: work, height: work, channels: 1 },
    })
    .png()
    .toBuffer();

  // Two pipelines, not one. sharp runs resize before composite whatever order
  // they are written in, so grounding and shrinking in the same chain would
  // shrink the ground to the finished size and then try to land a full-size
  // mark on top of it.
  const full = ground
    ? await sharp({ create: { width: work, height: work, channels: 4, background: ground } })
        .composite([{ input: inked }])
        .png()
        .toBuffer()
    : inked;

  const scaled = sharp(full).resize(size, size, { kernel: "lanczos3" });

  // Left alone sharp reaches for a palette encoding, which Next's ICO decoder
  // refuses ("The PNG is not in RGBA format"). The .ico members are pinned to
  // 8-bit RGBA; the standalone files have no such reader and keep the smaller
  // encoding.
  return forIco
    ? scaled.ensureAlpha().png({ compressionLevel: 9, palette: false }).toBuffer()
    : scaled.png({ compressionLevel: 9, effort: 10 }).toBuffer();
}

/**
 * PNG-in-ICO, written by hand rather than by a dependency.
 *
 * A 6-byte ICONDIR, one 16-byte ICONDIRENTRY per image, then the PNGs. The
 * width and height bytes are 0 for 256, which none of these are.
 */
function ico(images) {
  const HEADER = 6;
  const ENTRY = 16;
  const dir = Buffer.alloc(HEADER + ENTRY * images.length);
  dir.writeUInt16LE(0, 0); // reserved
  dir.writeUInt16LE(1, 2); // 1 = icon
  dir.writeUInt16LE(images.length, 4);

  let offset = dir.length;
  images.forEach(({ size, data }, i) => {
    const at = HEADER + ENTRY * i;
    dir.writeUInt8(size >= 256 ? 0 : size, at);
    dir.writeUInt8(size >= 256 ? 0 : size, at + 1);
    dir.writeUInt8(0, at + 2); // palette size, 0 for truecolour
    dir.writeUInt8(0, at + 3); // reserved
    dir.writeUInt16LE(1, at + 4); // colour planes
    dir.writeUInt16LE(32, at + 6); // bits per pixel
    dir.writeUInt32LE(data.length, at + 8);
    dir.writeUInt32LE(offset, at + 12);
    offset += data.length;
  });

  return Buffer.concat([dir, ...images.map((i) => i.data)]);
}

const src = await readFile(SRC);
const icoParts = [];

for (const spec of TILES) {
  const data = await tile(src, spec);
  if (spec.ico) icoParts.push({ size: spec.size, data });
  if (spec.file) {
    await writeFile(spec.file, data);
    console.log(`${spec.file}  ${spec.size}px  ${(data.length / 1024).toFixed(1)}kB`);
  }
}

const bundle = ico(icoParts);
await writeFile("app/favicon.ico", bundle);
console.log(
  `app/favicon.ico  ${icoParts.map((i) => i.size).join("/")}px  ${(bundle.length / 1024).toFixed(1)}kB`
);
