/**
 * A minimal rAF tween.
 *
 * This exists instead of GSAP because the site only ever asks for two things:
 * move the gutter to a value, and count a number up. GSAP is superb, and its
 * ScrollTrigger and SplitText would earn their weight — but neither is used
 * here, so importing it put roughly 40KB of library on the critical path to
 * do easing that fits in forty lines.
 *
 * If a later phase needs scroll choreography, bring GSAP back and delete this.
 */

export type Easing = (t: number) => number;

/** Fast start, long settle. The default for the gutter. */
export const expoOut: Easing = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

/** Overshoots then returns, for a seam thrown hard enough to carry past. */
export const backOut =
  (overshoot = 1.4): Easing =>
  (t) => {
    const c = overshoot + 1;
    return 1 + c * Math.pow(t - 1, 3) + overshoot * Math.pow(t - 1, 2);
  };

export interface TweenHandle {
  kill: () => void;
}

export function tween({
  from,
  to,
  duration,
  ease = expoOut,
  onUpdate,
  onComplete,
}: {
  from: number;
  to: number;
  /** Seconds, to match the call sites this replaced. */
  duration: number;
  ease?: Easing;
  onUpdate: (value: number) => void;
  onComplete?: () => void;
}): TweenHandle {
  let frame = 0;
  let start = 0;
  const ms = duration * 1000;

  const step = (now: number) => {
    if (!start) start = now;
    const t = Math.min(1, (now - start) / ms);
    onUpdate(from + (to - from) * ease(t));
    if (t < 1) frame = requestAnimationFrame(step);
    else onComplete?.();
  };

  frame = requestAnimationFrame(step);
  return { kill: () => cancelAnimationFrame(frame) };
}
