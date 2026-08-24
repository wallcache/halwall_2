"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { bio } from "@/content/identity";
import { tdcIcon } from "@/content/media";
import type { Side } from "@/content/types";
import styles from "./TwoLives.module.css";

/**
 * The long bio, moved out of the masthead.
 *
 * It used to fold open inside the hero and get clipped mid-sentence by a
 * max-height at exactly the moment someone wanted to read it. Here it has room.
 *
 * Deliberately the one part of the site that does NOT answer to the gutter. It
 * used to, in both directions, and both were wrong. Reading the global mode
 * meant the hero's seam -- which follows the cursor across the whole window --
 * flipped this section while you were only scrolling past it, so it bounced
 * between its two states the length of the page. Writing to the global mode
 * meant hovering a paragraph down here yanked the masthead and the header
 * upstairs. It owns its own state now: hover a half and that half takes the
 * room, leave and they go back to even.
 */
const HALVES: {
  side: Side;
  eyebrow: string;
  body: string;
  href: string;
  label: string;
  /** Only the half that links to a product has one. */
  mark?: string;
}[] = [
  {
    side: "verso",
    eyebrow: "Measured in runtime",
    body: bio.verso,
    href: "/work",
    label: "The engineering",
  },
  {
    side: "recto",
    eyebrow: "Measured in readers",
    body: bio.recto,
    href: "/canon",
    label: "The Daily Canon",
    mark: tdcIcon,
  },
];

export function TwoLives() {
  const [open, setOpen] = useState<Side | null>(null);

  return (
    <section
      className={styles.section}
      aria-label="About"
      data-open={open ?? "even"}
      onMouseLeave={() => setOpen(null)}
    >
      {HALVES.map((half) => (
        <div
          key={half.side}
          className={styles.half}
          data-side={half.side}
          /*
            The narrowed half keeps real width, so it is still there to hover
            back to. Collapsing it to nothing made the state a trap: once you
            had opened one side there was no longer a target for the other, and
            the only way back was to leave the section entirely.
          */
          onMouseEnter={() => setOpen(half.side)}
          onFocusCapture={() => setOpen(half.side)}
        >
          <div className={styles.inner}>
            <p className={styles.eyebrow}>{half.eyebrow}</p>
            <p className={styles.body}>{half.body}</p>
            <Link href={half.href} className={styles.link} data-magnetic="0.225">
              {/* The app's own icon, because this is the one link on the page
                  that goes to a product rather than to a section. */}
              {half.mark && (
                <Image className={styles.linkMark} src={half.mark} alt="" width={64} height={64} />
              )}
              {half.label} <span className={styles.arrow} aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      ))}
    </section>
  );
}
