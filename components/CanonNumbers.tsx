"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { CanonStats } from "@/lib/canon-stats";
import { COUNT_IN_FROM } from "@/lib/figures";
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
type Counts = Pick<CanonStats, "downloads" | "finished" | "blurbs" | "saves" | "shares">;

/** How often to ask the route for a fresh set. */
const POLL_MS = 45_000;

export function CanonNumbers({ stats }: { stats: CanonStats }) {
  const ref = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(false);

  const seed: Counts = {
    downloads: stats.downloads,
    finished: stats.finished,
    blurbs: stats.blurbs,
    saves: stats.saves,
    shares: stats.shares,
  };

  /*
    `at` is what the numbers are; `from` is where each counter should start its
    next run. On arrival that is a tenth below, so the count-in shows movement
    rather than a figure that was simply always there. After a poll it is
    whatever the number was a moment ago, so the counter ticks the difference
    rather than replaying the whole reveal.
  */
  const [{ at }, setCounts] = useState<{ at: Counts }>(() => ({ at: seed }));

  /*
    What is on screen, which starts a little under the truth and walks up to
    it a digit at a time. The band is a set of numbers that are genuinely
    moving, and a figure that is simply present when you arrive says nothing
    about that; one you can watch tick says it without a word of copy.
  */
  const [shown, setShown] = useState<Counts>(() =>
    Object.fromEntries(
      Object.entries(seed).map(([k, v]) => [k, Math.round(v * COUNT_IN_FROM)]),
    ) as Counts,
  );

  useEffect(() => {
    if (!run) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(at);
      return;
    }

    // One per second per figure, and never past the real number: this walks up
    // to the truth, it does not invent anything above it.
    const id = window.setInterval(() => {
      setShown((prev) => {
        const next = { ...prev };
        let moved = false;
        for (const k of Object.keys(next) as (keyof Counts)[]) {
          if (next[k] < at[k]) {
            next[k] = next[k] + 1;
            moved = true;
          } else if (next[k] > at[k]) {
            next[k] = at[k];
            moved = true;
          }
        }
        return moved ? next : prev;
      });
    }, 1000);

    return () => window.clearInterval(id);
  }, [run, at]);

  const poll = useCallback(async () => {
    try {
      const res = await fetch("/api/canon-stats");
      if (!res.ok) return;
      const next = (await res.json()) as Counts;
      setCounts((prev) => {
        // Nothing moved; leave the counters alone rather than re-running them.
        const changed = (Object.keys(prev.at) as (keyof Counts)[]).some(
          (k) => Number.isFinite(next[k]) && next[k] !== prev.at[k],
        );
        return changed ? { at: { ...prev.at, ...next } } : prev;
      });
    } catch {
      // A poll that fails leaves the last good figures on the page.
    }
  }, []);

  useEffect(() => {
    if (!run) return;
    const id = window.setInterval(poll, POLL_MS);
    return () => window.clearInterval(id);
  }, [run, poll]);

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
    { key: "downloads" as const, label: "downloads", note: "iOS and the web" },
    { key: "finished" as const, label: "works finished", note: "logged by readers" },
    { key: "blurbs" as const, label: "blurbs read", note: "the writing behind the work" },
    { key: "saves" as const, label: "saved to a list", note: "kept for later" },
    { key: "shares" as const, label: "quotes shared", note: "cards made in the app" },
  ];

  return (
    <div ref={ref} className={styles.wrap}>
      <ul className={styles.grid}>
        {figures.map((f) => (
          <li key={f.label} className={styles.stat}>
            <span className={styles.value}>{shown[f.key].toLocaleString("en-GB")}</span>
            <span className={styles.label}>{f.label}</span>
            <span className={styles.note}>{f.note}</span>
          </li>
        ))}
      </ul>

      {stats.latestQuote && (
        <figure className={styles.card}>
          {stats.latestQuote.cardUrl && (
            /*
              The card is cropped, and not for composition.

              The app prints "shared by <full name>" along the foot of every
              card it renders. Showing the image whole would have published the
              name that the caption below it goes to the trouble of redacting,
              which is worse than not redacting it at all. The frame clips the
              footer off.
            */
            <span className={styles.cardFrame}>
              <Image
                className={styles.cardImage}
                src={stats.latestQuote.cardUrl}
                alt={`A shared card of a line from ${stats.latestQuote.workTitle}`}
                width={1080}
                height={1350}
                unoptimized
              />
              <span className={styles.cardMask} aria-hidden="true" />
            </span>
          )}

          <div className={styles.cardBody}>
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

            {stats.latestQuote.initial && (
              <p className={styles.reader}>
                {stats.latestQuote.avatarUrl && (
                  <Image
                    className={styles.avatar}
                    src={stats.latestQuote.avatarUrl}
                    alt=""
                    aria-hidden="true"
                    width={64}
                    height={64}
                    unoptimized
                  />
                )}
                <span className={styles.who}>
                  <span aria-hidden="true">{stats.latestQuote.initial}</span>
                  {/*
                    Placeholder glyphs, not the name. The server sends the
                    initial and a length; the rest of it is never in the page.
                  */}
                  <span className={styles.redacted} aria-hidden="true">
                    {"\u2022".repeat(stats.latestQuote.hidden)}
                  </span>
                  <span className="sr-only">A reader</span>
                </span>
              </p>
            )}
          </div>
        </figure>
      )}
    </div>
  );
}
