/**
 * The two hero portraits.
 *
 * These frames arrive already registered — same framing, same eyeline, same
 * 3:4 aspect — so there is deliberately no crop, shift or zoom here. The
 * earlier version of this script measured face positions and corrected for
 * them; that machinery is gone because correcting an aligned pair can only
 * misalign it.
 *
 * The hero container is 3:4 to match, so `object-fit: cover` has nothing to
 * trim and the full frame is shown.
 */
import sharp from "sharp";

const SOURCES = [
  { out: "hal-city", src: "/Users/henrywall/Desktop/ME/box.jpg" },
  { out: "hal-camp", src: "/Users/henrywall/Desktop/ME/meee.jpg" },
];

for (const { out, src } of SOURCES) {
  const info = await sharp(src)
    .rotate()
    .resize({ width: 1400, withoutEnlargement: true })
    .webp({ quality: 84, effort: 6 })
    .toFile(`public/media/portrait/${out}.webp`);

  const ratio = (info.width / info.height).toFixed(4);
  console.log(
    `${out}.webp  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)}KB  aspect ${ratio}`,
  );
}
