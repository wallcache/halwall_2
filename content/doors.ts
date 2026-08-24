import type { Side } from "./types";
import { tdcIcon } from "./media";

export interface Door {
  href: string;
  label: string;
  title: string;
  line: string;
  meta: string;
  side: Side;
  /** Full-bleed photograph behind the card. */
  image?: string;
  /** An app icon instead of a photograph, for the one door that is a product. */
  mark?: string;
  /** A number instead of either, for the one door whose subject is not visual. */
  figure?: string;
}

/**
 * Below the fold the site goes quiet. The collision is the hero; these are
 * four generous cards whose only job is that every part of the site is
 * reachable from the front door -- which is the entire reason for the rebuild.
 *
 * Every card carries an image now. Two of the four used to be type on a flat
 * ground, sitting next to two that were not, so the set read as unfinished
 * rather than as restrained.
 */
export const doors: Door[] = [
  {
    href: "/work",
    label: "01",
    title: "The engineering",
    line: "Entity resolution across millions of records, a 30,000-line pipeline taken apart, and the CV as a page rather than a download.",
    meta: "3 case studies \u00b7 full CV",
    side: "verso",
    // No photograph. Pipelines do not photograph, and a stock city at night
    // standing in for them is a picture of nothing in particular. The number
    // the work is remembered by does the job instead.
    figure: "300\u00d7",
  },
  {
    href: "/canon",
    label: "02",
    title: "The Daily Canon",
    line: "One carefully chosen work of literature every day, on iOS and the web. Featured on the App Store.",
    meta: "iOS + web \u00b7 App Store featured",
    side: "recto",
    // The one door that is a shipped product, so it gets its own mark rather
    // than a photograph of something else.
    mark: tdcIcon,
  },
  {
    href: "/making",
    label: "03",
    title: "Making",
    line: "Photography as an exercise in attention, twelve brand identities, and eight years of motion work.",
    meta: "77 photographs \u00b7 12 identities \u00b7 10 films",
    side: "recto",
    image: "/media/photography/landscape/autumn-trees-rainbow.webp",
  },
  {
    href: "/walking",
    label: "04",
    title: "Walking",
    line: "Ninety-six miles from Milngavie to Fort William, a wildcamp under Pen y Fan, and a Wirehaired Vizsla named after a Kerouac character.",
    meta: "2 journals \u00b7 106 miles",
    side: "recto",
    image: "/media/walking/hal-and-japhy.webp",
  },
];
