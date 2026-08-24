"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./PageIndex.module.css";

export interface IndexEntry {
  /** The id of the section heading this entry points at. */
  id: string;
  label: string;
}

/** Where on screen a section counts as the one you are reading. */
const READING_LINE = 0.34;

/**
 * A live index of the page, pinned beside the reading column: which section
 * you are in, and how far through the page that is.
 *
 * Position is read from the sections' own rects on scroll rather than from an
 * IntersectionObserver. An observer fires on the *edges* of a section, so a
 * section taller than the viewport stops reporting while you are in the middle
 * of it, which is exactly when you most want to know where you are.
 */
export function PageIndex({ entries }: { entries: readonly IndexEntry[] }) {
  const [active, setActive] = useState(entries[0]?.id ?? "");
  const [progress, setProgress] = useState(0);
  const frame = useRef(0);

  useEffect(() => {
    const read = () => {
      frame.current = 0;
      const line = window.innerHeight * READING_LINE;

      let current = entries[0]?.id ?? "";
      for (const entry of entries) {
        const el = document.getElementById(entry.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= line) current = entry.id;
      }
      setActive(current);

      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0);
    };

    const onScroll = () => {
      if (frame.current) return;
      frame.current = requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [entries]);

  return (
    <nav className={styles.rail} aria-label="On this page">
      <ol className={styles.list}>
        {entries.map((entry) => (
          <li key={entry.id}>
            <a
              href={`#${entry.id}`}
              className={styles.entry}
              data-active={active === entry.id}
              // The bar is the only thing marking position, so it needs the
              // state said out loud rather than drawn.
              aria-current={active === entry.id ? "true" : undefined}
            >
              <span className={styles.rule} aria-hidden="true" />
              <span className={styles.label}>{entry.label}</span>
            </a>
          </li>
        ))}
      </ol>

      <div className={styles.progress} aria-hidden="true">
        <span className={styles.progressFill} style={{ scale: `1 ${progress}` }} />
      </div>
    </nav>
  );
}
