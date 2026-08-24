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
    <Tag
      ref={ref}
      className={className}
      style={fade ? { opacity: 0, ...style } : style}
    >
      {children}
    </Tag>
  );
}
