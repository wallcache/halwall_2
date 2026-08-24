"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Preloader.module.css";

const DRAW_AT = 60;
const OPEN_AT = 1150;
const GONE_AT = 2250;

/**
 * The opening.
 *
 * Three beats, no percentage: the seam draws itself, the name sets either side
 * of it, then the two grounds part along that same seam. It is the site's own
 * gesture performed once before you have seen it, so the spread reads as
 * inevitable rather than as a trick when it appears.
 *
 * Two guards matter more than the choreography. rAF does not run in a
 * background tab, so a visitor who opens the site in a new tab and comes back
 * would otherwise find a page frozen mid-animation: `document.hidden`
 * short-circuits straight to done, and every step is on a timeout that fires
 * regardless. An unfinished loader is indistinguishable from a broken site.
 */
export function Preloader() {
  const [drawn, setDrawn] = useState(false);
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const finished = useRef(false);

  useEffect(() => {
    const finish = () => {
      if (finished.current) return;
      finished.current = true;
      setDrawn(true);
      setOpen(true);
      setDone(true);
      document.documentElement.dataset.revealed = "true";
    };

    if (document.hidden || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }

    const timers = [
      window.setTimeout(() => setDrawn(true), DRAW_AT),
      window.setTimeout(() => {
        setOpen(true);
        document.documentElement.dataset.revealed = "true";
      }, OPEN_AT),
      window.setTimeout(() => {
        finished.current = true;
        setDone(true);
      }, GONE_AT),
    ];

    const onHide = () => document.hidden && finish();
    document.addEventListener("visibilitychange", onHide);

    return () => {
      timers.forEach(window.clearTimeout);
      document.removeEventListener("visibilitychange", onHide);
    };
  }, []);

  return (
    <div className={styles.root} data-drawn={drawn} data-open={open} data-done={done} aria-hidden="true">
      <div className={`${styles.half} ${styles.left}`} />
      <div className={`${styles.half} ${styles.right}`} />
      <div className={styles.seam} />
      <div className={styles.name}>
        <p className={styles.word}>
          <span className={styles.hal}>Hal</span>
          <span className={styles.wall}>Wall</span>
        </p>
      </div>
    </div>
  );
}
