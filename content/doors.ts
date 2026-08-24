import type { Side } from "./types";

export interface Door {
  href: string;
  label: string;
  title: string;
  line: string;
  meta: string;
  side: Side;
  image?: string;
}

/**
 * Below the fold the site goes quiet. The collision is the hero; these are
 * four calm, generous cards whose only job is that every part of the site is
 * reachable from the front door — which is the entire reason for the rebuild.
 */
export const doors: Door[] = [
  {
    href: "/work",
    label: "01",
    title: "The engineering",
    line: "Entity resolution across millions of records, a 30,000-line pipeline taken apart, and the CV as a page rather than a download.",
    meta: "3 case studies · full CV",
    side: "verso",
  },
  {
    href: "/canon",
    label: "02",
    title: "The Daily Canon",
    line: "One carefully chosen work of literature for each day of the year, on iOS and the web. An App Store App of the Day.",
    meta: "366 works · iOS + web",
    side: "recto",
  },
  {
    href: "/making",
    label: "03",
    title: "Making",
    line: "Photography as an exercise in attention, twelve brand identities, and eight years of motion work.",
    meta: "77 photographs · 12 identities · 10 films",
    side: "recto",
    image: "/media/photography/landscape/moorland-hikers-mist.webp",
  },
  {
    href: "/walking",
    label: "04",
    title: "Walking",
    line: "Ninety-six miles from Milngavie to Fort William, a wildcamp under Pen y Fan, and a Wirehaired Vizsla named after a Kerouac character.",
    meta: "2 journals · 106 miles",
    side: "recto",
    image: "/media/walking/hal-and-japhy.webp",
  },
];
