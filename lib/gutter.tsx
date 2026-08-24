"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { tween, expoOut, backOut, type TweenHandle } from "./tween";

/**
 * The gutter.
 *
 * One number owns the site's art direction: 0 gives the page to the recto
 * (the founder), 1 gives it to the verso (the engineer), 0.5 is the spread.
 *
 * Two rules make this cheap enough to drive from a pointer:
 *
 *  1. The value lives on the document element as `--gutter`, written directly.
 *     It is NEVER React state on pointermove. The prototype this replaces held
 *     it in state and rebuilt its entire data model sixty times a second.
 *  2. React only ever sees the coarse `mode`, which changes at most once per
 *     gesture and exists so components can swap semantics (aria-hidden, inert)
 *     rather than pixels.
 *
 * It persists, because a split that resets on navigation is a hero widget
 * rather than a way of reading the site.
 */

export type Side = "verso" | "recto";
export type Mode = "spread" | Side;

const TARGET: Record<Mode, number> = { recto: 0, spread: 0.5, verso: 1 };
const COOKIE = "rv-side";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 180;

interface GutterValue {
  mode: Mode;
  /** True while a route has pinned the gutter, so hover must not steal it. */
  locked: boolean;
  commit: (mode: Mode) => void;
  release: () => void;
  lockTo: (mode: Mode) => void;
  unlock: () => void;
  /** Direct write, for the drag gesture. Bypasses tweening entirely. */
  set: (value: number) => void;
  /** Reads the live value without subscribing to it. */
  read: () => number;
  settle: (velocity: number) => void;
}

const GutterContext = createContext<GutterValue | null>(null);

const clamp = (n: number) => Math.min(1, Math.max(0, n));

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function GutterProvider({
  children,
  initial = "spread",
}: {
  children: ReactNode;
  initial?: Mode;
}) {
  const [mode, setMode] = useState<Mode>(initial);
  const [locked, setLocked] = useState(false);

  // The animated value. A plain object so GSAP can tween it without React.
  const proxy = useRef({ value: TARGET[initial] });
  const anim = useRef<TweenHandle | null>(null);

  const write = useCallback((value: number) => {
    proxy.current.value = value;
    document.documentElement.style.setProperty("--gutter", String(value));
  }, []);

  useEffect(() => {
    write(TARGET[initial]);
    // Only the coarse side is persisted; a half-dragged seam is not a preference.
    document.cookie = `${COOKIE}=${initial};path=/;max-age=${COOKIE_MAX_AGE};samesite=lax`;
  }, [initial, write]);

  const to = useCallback(
    (value: number, duration: number) => {
      anim.current?.kill();
      if (prefersReducedMotion()) {
        // The gutter still commits. It cuts instead of travelling.
        write(value);
        return;
      }
      anim.current = tween({
        from: proxy.current.value,
        to: value,
        duration,
        ease: expoOut,
        onUpdate: write,
      });
    },
    [write],
  );

  const commit = useCallback(
    (next: Mode) => {
      if (locked) return;
      setMode(next);
      to(TARGET[next], next === "spread" ? 0.7 : 0.9);
      document.cookie = `${COOKIE}=${next};path=/;max-age=${COOKIE_MAX_AGE};samesite=lax`;
    },
    [locked, to],
  );

  const release = useCallback(() => commit("spread"), [commit]);

  const lockTo = useCallback(
    (next: Mode) => {
      setLocked(true);
      setMode(next);
      to(TARGET[next], 0.9);
    },
    [to],
  );

  const unlock = useCallback(() => setLocked(false), []);

  const set = useCallback(
    (value: number) => {
      anim.current?.kill();
      write(clamp(value));
    },
    [write],
  );

  const read = useCallback(() => proxy.current.value, []);

  /**
   * Release of a drag. This is the part the reference prototype promised and
   * never built: the seam carries its velocity past the fingertip, then snaps
   * to the nearest of the three states. Without it the seam has no weight and
   * reads as a slider.
   */
  const settle = useCallback(
    (velocity: number) => {
      const projected = clamp(proxy.current.value + velocity * 0.18);
      const next: Mode =
        projected > 0.72 ? "verso" : projected < 0.28 ? "recto" : "spread";

      setMode(next);
      document.cookie = `${COOKIE}=${next};path=/;max-age=${COOKIE_MAX_AGE};samesite=lax`;

      anim.current?.kill();
      if (prefersReducedMotion()) {
        write(TARGET[next]);
        return;
      }
      // A little overshoot, scaled by how hard it was thrown.
      anim.current = tween({
        from: proxy.current.value,
        to: TARGET[next],
        duration: 1.05,
        ease: Math.abs(velocity) > 0.4 ? backOut(1.4) : expoOut,
        onUpdate: write,
      });
    },
    [write],
  );

  useEffect(() => () => void anim.current?.kill(), []);

  const value = useMemo<GutterValue>(
    () => ({ mode, locked, commit, release, lockTo, unlock, set, read, settle }),
    [mode, locked, commit, release, lockTo, unlock, set, read, settle],
  );

  return <GutterContext.Provider value={value}>{children}</GutterContext.Provider>;
}

export function useGutter() {
  const ctx = useContext(GutterContext);
  if (!ctx) throw new Error("useGutter must be used inside a GutterProvider");
  return ctx;
}

/**
 * Pins the gutter for a route that belongs to one side, and hands it back on
 * the way out. /work is verso, /canon is recto.
 */
export function useSideRoute(side: Side) {
  const { lockTo, unlock } = useGutter();
  useEffect(() => {
    lockTo(side);
    return () => unlock();
  }, [side, lockTo, unlock]);
}
