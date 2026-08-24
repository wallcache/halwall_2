"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { register } from "@/lib/parallax";

/**
 * Drifts its child against the scroll. `speed` is roughly "percent of a
 * viewport height of extra travel", so 0.08 is a whisper and 0.4 is obvious.
 */
export function Parallax({
  speed = 0.08,
  fade = false,
  as: Tag = "div",
  className,
  style,
  children,
}: {
  speed?: number;
  fade?: boolean;
  as?: ElementType;
  className?: string;
  style?: React.CSSProperties;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    return register(ref.current, { speed, fade });
  }, [speed, fade]);

  return (
    // No inline opacity: the starting value lives in CSS, so React never owns
    // a prop the scroll engine also writes.
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  );
}
