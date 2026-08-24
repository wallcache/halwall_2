"use client";

import { useEffect, useRef } from "react";
import { motionPieces } from "@/content/motion";
import styles from "@/app/making/motion/Motion.module.css";

/**
 * The motion archive: everything playing at once.
 *
 * Hover-to-play was the wrong model twice over. It never fired reliably,
 * because a browser refuses play() until it has decided a gesture was
 * deliberate, and it offered nothing at all to touch or to a keyboard. Ten
 * short loops playing on arrival is what the work actually is, and hovering
 * just brings one forward.
 *
 * Only what is on screen plays. Ten simultaneous decodes is real work, so an
 * IntersectionObserver pauses anything scrolled away and resumes it on return,
 * and a hidden tab stops all of them.
 */
export function MotionGrid() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const videos = Array.from(grid.querySelectorAll("video"));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Reduced motion gets stills, parked on the frame where each logo resolves.
    if (reduced) {
      videos.forEach((v) => {
        const at = Number(v.dataset.poster ?? 0);
        const seek = () => {
          if (v.readyState >= 1) v.currentTime = at;
        };
        v.addEventListener("loadedmetadata", seek);
        seek();
      });
      return;
    }

    const visible = new Set<HTMLVideoElement>();

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const v = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            visible.add(v);
            // play() rejects if the element is torn down mid-promise, and an
            // unhandled rejection here would surface as a console error.
            if (!document.hidden) void v.play().catch(() => {});
          } else {
            visible.delete(v);
            v.pause();
          }
        }
      },
      { threshold: 0.25 },
    );
    videos.forEach((v) => io.observe(v));

    const onVisibility = () => {
      if (document.hidden) videos.forEach((v) => v.pause());
      else visible.forEach((v) => void v.play().catch(() => {}));
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      videos.forEach((v) => v.pause());
    };
  }, []);

  return (
    <div ref={gridRef} className={styles.grid}>
      {motionPieces.map((piece) => (
        <figure key={piece.slug} className={styles.item} data-magnetic="0.072">
          <video
            className={`${styles.video} ${piece.aspectRatio === "square" ? styles.square : ""}`}
            src={piece.videoSrc}
            data-poster={piece.posterTime}
            muted
            loop
            playsInline
            preload="metadata"
            aria-label={`${piece.name}, logo animation`}
          />
          <figcaption className={styles.name}>{piece.name}</figcaption>
        </figure>
      ))}
    </div>
  );
}
