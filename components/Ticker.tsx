import styles from "./Ticker.module.css";

/** Full turns of the reel before it lands. */
const SPINS = 3;
/** 0-9 repeated, plus one more run so the landing digit is always in range. */
const TAPE = Array.from({ length: (SPINS + 1) * 10 }, (_, i) => i % 10);

/**
 * A number on a reel, the way a mechanical counter shows one.
 *
 * Each digit is its own column of a repeating 0-9 tape, parked on its value.
 * Hovering the card the number sits in spins every column through three full
 * turns and lands back on the same figure, later columns turning for longer, so
 * it settles left to right rather than stopping dead all at once.
 *
 * Pure CSS and no state: the reel's resting offset and its animation both come
 * from the same custom property, so the figure is correct in the HTML, correct
 * with JavaScript disabled, and correct on the frame the animation ends.
 */
export function Ticker({ value, className }: { value: string; className?: string }) {
  let digitIndex = -1;

  return (
    <span className={`${styles.ticker} ${className ?? ""}`}>
      {[...value].map((char, i) => {
        if (!/\d/.test(char)) {
          return (
            <span key={i} className={styles.fixed}>
              {char}
            </span>
          );
        }
        digitIndex += 1;
        return (
          <span
            key={i}
            className={styles.reel}
            style={
              {
                "--target": char,
                "--order": digitIndex,
              } as React.CSSProperties
            }
          >
            <span className={styles.tape}>
              {TAPE.map((d, j) => (
                <span key={j} className={styles.digit}>
                  {d}
                </span>
              ))}
            </span>
          </span>
        );
      })}
    </span>
  );
}
