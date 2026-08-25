import type { Figure } from "@/content/types";

/**
 * How far below the true figure a live counter starts.
 *
 * The counter then walks up at one a second. Which is worth being clear about:
 * at five percent short, the download figure is about a thousand below the
 * real one and takes a quarter of an hour of walking to arrive, so most
 * visitors see a number that is low. The alternative -- ticking past the true
 * count to keep the movement going -- would be inventing readers, so this
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
