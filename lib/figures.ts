import type { Figure } from "@/content/types";

/**
 * How far below the true figure a live counter starts.
 *
 * Each counter then covers its own distance over the same ten minutes, so the
 * five of them arrive together however far apart they set off, and a figure
 * with a thousand to make up moves visibly faster than one with a dozen. Which
 * is worth being blunt about: ten minutes is longer than anyone reads a page
 * for, so in practice the figures on screen are low ones -- downloads by about
 * a thousand at the start -- and the true count is a thing the band is walking
 * towards rather than a thing it shows you. The alternative -- ticking past the
 * true count to keep the movement going -- would be inventing readers, so this
 * errs downward on purpose.
 *
 * Lives here rather than beside the fetching, because the component that needs
 * it runs in the browser and lib/canon-stats is server-only: importing a value
 * from it across that boundary fails the build, though importing a type from
 * it is fine, since types are erased.
 */
export const COUNT_IN_FROM = 0.95;

/** The shape `resolve` needs. Kept structural so this file stays client-safe. */
export interface LiveCounts {
  accounts: number;
  downloads: number;
}

/**
 * Swaps the live sources into a figure. Content declares *which* number a
 * figure is rather than carrying a copy of it, so the same figure can be
 * written once and rendered on the homepage, /canon and /work alike.
 *
 * Pure and free of `server-only`, so client components can call it with counts
 * handed down as props.
 */
export function resolveFigure<T extends Figure>(figure: T, counts: LiveCounts): T {
  if (!figure.live) return figure;
  return { ...figure, value: counts[figure.live] };
}

export function resolveFigures<T extends Figure>(
  figures: readonly T[],
  counts: LiveCounts,
): T[] {
  return figures.map((f) => resolveFigure(f, counts));
}
