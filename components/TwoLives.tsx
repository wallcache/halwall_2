"use client";

import Link from "next/link";
import { bio } from "@/content/identity";
import { useGutter } from "@/lib/gutter";
import styles from "./TwoLives.module.css";

/**
 * The long bio, moved out of the masthead.
 *
 * It used to fold open inside the hero and get clipped mid-sentence by a
 * max-height at exactly the moment someone wanted to read it. Here it has room,
 * and it answers to the same gutter: commit to a side upstairs and that side
 * takes the full width down here.
 */
const HALVES = [
  {
    side: "verso" as const,
    eyebrow: "Measured in runtime",
    body: bio.verso,
    href: "/work",
    label: "The engineering",
  },
  {
    side: "recto" as const,
    eyebrow: "Measured in readers",
    body: bio.recto,
    href: "/canon",
    label: "The Daily Canon",
  },
];

export function TwoLives() {
  const { mode, commit, release } = useGutter();

  return (
    <section className={styles.section} aria-label="About" data-mode={mode}>
      {HALVES.map((half) => (
        <div
          key={half.side}
          className={styles.half}
          data-side={half.side}
          onMouseEnter={() => commit(half.side)}
          onMouseLeave={release}
          // Hidden from the reading order once its column has closed.
          inert={
            (mode === "verso" && half.side === "recto") ||
            (mode === "recto" && half.side === "verso")
          }
        >
          <div className={styles.inner}>
            <p className={styles.eyebrow}>{half.eyebrow}</p>
            <p className={styles.body}>{half.body}</p>
            <Link href={half.href} className={styles.link} data-magnetic="0.225">
              {half.label} <span className={styles.arrow} aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      ))}
    </section>
  );
}
