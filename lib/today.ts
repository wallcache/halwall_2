import works from "@/content/canon-works.json";

export interface CanonWork {
  date: string;
  title: string;
  author: string;
  year: number;
  type: string;
  language: string;
  day: string | null;
  extract: string | null;
  blurb: string | null;
}

const ALL = works as CanonWork[];

/**
 * Today's work, from the real canon.
 *
 * This is the whole idea of the page: rather than describing an app that
 * serves one work a day, the page serves one. The dataset is the same 366-entry
 * file the app ships, imported on the server only — the browser receives the
 * single chosen work, not four hundred kilobytes of literature.
 */
export function workForDate(d: Date): CanonWork {
  const key = `${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  return ALL.find((w) => w.date === key) ?? ALL[0];
}

export function formatDay(d: Date): string {
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

/** Which day of the year it is, out of 366. The app counts in these terms. */
export function dayOfYear(d: Date): number {
  const start = Date.UTC(d.getFullYear(), 0, 0);
  const now = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
  return Math.floor((now - start) / 86_400_000);
}

export const canonSize = ALL.length;
