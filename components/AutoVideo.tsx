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
}: {
  src: string;
  className?: string;
  posterTime?: number;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Park on a frame that shows something, so the card is never a blank
    // rectangle while the clip loads, is paused, or is scrolled away.
    const seek = () => {
      if (el.readyState >= 1) el.currentTime = posterTime;
    };
    seek();
    el.addEventListener("loadedmetadata", seek, { once: true });

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return () => el.removeEventListener("loadedmetadata", seek);
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        // play() rejects if the element is torn down mid-promise, which is
        // routine under StrictMode and not worth surfacing.
        if (entry.isIntersecting) void el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      el.removeEventListener("loadedmetadata", seek);
    };
  }, [posterTime]);

  return (
    <video ref={ref} className={className} src={src} muted loop playsInline preload="metadata" />
  );
}
