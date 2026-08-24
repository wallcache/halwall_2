"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { sideForPath } from "@/lib/gutter";
import styles from "./Preloader.module.css";

/** The name sets, in the engineer's voice, on a dark page. */
const DRAW_AT = 80;
/** The seam leaves the right edge and travels to the middle. */
const SPLIT_AT = 640;
/** Both grounds part and the site is behind them. */
/** The seam travels on to whichever side the page beneath belongs to. */
const OPEN_AT = 1700;
const GONE_AT = 2820;

/**
 * The opening.
 *
 * Three beats. The page arrives entirely dark, with the name set across it in
 * one voice; the seam then travels in from the right edge to the middle,
 * laying the paper ground down behind it and repainting the half of the name
 * it crosses; then both grounds part and the site is underneath.
 *
 * It used to open already split, which meant the site's one gesture -- a seam
 * you move -- was the only thing the loader did not show you. Performing it
 * once, unprompted, is what makes the hero read as inevitable a second later
 * rather than as a trick you have to discover.
 *
 * `data-revealed` on the document is the hand-off. It is what the page beneath
 * waits on before it rises, so the loader lifting and the page arriving are one
 * movement rather than two.
 *
 * Two guards matter more than the choreography. rAF does not run in a
 * background tab, so a visitor who opens the site in a new tab and comes back
 * would otherwise find a page frozen mid-animation: `document.hidden`
 * short-circuits straight to done, and every step is on a timeout that fires
 * regardless. An unfinished loader is indistinguishable from a broken site.
 */
export function Preloader() {
  /*
    The page's own side, so the loader can hand the seam over rather than
    dissolve across it. An interior page is a single ground: /work is dark to
    both edges and /canon is paper to both, so a plate still split down the
    middle has to fade a half-screen rectangle of the wrong colour over the
    content. Moving the seam to the page's own side first makes the plate the
    same colour as what is underneath it, and the fade becomes invisible.

    Read from the path rather than from the live gutter. The gutter does not
    know the answer until the page has mounted and pinned it, and on a slow
    first load the loader got there first and handed /work the paper ground.
  */
  const side = sideForPath(usePathname());
  const [drawn, setDrawn] = useState(false);
  const [split, setSplit] = useState(false);
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const finished = useRef(false);

  useEffect(() => {
    const finish = () => {
      if (finished.current) return;
      finished.current = true;
      setDrawn(true);
      setSplit(true);
      setOpen(true);
      setDone(true);
      document.documentElement.dataset.revealed = "true";
    };

    if (document.hidden || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }

    /*
      Set only once the loader is definitely running. The page is held back by
      `data-revealed="false"`, so writing it during render -- or from an inline
      script -- would hide the page for anyone whose JS never arrives, and a
      blank page is a worse failure than a missing animation.
    */
    document.documentElement.dataset.revealed = "false";

    const timers = [
      window.setTimeout(() => setDrawn(true), DRAW_AT),
      window.setTimeout(() => setSplit(true), SPLIT_AT),
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
    <div
      className={styles.root}
      data-drawn={drawn}
      data-split={split}
      data-open={open}
      data-hand={open ? side : undefined}
      data-done={done}
      aria-hidden="true"
    >
      <div className={`${styles.half} ${styles.paper}`} />
      <div className={`${styles.half} ${styles.ink}`} />

      {/*
        The wordmark twice, in the same two shapes as the hero's: mono "Hal",
        serif "Wall". Only the inking differs between the copies, so the two are
        the same width to the pixel and the seam can cut anywhere across them
        without the halves failing to meet.
      */}
      <div className={styles.name}>
        <p className={`${styles.word} ${styles.wordRecto}`}>
          <span className={styles.hal}>Hal</span>
          <span className={styles.wall}>Wall</span>
        </p>
        <p className={`${styles.word} ${styles.wordVerso}`}>
          <span className={styles.hal}>Hal</span>
          <span className={styles.wall}>Wall</span>
        </p>
      </div>
    </div>
  );
}
