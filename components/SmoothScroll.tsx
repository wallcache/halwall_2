"use client";

import { useEffect } from "react";

/**
 * Smooth scroll, loaded after paint and never on the critical path.
 *
 * Lenis is imported dynamically because nothing about the first frame depends
 * on it, and it is skipped outright for reduced-motion and for coarse pointers,
 * where the platform's own scrolling is already better than anything we would
 * impose on it.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let lenis: { raf: (t: number) => void; destroy: () => void; stop: () => void; start: () => void } | null = null;
    let frame = 0;
    let cancelled = false;

    const loop = (time: number) => {
      lenis?.raf(time);
      frame = requestAnimationFrame(loop);
    };

    const onVisibility = () => {
      // A backgrounded tab gets no frames; resuming should not replay the gap.
      if (document.hidden) lenis?.stop();
      else lenis?.start();
    };

    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      lenis = new Lenis({ duration: 1.05, smoothWheel: true });
      frame = requestAnimationFrame(loop);
      document.addEventListener("visibilitychange", onVisibility);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", onVisibility);
      lenis?.destroy();
    };
  }, []);

  return null;
}
