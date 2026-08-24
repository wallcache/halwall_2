/**
 * The two hero portraits.
 *
 * The seam wipes between them, so they only work if the face registers across
 * the cut. These numbers are measured off the SOURCE images on a percentage
 * grid, not guessed off an earlier crop — both frames happen to put the face
 * at ~20% of the frame width with the eyeline at ~52% of the height, so one
 * rule aligns them.
 */
import sharp from "sharp";

/** Crop width as a fraction of source width. Lower = tighter. */
const CROP_W = 0.85;
/** Where the eyeline should land in the finished 4:5 frame. */
const EYE_Y = 0.38;

const SOURCES = [
  {
    out: "hal-city",
    src: "/Users/henrywall/Documents/ChatGPT Image Aug 24, 2026, 03_07_46 PM.png",
    faceX: 0.49,
    eyeY: 0.525,
  },
  {
    out: "hal-camp",
    src: "/Users/henrywall/Downloads/design_handoff_halwall_recto_verso/assets/hal-portrait.jpg",
    faceX: 0.52,
    eyeY: 0.53,
  },
];

for (const { out, src, faceX, eyeY } of SOURCES) {
  const buf = await sharp(src).rotate().toBuffer();
  const m = await sharp(buf).metadata();

  const w = Math.round(m.width * CROP_W);
  const h = Math.round((w * 5) / 4);

  const left = Math.max(0, Math.min(m.width - w, Math.round(faceX * m.width - w / 2)));
  const top = Math.max(0, Math.min(m.height - h, Math.round(eyeY * m.height - EYE_Y * h)));

  const info = await sharp(buf)
    .extract({ left, top, width: w, height: Math.min(h, m.height - top) })
    .resize({ width: 1200 })
    .webp({ quality: 82, effort: 6 })
    .toFile(`public/media/portrait/${out}.webp`);

  const landedEye = ((eyeY * m.height - top) / h * 100).toFixed(1);
  console.log(`${out}.webp  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)}KB  eyeline at ${landedEye}%`);
}
