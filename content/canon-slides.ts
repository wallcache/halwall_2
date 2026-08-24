export interface Slide {
  src: string;
  /** The headline set into the slide artwork. It doubles as the alt text. */
  caption: string;
}

/**
 * The App Store slides.
 *
 * Captions were read off the artwork itself rather than assumed from filenames
 * — the file order is not the order the slides argue in. Sequenced here so the
 * strip opens on the daily promise and closes on the reason for it.
 */
export const slides: Slide[] = [
  { src: "/media/canon/slide-08.webp", caption: "Discover great literature, every day. Featured on the App Store." },
  { src: "/media/canon/slide-01.webp", caption: "Thousands of worlds, animated by hand." },
  { src: "/media/canon/slide-09.webp", caption: "Not only the blurb. The book." },
  { src: "/media/canon/slide-02.webp", caption: "Every book gets its own weather. Suggested sounds, or mix your own reading ambience." },
  { src: "/media/canon/slide-06.webp", caption: "A personal librarian, your own literary companion." },
  { src: "/media/canon/slide-05.webp", caption: "Build your canon. Rank your favourites." },
  { src: "/media/canon/slide-04.webp", caption: "A daily streak worth keeping." },
  { src: "/media/canon/slide-03.webp", caption: "Lost? Take a path, or join other readers." },
  { src: "/media/canon/slide-10.webp", caption: "Interrupt the doomscroll." },
  { src: "/media/canon/slide-07.webp", caption: "A lifetime of literature, one day at a time." },
];
