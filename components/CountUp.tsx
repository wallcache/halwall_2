"use client";

import { useEffect, useRef } from "react";
import { tween, expoOut } from "@/lib/tween";
import type { Figure } from "@/content/types";

/**
 * Counts a Figure into place. The number is structured data, not a display
 * string, so a reduction ("270 minutes down to 45") animates from its real
 * starting point rather than from zero.
 */
export function CountUp({ figure, run }: { figure: Figure; run: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const played = useRef(false);

  const format = (n: number) =>
    `${figure.prefix ?? ""}${Math.round(n).toLocaleString("en-GB")}${figure.suffix ?? ""}${
      figure.unit ? ` ${figure.unit}` : ""
    }`;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!run) {
      if (!played.current) el.textContent = format(figure.from ?? figure.value);
      return;
    }
    if (played.current) return;
    played.current = true;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = format(figure.value);
      return;
    }

    const anim = tween({
      from: figure.from ?? 0,
      to: figure.value,
      duration: 1.4,
      ease: expoOut,
      onUpdate: (n) => {
        el.textContent = format(n);
      },
    });
    return () => void anim.kill();
    // `format` is derived entirely from `figure`, so `figure` is the real dep.
  }, [run, figure]); // eslint-disable-line react-hooks/exhaustive-deps

  return <span ref={ref}>{format(figure.from ?? figure.value)}</span>;
}
