"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { experience } from "@/content/experience";
import { iconFor } from "@/content/tech-map";
import { TechIcon } from "./TechIcon";
import { Laurel } from "./icons";
import { CountUp } from "./CountUp";
import { resolveFigure, type LiveCounts } from "@/lib/figures";
import styles from "./Ledger.module.css";

/**
 * The runtime ledger: one row per role, each figure counting up as the row
 * reaches the reading line. The idea is the one worth keeping from the
 * reference set's Ledger direction, which its own critique said to graft here.
 */
export function Ledger({ counts }: { counts: LiveCounts }) {
  const ref = useRef<HTMLUListElement>(null);
  const [live, setLive] = useState<Set<string>>(new Set());

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const slug = (entry.target as HTMLElement).dataset.slug;
          if (slug) setLive((prev) => new Set(prev).add(slug));
          io.unobserve(entry.target); // Counters play once.
        }
      },
      { threshold: 0.35, rootMargin: "0px 0px -10% 0px" },
    );

    for (const row of el.querySelectorAll("[data-slug]")) io.observe(row);
    return () => io.disconnect();
  }, []);

  return (
    <ul className={styles.ledger} ref={ref}>
      {experience.map((role) => (
        <li key={role.slug} className={styles.row} data-slug={role.slug}>
          {/*
            The dates read as an eyebrow above the role rather than as a column
            beside it. A date column is the handsomer arrangement, but it costs
            a fixed 150px of a reading column that is now half the page, and it
            was buying two words of type at the price of a wrapped job title.
          */}
          <div className={styles.main}>
            <span className={styles.dates}>{role.dateRange}</span>
            <h3 className={styles.role}>{role.title}</h3>
            <p className={styles.company}>
              {role.logo && (
                <Image
                  className={styles.orgLogo}
                  src={role.logo}
                  alt=""
                  aria-hidden="true"
                  width={64}
                  height={64}
                />
              )}
              {role.company}
              {role.via && <span className={styles.via}> · via {role.via}</span>}
            </p>
            <p className={styles.desc}>{role.description}</p>

            {role.honour && (
              <p className={styles.honour}>
                <Laurel className={styles.laurel} size={34} />
                <span className={styles.honourText}>
                  <TechIcon slug="apple" size={12} className={styles.honourApple} />
                  {role.honour}
                </span>
                <Laurel className={`${styles.laurel} ${styles.laurelRight}`} size={34} />
              </p>
            )}
            <ul className={styles.skills}>
              {role.skills.map((s) => {
                const icon = iconFor(s);
                return (
                  <li key={s} className={styles.skill}>
                    {icon && <TechIcon slug={icon} size={12} brand />}
                    {s}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className={styles.figure}>
            {role.figure && (
              <>
                <span className={styles.figureValue}>
                  <CountUp figure={resolveFigure(role.figure, counts)} run={live.has(role.slug)} />
                </span>
                <span className={styles.figureLabel}>{role.figure.label}</span>
              </>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
