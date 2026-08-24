import { slidePaths } from "./media";

export interface Slide {
  src: string;
  /** The headline set into the slide artwork. It doubles as the alt text. */
  caption: string;
}

/**
 * The App Store slides, in the order they run on the listing.
 *
 * Paths come from the generated manifest because the filenames are
 * content-hashed — see scripts/build-media.mjs. Order is the numeric order of
 * the export folder, so 10 lands last rather than second.
 */
const CAPTIONS = [
  "Discover great literature, every day. Featured on the App Store.",
  "Not only the blurb. The book.",
  "Interrupt the doomscroll.",
  "Thousands of worlds, animated by hand.",
  "Every book gets its own weather. Suggested sounds, or mix your own reading ambience.",
  "Lost? Take a path, or join other readers.",
  "A daily streak worth keeping.",
  "Build your canon. Rank your favourites.",
  "A personal librarian, your own literary companion.",
  "A lifetime of literature, one day at a time.",
];

export const slides: Slide[] = slidePaths.map((src, i) => ({
  src,
  caption: CAPTIONS[i] ?? "The Daily Canon on iOS.",
}));
