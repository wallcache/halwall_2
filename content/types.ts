/**
 * Shared content types.
 *
 * Two things here exist because the previous content layer lacked them:
 * every addressable item carries a `slug`, and every headline number is a
 * structured `Figure` rather than a display string like "270 → 45". Counters
 * animate from the data, so no page has to re-declare its own targets.
 */

export type Side = "verso" | "recto";

export interface Figure {
  /** The number the counter lands on. */
  value: number;
  /** Where the counter starts, when the story is a reduction (270 → 45). */
  from?: number;
  prefix?: string;
  suffix?: string;
  unit?: string;
  /** What the number means, in as few words as possible. */
  label: string;
  /**
   * Names a figure whose value is counted at request time rather than written
   * here. Content declares which number it is; `lib/figures` fills it in.
   */
  live?: "downloads" | "accounts";
  /**
   * Opts out of the count-up. A rating is not a quantity that accumulates, and
   * animating 4.8 from zero spends most of a second displaying 3.1, then 4.4:
   * numbers that are simply wrong, and legible enough to be read as the answer.
   */
  count?: false;
}

export interface Link {
  url: string;
  text: string;
}
