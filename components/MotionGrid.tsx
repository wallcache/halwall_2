"use client";

import { useCallback, useRef } from "react";
import { motionPieces } from "@/content/motion";
import styles from "@/app/making/motion/Motion.module.css";

/**
 * Each tile holds a muted video parked on a frame where the logo has resolved,
 * so the grid reads as ten finished marks rather than ten black rectangles.
 * Nothing preloads beyond that frame until you ask for it.
 */
export function MotionGrid() {
  const refs = useRef(new Map<string, HTMLVideoElement>());

  const park = useCallback((slug: string, posterTime: number) => {
    const video = refs.current.get(slug);
    if (!video) return;
    video.pause();
    video.currentTime = posterTime;
  }, []);

  return (
    <div className={styles.grid}>
      {motionPieces.map((piece) => (
        <figure key={piece.slug} className={styles.item}>
          <video
            ref={(el) => {
              if (el) refs.current.set(piece.slug, el);
              else refs.current.delete(piece.slug);
            }}
            className={`${styles.video} ${piece.aspectRatio === "square" ? styles.square : ""}`}
            src={piece.videoSrc}
            muted
            playsInline
            loop
            preload="metadata"
            aria-label={`${piece.name}, logo animation`}
            onLoadedMetadata={() => park(piece.slug, piece.posterTime)}
            onMouseEnter={(e) => void e.currentTarget.play().catch(() => {})}
            onMouseLeave={() => park(piece.slug, piece.posterTime)}
            onFocus={(e) => void e.currentTarget.play().catch(() => {})}
            onBlur={() => park(piece.slug, piece.posterTime)}
            tabIndex={0}
          />
          <figcaption className={styles.name}>
            {piece.name}
            <span className={styles.hint} aria-hidden="true">
              hover to play
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
