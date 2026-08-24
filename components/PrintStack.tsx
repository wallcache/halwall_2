"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./PrintStack.module.css";

/** How long a piece stays before the next one begins to cross over it. */
const HOLD = 5200;
/** Offset between the slots, so they never turn over together. */
const STAGGER = 1700;

/**
 * Three pieces of work, left on the card like prints on a desk, each slot
 * turning over on its own clock.
 *
 * A single photograph could only ever stand for a third of what this card
 * opens, and three fixed ones for a twelfth of it. The slots cycle instead, on
 * staggered timers, so the pile is always changing and never changes all at
 * once -- which would read as a slideshow rather than as somebody going
 * through a stack.
 *
 * Each slot draws from its own list, so two slots can never land on the same
 * piece and no shuffling is needed to prevent it.
 *
 * A turnover is a cross-fade and nothing else. The slot keeps its angle and
 * its place in the fan throughout, so a piece changing never reads as the pile
 * moving.
 */
export function PrintStack({ slots }: { slots: readonly (readonly string[])[] }) {
  return (
    <span className={styles.stack} aria-hidden="true">
      {slots.map((pool, i) => (
        <Slot key={i} pool={pool} position={i} />
      ))}
    </span>
  );
}

function Slot({ pool, position }: { pool: readonly string[]; position: number }) {
  const [index, setIndex] = useState(0);
  /*
    The piece on its way out is kept alongside the one arriving, so the two
    cross rather than one replacing the other. Cleared once its transition has
    finished, or the card accumulates a layer per cycle for as long as the page
    is open.
  */
  const [outgoing, setOutgoing] = useState<number | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let interval: number;
    const advance = () => {
      setIndex((i) => {
        setOutgoing(i);
        return (i + 1) % pool.length;
      });
    };

    const start = window.setTimeout(() => {
      advance();
      interval = window.setInterval(advance, HOLD);
    }, HOLD + position * STAGGER);

    return () => {
      window.clearTimeout(start);
      window.clearInterval(interval);
    };
  }, [pool.length, position]);

  useEffect(() => {
    if (outgoing === null) return;
    // Held a beat past the fade so the layer beneath is never pulled out from
    // under a frame that is still partly transparent.
    const t = window.setTimeout(() => setOutgoing(null), 1700);
    return () => window.clearTimeout(t);
  }, [outgoing]);

  return (
    <span className={styles.slot} data-slot={position}>
      {outgoing !== null && (
        <span key={`out-${outgoing}`} className={styles.print} data-state="out">
          <Image src={pool[outgoing]} alt="" fill sizes="30vw" style={{ objectFit: "cover" }} />
        </span>
      )}
      <span key={`in-${index}`} className={styles.print} data-state="in">
        <Image src={pool[index]} alt="" fill sizes="30vw" style={{ objectFit: "cover" }} priority={index === 0} />
      </span>
    </span>
  );
}
