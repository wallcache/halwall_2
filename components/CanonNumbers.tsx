"use client";

import { useEffect, useRef, useState } from "react";
import type { CanonStats } from "@/lib/canon-stats";
import { CountUp } from "./CountUp";
import styles from "./CanonNumbers.module.css";

/**
 * The app, counted.
 *
 * Every figure here except downloads is an exact row count from the Canon's
 * own database, read when the page was last generated. They are the app being
 * used rather than claims about it: works actually finished, blurbs actually
 * opened, quotes actually shared.
 *
 * The quote is the most recent card a reader made. It is the one number on the
 * page you can see the inside of.
 */
export function CanonNumbers({ stats }: { stats: CanonStats }) {
  const ref = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRun(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect(); // Counts once.
        setRun(true);
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const figures = [
    { value: stats.downloads, label: "downloads", note: "estimated from accounts" },
    { value: stats.finished, label: "works finished", note: "logged by readers" },
    { value: stats.blurbs, label: "blurbs read", note: "the writing behind the work" },
    { value: stats.saves, label: "saved to a list", note: "kept for later" },
    { value: stats.shares, label: "quotes shared", note: "cards made in the app" },
  ];

  return (
    <div ref={ref} className={styles.wrap}>
      <ul className={styles.grid}>
        {figures.map((f) => (
          <li key={f.label} className={styles.stat}>
            <span className={styles.value}>
              <CountUp figure={{ value: f.value, label: f.label }} run={run} />
            </span>
            <span className={styles.label}>{f.label}</span>
            <span className={styles.note}>{f.note}</span>
          </li>
        ))}
      </ul>

      {stats.latestQuote && (
        <figure className={styles.card}>
          <figcaption className={styles.cardHead}>
            The most recent quote card a reader made
          </figcaption>
          <blockquote className={styles.quote}>
            &ldquo;{stats.latestQuote.quote}&rdquo;
          </blockquote>
          <p className={styles.attrib}>
            <cite className={styles.work}>{stats.latestQuote.workTitle}</cite>
            {stats.latestQuote.workAuthor && (
              <span className={styles.author}>{stats.latestQuote.workAuthor}</span>
            )}
          </p>
        </figure>
      )}
    </div>
  );
}
