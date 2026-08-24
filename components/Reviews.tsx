import { reviews } from "@/content/canon-reviews";
import { TechIcon } from "./TechIcon";
import styles from "./Reviews.module.css";

const STAR = "m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.9L12 17.8 5.8 21l1.2-6.9-5-4.9 6.9-1z";

const Star = ({ size = 11 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d={STAR} />
  </svg>
);

/**
 * A rating drawn to its real value.
 *
 * 4.8 is not five stars. The filled row is clipped to the exact fraction over
 * a hollow row underneath, so the last star reads four-fifths full rather than
 * being rounded up into a claim the App Store does not make.
 */
export function Rating({ value, size = 13 }: { value: number; size?: number }) {
  /*
    The clip is measured, not estimated. A flat value/5 percentage includes the
    gaps between stars, so the cut lands slightly off where the partial star
    actually begins. Whole stars plus their gaps plus a fraction of the next
    star is the real width, and it stays correct at any size.

    At small sizes 4.8 and 5 look nearly identical regardless — that is honest,
    since they nearly are — which is why the numeral sits beside it.
  */
  const GAP = 1.6; // 0.1rem, matching the stylesheet
  const whole = Math.floor(value);
  const frac = value - whole;
  const width = whole * size + whole * GAP + frac * size;
  return (
    <span className={styles.rating} role="img" aria-label={`${value} out of 5 stars`}>
      <span className={styles.ratingTrack} aria-hidden="true">
        {Array.from({ length: 5 }, (_, i) => (
          <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
            <path d={STAR} />
          </svg>
        ))}
      </span>
      <span className={styles.ratingFill} style={{ width: `${width}px` }} aria-hidden="true">
        {/* Inner row at natural width. Without it flex shrinks the five stars
            to fit the clip box, so 4.8 renders as five whole stars — the exact
            rounding this component exists to avoid. */}
        <span className={styles.ratingFillInner}>
          {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} size={size} />
          ))}
        </span>
      </span>
    </span>
  );
}

/**
 * App Store reviews as a slow marquee.
 *
 * The track holds the list twice and translates exactly -50%, so the loop
 * point falls where the two halves meet and is invisible. It pauses on hover
 * and on focus-within, so nobody has to read a moving target. Under reduced
 * motion the drift is dropped entirely and it becomes a row you scroll.
 *
 * The duplicated half is aria-hidden: it is the same ten reviews, and a screen
 * reader should hear them once.
 */
export function Reviews() {
  return (
    <div className={styles.wrap}>
      <div className={styles.track}>
        {[0, 1].map((pass) => (
          <div key={pass} className={styles.track} style={{ animation: "none", padding: 0 }} aria-hidden={pass === 1}>
            {reviews.map((r) => (
              <figure key={`${pass}-${r.name}`} className={styles.card}>
                <span className={styles.stars} aria-label="Five stars">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} />
                  ))}
                </span>
                <blockquote className={styles.text}>{r.text}</blockquote>
                <figcaption className={styles.name}>
                  <TechIcon slug="apple" size={11} />
                  {r.name}
                </figcaption>
              </figure>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
