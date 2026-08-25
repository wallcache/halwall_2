"use client";

import { useEffect, useRef } from "react";

/** Letters only. Punctuation and spaces stay put, so the shape of the phrase
 *  is legible from the first frame and only the characters resolve. */
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

/**
 * Text that arrives unsettled and resolves left to right.
 *
 * Each character is given a moment at which it stops flickering, spread across
 * the run, so the phrase resolves as a wave rather than snapping into place all
 * at once. Spaces and punctuation never flicker: keeping them fixed means the
 * word lengths are right from the start and the eye can see a phrase forming
 * rather than a block of noise.
 */
export function Scramble({
  text,
  run,
  duration = 1400,
  className,
}: {
  text: string;
  run: boolean;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!run) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = text;
      return;
    }

    const chars = [...text];
    // Each character's settle point, as a fraction of the run. The last one
    // lands a little before the end so the phrase is never still mid-animation.
    const settleAt = chars.map((_, i) => (i / Math.max(1, chars.length - 1)) * 0.82);

    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      el.textContent = chars
        .map((c, i) => {
          if (t >= settleAt[i] || !/[a-z]/i.test(c)) return c;
          return GLYPHS[(Math.random() * GLYPHS.length) | 0];
        })
        .join("");

      if (t < 1) raf = requestAnimationFrame(tick);
      else el.textContent = text;
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, text, duration]);

  /*
    Rendered with the real text. The effect only ever replaces it, so the
    server and the first client frame agree, the phrase is correct with
    scripting off, and it is the real string that gets read aloud.
  */
  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  );
}
