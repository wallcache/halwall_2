export const colophon = {
  type: [
    {
      name: "IBM Plex Mono",
      role: "The verso voice",
      why: "Drawn for terminals. Every number on the engineering side is set in it, with tabular figures so a column of runtimes lines up.",
    },
    {
      name: "IBM Plex Serif",
      role: "The recto voice",
      why: "Drawn for books, from the same superfamily. That is the whole argument: the engineer and the founder of a literature app share a skeleton because they are the same person.",
    },
    {
      name: "IBM Plex Sans",
      role: "Interface",
      why: "Used only where neither voice should be doing the talking.",
    },
  ],
  palette: [
    { name: "Verso ground", value: "#0B0D0F", note: "Cold near-black." },
    { name: "Verso accent", value: "#F0562A", note: "One value, reconciling two oranges the old site kept out of sync." },
    { name: "Recto ground", value: "#FBF8F1", note: "The Daily Canon's own parchment." },
    { name: "Recto accent", value: "#3A5A40", note: "The Canon's green, taken from its codebase rather than invented." },
  ],
  stack: [
    { name: "Next.js 16", note: "App Router, Turbopack, React 19." },
    { name: "No animation library", note: "The gutter and the counters are driven by a forty-line rAF tween. GSAP is excellent and would earn its weight if this site used ScrollTrigger or SplitText; it does not, so it is not here." },
    { name: "Lenis 1.3", note: "Smooth scroll, imported after paint and skipped entirely on coarse pointers and for reduced motion." },
    { name: "Tailwind 4.3 + CSS Modules", note: "Tokens and utilities; modules for anything bespoke." },
    { name: "sharp", note: "Build-time image pipeline. 267MB of source became 61MB of WebP." },
  ],
  decisions: [
    {
      q: "Why is the site two colours at once?",
      a: "Because he is two things at once, and picking one would have been a lie of omission. The split is the design rather than a compromise between two of them.",
    },
    {
      q: "Why no WebGL?",
      a: "The signature moment is a clip-path and a number. A shader would have cost the mobile budget and bought nothing the concept needed. Lando Norris has helmets; Hal has photographs and a dog.",
    },
    {
      q: "Why is the seam driven by the menu?",
      a: "A drag nobody is told about is a gimmick with a usability tax. Binding the split to nav hover and keyboard focus means you find it by using the site normally. The drag is still there for anyone who wants it.",
    },
    {
      q: "Why is there no /writing?",
      a: "Because there is nothing in it yet. The old site advertised the route in its sitemap and served a 404. An empty section is worse than an absent one.",
    },
  ],
  budget: [
    { metric: "Homepage JS", target: "185KB gzipped — of which ~175KB is the React 19 and Next 16 runtime floor. Site code is roughly 10KB." },
    { metric: "Animation library", target: "None. Removing GSAP took 48KB off every route." },
    { metric: "LCP element", target: "HTML or next/image, never a canvas" },
    { metric: "Lighthouse mobile performance", target: "≥ 90" },
    { metric: "Lighthouse accessibility", target: "100" },
    { metric: "Animated properties", target: "transform, opacity, clip-path and filter only — nothing that forces layout" },
    { metric: "Images", target: "267MB of source became 61MB of WebP, served as AVIF where supported" },
  ],
} as const;
