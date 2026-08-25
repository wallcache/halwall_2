"use client";

import { useEffect, useState } from "react";
import { Document, ArrowUpRight } from "./icons";
import styles from "./CvCta.module.css";

/**
 * The CV, always within reach on /work.
 *
 * The same standing-invitation pattern as the Canon page's App Store button,
 * inked for the engineer's side instead: dark ground, spring green, mono. The
 * thing a reader of this page most likely wants is the document, and the link
 * to it was at the top of a page that is nine thousand pixels long.
 */
export function CvCta({ href }: { href: string }) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.45);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      className={styles.cta}
      data-shown={shown}
      data-magnetic="0.14"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      // Out of the tab order until it is actually offered.
      tabIndex={shown ? undefined : -1}
      aria-hidden={!shown}
    >
      <Document size={18} className={styles.mark} />
      <span className={styles.label}>
        <span className={styles.small}>One page, up to date</span>
        <span className={styles.big}>The full CV</span>
      </span>
      <ArrowUpRight size={14} className={styles.arrow} />
    </a>
  );
}
