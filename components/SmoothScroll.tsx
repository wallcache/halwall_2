"use client";

/**
 * Deliberately empty.
 *
 * This used to mount Lenis. Smooth-scroll libraries interpose an easing curve
 * between the wheel and the page, and that curve is exactly what "laggy, too
 * much friction" describes: every gesture arrives late by design, and the
 * lateness compounds with anything else animating on scroll.
 *
 * Native scrolling is immediate, matches the platform, respects the trackpad's
 * own momentum and costs nothing. The parallax in lib/parallax.ts supplies the
 * depth that Lenis was being asked to supply feel for.
 *
 * The component is kept as a no-op so the layout does not need rewiring if a
 * scroll driver is ever wanted again.
 */
export function SmoothScroll() {
  return null;
}
