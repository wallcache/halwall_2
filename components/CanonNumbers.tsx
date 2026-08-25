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

/**
 * How long a count-in takes, whatever the size of the figure.
 *
 * Every counter divides its own distance by this, so downloads -- with the best
 * part of a thousand to cover -- ticks about twice a second, while quotes
 * shared, with a dozen, ticks once a minute or so. The five start together and
 * arrive together, and in between almost none of them move on the same beat.
 */
const COUNT_IN_MS = 600_000;

/** How often the counters are looked at. Fine enough for the fastest of them. */
const TICK_MS = 80;

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
    `at` is what the numbers are. Each counter walks to it from wherever it
    happens to be standing: five percent below on arrival, so the count-in shows
    movement rather than a figure that was simply always there, and after that
    from whatever it was reading a moment ago, so a poll ticks the difference
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

  /*
    A mirror of `shown`, so a walk can read where the numbers are without
    listing them as a dependency and restarting itself on every tick it makes.
  */
  const shownRef = useRef(shown);
  useEffect(() => {
    shownRef.current = shown;
  }, [shown]);

  /**
   * When the count-in is due to land. Fixed on the first walk, so a poll that
   * arrives while the numbers are still climbing re-aims them without moving
   * the finish: the reveal takes its ten minutes whatever happens during them.
   */
  const lands = useRef<number | null>(null);

  useEffect(() => {
    if (!run) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(at);
      return;
    }

    const from = shownRef.current;
    const start = performance.now();

    /*
      Whatever is left of the reveal, and once that has passed, the poll's own
      window -- so a figure that moves while the page is open spends its handful
      of ticks before the next set of numbers arrives and starts the walk over.
    */
    lands.current ??= start + COUNT_IN_MS;
    const span = Math.max(lands.current - start, POLL_MS);

    const id = window.setInterval(() => {
      const t = Math.min(1, (performance.now() - start) / span);

      setShown((prev) => {
        const next = { ...prev };
        let moved = false;
        for (const k of Object.keys(next) as (keyof Counts)[]) {
          /*
            Position, not accumulation: each counter is put where the clock says
            it should be. Truncating keeps it short of the real number the whole
            way up -- it walks to the truth, it never invents anything above it
            -- and at t = 1 the arithmetic lands on the figure exactly.
          */
          const v = from[k] + Math.trunc((at[k] - from[k]) * t);
          if (v !== prev[k]) {
            next[k] = v;
            moved = true;
          }
        }
        return moved ? next : prev;
      });

      if (t === 1) window.clearInterval(id);
    }, TICK_MS);

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
