import type { Side } from "./types";

export interface NavItem {
  label: string;
  href: string;
  side: Side;
}

/**
 * The nav is split the way the hero line is split: one half of him is measured
 * in runtime, the other in readers. Work and Making are commissioned output
 * with clients and constraints; Canon and Walking are things he does anyway.
 *
 * Each link is set in its own side's typeface, so the shape of the word tells
 * you which life it belongs to before you have read it.
 */
export const navItems: NavItem[] = [
  { label: "work", href: "/work", side: "verso" },
  { label: "making", href: "/making", side: "verso" },
  { label: "Canon", href: "/canon", side: "recto" },
  { label: "Walking", href: "/walking", side: "recto" },
];

export const versoNav = navItems.filter((i) => i.side === "verso");
export const rectoNav = navItems.filter((i) => i.side === "recto");

/** Which side a route pins the gutter to. Anything unlisted leaves it free. */
export const routeSide: Record<string, Side> = {
  "/work": "verso",
  "/making": "verso",
  "/colophon": "verso",
  "/canon": "recto",
  "/walking": "recto",
};
