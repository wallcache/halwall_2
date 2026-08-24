/** Motion. 10 After Effects pieces. `posterTime` is the seek offset for the still frame. */

export interface MotionPiece {
  slug: string;
  name: string;
  videoSrc: string;
  posterTime: number; // seconds - frame to show as thumbnail (when logo is complete)
  aspectRatio?: "video" | "square"; // default is "video" (16:9)
}

export const motionPieces: MotionPiece[] = [
  { slug: "cothill-house", name: "Cothill House", videoSrc: "/media/motion/cothill-house-animation.mp4", posterTime: 5.5 },
  { slug: "creative-solutions", name: "Creative Solutions", videoSrc: "/media/motion/creative-solutions.mp4", posterTime: 7 },
  { slug: "hundred-hills", name: "Hundred Hills", videoSrc: "/media/motion/hundred-hills.mp4", posterTime: 4 },
  { slug: "sjsc", name: "SJSC", videoSrc: "/media/motion/sjsc.mp4", posterTime: 4 },
  { slug: "sushi", name: "Sushi", videoSrc: "/media/motion/sushi.mp4", posterTime: 9.5 },
  { slug: "terrier-beer-scribble-intro", name: "Terrier Beer - Scribble Intro", videoSrc: "/media/motion/terrier-beer-scribble-intro.mp4", posterTime: 9 },
  { slug: "terrier-beer", name: "Terrier Beer", videoSrc: "/media/motion/terrier-beer.mp4", posterTime: 3.5 },
  { slug: "tiny-studios-fun-animation", name: "Tiny Studios - Fun Animation", videoSrc: "/media/motion/tiny-studios-fun-animation.mp4", posterTime: 12, aspectRatio: "square" },
  { slug: "tiny-studios-website-intro", name: "Tiny Studios - Website Intro", videoSrc: "/media/motion/tiny-studios-website-intro.mp4", posterTime: 5 },
  { slug: "wallcache", name: "Wallcache", videoSrc: "/media/motion/wallcache-animations.mp4", posterTime: 7 },
];

export const motionCount = motionPieces.length;
