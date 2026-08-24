"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Preloader.module.css";

const DURATION = 1500;
const LABELS = ["assembling the spread", "setting both voices", "ready"];

/** Fast start, long settle — the same curve the gutter uses. */
const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

/**
 * The preloader.
 *
 * Two guards matter more than the animation. rAF does not fire in a
 * background tab, so a visitor who opens the site in a new tab and comes back
 * a minute later would find a page frozen at 3% — `document.hidden`
 * short-circuits straight to done, and a timeout backstops the whole thing in
 * case rAF never runs at all. An unfinished preloader is indistinguishable
 * from a broken site.
 */
export function Preloader() {
  const [pct, setPct] = useState(0);
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const finished = useRef(false);

  useEffect(() => {
    const finish = () => {
      if (finished.current) return;
      finished.current = true;
      setPct(100);
      setOpen(true);
      document.documentElement.dataset.revealed = "true";
      window.setTimeout(() => setDone(true), 1300);
    };

    if (document.hidden || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }

    const start = performance.now();
    let frame = requestAnimationFrame(function step(now) {
      const t = Math.min(1, (now - start) / DURATION);
      setPct(Math.round(easeOutExpo(t) * 100));
      if (t < 1) frame = requestAnimationFrame(step);
      else finish();
    });

    const backstop = window.setTimeout(finish, DURATION + 900);
    const onHide = () => document.hidden && finish();
    document.addEventListener("visibilitychange", onHide);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(backstop);
      document.removeEventListener("visibilitychange", onHide);
    };
  }, []);

  const label = pct < 55 ? LABELS[0] : pct < 100 ? LABELS[1] : LABELS[2];

  return (
    <div className={styles.root} data-open={open} data-done={done} aria-hidden="true">
      <div className={`${styles.curtain} ${styles.left}`} />
      <div className={`${styles.curtain} ${styles.right}`} />
      <div className={styles.center}>
        <p className={styles.pct}>{pct}</p>
        <div className={styles.rule}>
          <div className={styles.fill} style={{ width: `${pct}%` }} />
        </div>
        <p className={styles.label}>{label}</p>
      </div>
    </div>
  );
}
