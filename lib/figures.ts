import type { Figure } from "@/content/types";

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
