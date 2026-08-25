"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { CanonWork } from "@/lib/today";
import { tdcIcon } from "@/content/media";
import { DateRoll } from "./DateRoll";
import { Scramble } from "./Scramble";
import styles from "./TodayPhone.module.css";

/**
 * Today, in the app.
 *
 * A phone showing the work The Daily Canon is actually serving today, read
 * from the same dataset the app ships. It boots when it scrolls into view: the
 * loading screen clears, then the day view staggers in, which is the sequence
 * a reader sees every morning.
 *
 * The blurb is deliberately withheld. Printing the editorial in full here
 * gives away the one thing the app exists to hand you, so its place is kept
 * and left as redacted lines with an invitation to open the app. The work, the
 * date and the reason that date was chosen are enough to make the point.
 */
export function TodayPhone({
  work,
  date,
  days,
  href,
}: {
  work: CanonWork;
  date: string;
  /** Today and the days before it, formatted on the server. See DateRoll. */
  days: readonly string[];
  href: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [booting, setBooting] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setBooting(true);
      setLoaded(true);
      return;
    }

    let timer = 0;

    /*
      A backstop, for the same reason the preloader has one: this content
      starts at opacity 0 and is revealed by an observer, so anything that
      stops the observer firing leaves the phone permanently blank.

      Twelve seconds, not three. At three it fired while the section was still
      a thousand pixels below the fold on almost every visit, so the phone had
      already slid up and the date had already flicked through by the time
      anyone scrolled to it -- the animation played to an empty room. This is
      long enough to stay out of the way of a normal read and short enough that
      a broken observer is still only a pause.
    */
    const backstop = window.setTimeout(() => {
      setBooting(true);
      setLoaded(true);
    }, 12000);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        // Plays once. A phone that reboots every time it re-enters the
        // viewport is a distraction, not a demonstration.
        io.disconnect();
        setBooting(true);
        timer = window.setTimeout(() => setLoaded(true), 1150);
      },
      { threshold: 0.4 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      window.clearTimeout(timer);
      window.clearTimeout(backstop);
    };
  }, []);

  const year = work.year < 0 ? `${Math.abs(work.year)} BC` : String(work.year);

  return (
    <div ref={ref} className={styles.wrap} data-booting={booting} data-loaded={loaded}>
      <div className={styles.aside}>
        <p className={styles.heading}>
          Today&rsquo;s work.
        </p>
        <p className={styles.body}>
          Read live from the canon. Tomorrow it is a different work.
        </p>

        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Date</span>
            <span className={styles.metaValue}>
              <DateRoll days={days} run={booting} />
            </span>
          </div>
          {work.day && (
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Chosen because</span>
              <span className={styles.metaValue}>
                <Scramble text={work.day} run={booting} duration={1600} />
              </span>
            </div>
          )}
        </div>
      </div>

      <div className={styles.phone}>
        <div className={styles.screen}>
          <span className={styles.island} />

          <div className={styles.boot}>
            <Image className={styles.bootMark} src={tdcIcon} alt="" width={84} height={84} />
            <span className={styles.bootBar}>
              <span className={styles.bootFill} />
            </span>
          </div>

          <div className={styles.day}>
            <p className={styles.date} style={{ ["--i" as string]: 0 }}>
              {date}
            </p>
            {work.day && (
              <p className={styles.occasion} style={{ ["--i" as string]: 1 }}>
                {work.day}
              </p>
            )}
            <h3 className={styles.title} style={{ ["--i" as string]: 2 }}>
              {work.title}
              <span className={styles.year}>{year}</span>
            </h3>
            <p className={styles.author} style={{ ["--i" as string]: 3 }}>
              {work.author}
            </p>
            <ul className={styles.chips} style={{ ["--i" as string]: 4 }}>
              <li className={styles.chip}>{work.type}</li>
              <li className={styles.chip}>{work.language}</li>
            </ul>
            {work.extract && (
              <p className={styles.extract} style={{ ["--i" as string]: 5 }}>
                &ldquo;{work.extract}&rdquo;
              </p>
            )}

            {/* The blurb's place, kept and left empty on purpose. */}
            <a
              className={styles.locked}
              style={{ ["--i" as string]: 6 }}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className={styles.lockedLine} aria-hidden="true" />
              <span className={styles.lockedLine} aria-hidden="true" />
              <span className={styles.lockedLine} aria-hidden="true" />
              <span className={styles.lockedNote}>Read the blurb in the app →</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
