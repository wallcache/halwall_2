"use client";

import { useEffect, useState } from "react";
import { TechIcon } from "./TechIcon";
import { ArrowUpRight } from "./icons";
import styles from "./AppStoreCta.module.css";

/**
 * The App Store link, always within reach on the Canon page.
 *
 * Held back until the reader has scrolled a little: arriving over the masthead
 * would be shouting before anything has been said. After that it stays put, so
 * the invitation is never more than a glance away from wherever they have read
 * to.
 */
export function AppStoreCta({ href }: { href: string }) {
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
      <TechIcon slug="apple" size={20} className={styles.mark} />
      <span className={styles.label}>
        <span className={styles.small}>Download on the</span>
        <span className={styles.big}>App Store</span>
      </span>
      <ArrowUpRight size={14} className={styles.arrow} />
    </a>
  );
}
