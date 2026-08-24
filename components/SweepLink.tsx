"use client";

import { useCallback, useRef, type ReactNode } from "react";
import Link from "next/link";

type Dir = "top" | "right" | "bottom" | "left";

/**
 * A card whose fill sweeps in from wherever the cursor entered, and out toward
 * wherever it leaves.
 *
 * The direction is computed rather than fixed: the cursor's position is
 * measured against the card's own aspect ratio, so the nearest edge is the one
 * it actually came through on a wide card as well as a tall one. Comparing raw
 * distances instead would pick top or bottom almost every time on a wide card.
 *
 * That "in from where you came, out to where you went" continuity is the whole
 * effect. A fill that always enters from the left is a wipe; one that follows
 * the hand reads as liquid.
 */
function edgeFrom(el: HTMLElement, clientX: number, clientY: number): Dir {
  const r = el.getBoundingClientRect();
  // Normalised to the box, so the comparison is fair on any aspect ratio.
  const x = (clientX - r.left) / r.width - 0.5;
  const y = (clientY - r.top) / r.height - 0.5;
  return Math.abs(x) > Math.abs(y) ? (x > 0 ? "right" : "left") : y > 0 ? "bottom" : "top";
}

export function SweepLink({
  href,
  className,
  children,
  ...rest
}: {
  href: string;
  className?: string;
  children: ReactNode;
} & Omit<React.ComponentProps<typeof Link>, "href" | "className" | "children">) {
  const ref = useRef<HTMLAnchorElement>(null);

  const set = useCallback((dir: Dir, state: "in" | "out") => {
    const el = ref.current;
    if (!el) return;
    el.dataset.dir = dir;
    el.dataset.sweep = state;
  }, []);

  return (
    <Link
      ref={ref}
      href={href}
      className={className}
      data-sweep="out"
      onPointerEnter={(e) => set(edgeFrom(e.currentTarget, e.clientX, e.clientY), "in")}
      onPointerLeave={(e) => set(edgeFrom(e.currentTarget, e.clientX, e.clientY), "out")}
      // Keyboard has no edge to come from, so it sweeps up from the bottom.
      onFocus={() => set("bottom", "in")}
      onBlur={() => set("bottom", "out")}
      {...rest}
    >
      {children}
    </Link>
  );
}
