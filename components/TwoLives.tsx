"use client";

import Link from "next/link";
import { bio } from "@/content/identity";
import { useGutter } from "@/lib/gutter";
import { Parallax } from "./Parallax";
import styles from "./TwoLives.module.css";

/**
 * The long bio, moved out of the masthead.
 *
 * It used to fold open inside the hero, which meant it was clipped mid-sentence
 * by a max-height at exactly the moment someone wanted to read it. A masthead
 * should not also be a body-copy container: this is the "and here is more"
 * that sits one scroll below it.
 */
export function TwoLives() {
  const { mode, commit, release } = useGutter();

  return (
    // The section answers to the same gutter as the hero, so committing to a
    // side upstairs is still in force by the time you have read this far.
    <section className={styles.section} aria-label="About" data-mode={mode}>
      <Parallax className={styles.half} speed={0.05} fade>
        <div
          data-side="verso"
          style={{ display: "contents" }}
          onMouseEnter={() => commit("verso")}
          onMouseLeave={release}
        >
          <p className={styles.eyebrow}>Measured in runtime</p>
          <p className={styles.body}>{bio.verso}</p>
          <Link href="/work" className={styles.link}>
            The engineering <span className={styles.arrow} aria-hidden="true">→</span>
          </Link>
        </div>
      </Parallax>

      <Parallax className={styles.half} speed={0.11} fade>
        <div
          data-side="recto"
          style={{ display: "contents" }}
          onMouseEnter={() => commit("recto")}
          onMouseLeave={release}
        >
          <p className={styles.eyebrow}>Measured in readers</p>
          <p className={styles.body}>{bio.recto}</p>
          <Link href="/canon" className={styles.link}>
            The Daily Canon <span className={styles.arrow} aria-hidden="true">→</span>
          </Link>
        </div>
      </Parallax>
    </section>
  );
}
