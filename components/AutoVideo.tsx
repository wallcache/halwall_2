"use client";

import { useEffect, useRef } from "react";

/**
 * A decorative looping video that plays itself, but only when it is on screen
 * and only if the reader has not asked for less motion.
 *
 * The `autoPlay` attribute alone does neither: it plays a video scrolled far
 * out of view, and it ignores `prefers-reduced-motion` entirely.
 */
export function AutoVideo({
  src,
  className,
  /**
   * Seconds into the clip worth showing while it is paused. Logo animations
   * start on an empty frame, so frame zero is a white rectangle.
   */
  posterTime = 0,
  /**
   * "visible" plays whenever the clip is on screen. "hover" holds it on its
   * poster frame until the card it sits in is hovered, which is what a small
   * decorative print wants: a logo animation spends a good part of its loop on
   * a blank frame, and at thumbnail size a blank frame reads as a broken image
   * rather than as a beat in the animation.
   */
  play = "visible",
}: {
  src: string;
  className?: string;
  posterTime?: number;
  play?: "visible" | "hover";
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Park on a frame that shows something, so the clip is never a blank
    // rectangle while it loads, is paused, or is scrolled away.
    const seek = () => {
      if (el.readyState >= 1) el.currentTime = posterTime;
    };
    seek();
    el.addEventListener("loadedmetadata", seek, { once: true });

    const cleanups: (() => void)[] = [() => el.removeEventListener("loadedmetadata", seek)];

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return () => cleanups.forEach((fn) => fn());
    }

    // play() rejects if the element is torn down mid-promise, which is routine
    // under StrictMode and not worth surfacing.
    const start = () => void el.play().catch(() => {});
    const stop = () => {
      el.pause();
      seek();
    };

    if (play === "hover") {
      const card = el.closest("[data-card]");
      if (card) {
        card.addEventListener("pointerenter", start);
        card.addEventListener("pointerleave", stop);
        card.addEventListener("focusin", start);
        card.addEventListener("focusout", stop);
        cleanups.push(() => {
          card.removeEventListener("pointerenter", start);
          card.removeEventListener("pointerleave", stop);
          card.removeEventListener("focusin", start);
          card.removeEventListener("focusout", stop);
        });
      }
    } else {
      const io = new IntersectionObserver(
        ([entry]) => (entry.isIntersecting ? start() : el.pause()),
        { threshold: 0.15 },
      );
      io.observe(el);
      cleanups.push(() => io.disconnect());
    }

    return () => cleanups.forEach((fn) => fn());
  }, [posterTime, play]);

  return (
    <video ref={ref} className={className} src={src} muted loop playsInline preload="metadata" />
  );
}
