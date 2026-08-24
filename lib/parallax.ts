/**
 * One scroll engine for the whole site.
 *
 * Every parallax element registers here rather than attaching its own scroll
 * listener and its own rAF loop. There is a single loop, a single
 * IntersectionObserver, and elements off-screen are skipped entirely — so a
 * page with forty registered items costs about the same as a page with two.
 *
 * Transforms are written straight to style. Nothing round-trips through React.
 */

export interface ParallaxOptions {
  /** Positive drifts slower than the scroll, negative overtakes it. */
  speed: number;
  /** Additional transform composed before the parallax offset. */
  base?: () => string;
  /** Fade in as it enters, using the same progress value. */
  fade?: boolean;
}

interface Entry extends ParallaxOptions {
  el: HTMLElement;
  visible: boolean;
}

const entries = new Map<HTMLElement, Entry>();
let observer: IntersectionObserver | null = null;
let frame = 0;
let running = false;
let reduced = false;

function ensure() {
  if (observer) return;
  reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  observer = new IntersectionObserver(
    (obs) => {
      for (const o of obs) {
        const entry = entries.get(o.target as HTMLElement);
        if (entry) entry.visible = o.isIntersecting;
      }
    },
    // Generous margin so an element is already correct before it appears.
    { rootMargin: "20% 0px 20% 0px" },
  );

  const tick = () => {
    const vh = window.innerHeight;

    for (const entry of entries.values()) {
      if (!entry.visible) continue;

      const rect = entry.el.getBoundingClientRect();
      // -1 above the viewport, 0 centred, +1 below.
      const progress = (rect.top + rect.height / 2 - vh / 2) / vh;
      const offset = progress * entry.speed * -100;

      const base = entry.base?.() ?? "";
      entry.el.style.transform = `${base} translate3d(0, ${offset.toFixed(2)}px, 0)`;

      if (entry.fade) {
        const enter = 1 - Math.min(1, Math.max(0, (rect.top - vh * 0.92) / (vh * 0.2)));
        entry.el.style.opacity = String(Math.min(1, Math.max(0, enter)));
      }
    }
    frame = requestAnimationFrame(tick);
  };

  const start = () => {
    if (running || reduced) return;
    running = true;
    frame = requestAnimationFrame(tick);
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(frame);
  };

  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
  start();
}

export function register(el: HTMLElement, options: ParallaxOptions) {
  ensure();
  // Under reduced motion the element simply sits where the layout put it.
  if (reduced) {
    if (options.fade) el.style.opacity = "1";
    return () => {};
  }

  entries.set(el, { ...options, el, visible: false });
  observer!.observe(el);

  return () => {
    observer!.unobserve(el);
    entries.delete(el);
    el.style.transform = "";
  };
}
