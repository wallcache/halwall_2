import type { Side } from "./types";

export interface NavItem {
  label: string;
  href: string;
  side: Side;
}

/**
 * The nav is split the way the hero line is split: one half of him is measured
 * in runtime, the other in readers.
 *
 * Making sits on the recto with the Canon and the walking journals. It is the
 * photography, the identity work and the motion — the things made because he
 * wanted to make them — so it belongs to the warm, light half of the site
 * rather than the engineering half, whatever the client list says.
 *
 * Each link is set in its own side's typeface, so the shape of the word tells
 * you which life it belongs to before you have read it.
 */
export const navItems: NavItem[] = [
  { label: "work", href: "/work", side: "verso" },
  { label: "Canon", href: "/canon", side: "recto" },
  { label: "Making", href: "/making", side: "recto" },
  { label: "Walking", href: "/walking", side: "recto" },
];

export const versoNav = navItems.filter((i) => i.side === "verso");
export const rectoNav = navItems.filter((i) => i.side === "recto");

/** Which side a route pins the gutter to. Anything unlisted leaves it free. */
export const routeSide: Record<string, Side> = {
  "/work": "verso",
  "/canon": "recto",
  "/making": "recto",
  "/walking": "recto",
};
