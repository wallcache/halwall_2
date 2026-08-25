"use client";

import styles from "./DateRoll.module.css";

/**
 * A date arriving the way a calendar does: the days before it flick past and
 * it stops on today.
 *
 * The preceding dates are formatted on the server and passed in rather than
 * derived here. `toLocaleDateString` answers to the machine's timezone, and a
 * component that computed them in the browser would render one set of days on
 * the server and a different set on a reader's machine, which is a hydration
 * mismatch on the one element whose whole job is to be today's date.
 */
export function DateRoll({ days, run }: { days: readonly string[]; run: boolean }) {
  return (
    <span className={styles.window} data-run={run}>
      {/* The real value, in the flow, so the element is the right size before
          anything animates and screen readers get the date and not the reel. */}
      <span className={styles.measure}>{days[days.length - 1]}</span>
      <span className={styles.reel} aria-hidden="true" style={{ ["--rows" as string]: days.length - 1 }}>
        {days.map((d, i) => (
          <span key={i} className={styles.row}>
            {d}
          </span>
        ))}
      </span>
    </span>
  );
}
