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
  /** Document-relative top, cached. See the note in `tick`. */
  top: number;
  height: number;
}

const entries = new Map<HTMLElement, Entry>();
let observer: IntersectionObserver | null = null;
let frame = 0;
let running = false;
let reduced = false;
let lastY = -1;
let idleFrames = 0;

/** Re-reads an element's document position. Only on register and on resize. */
function measure(entry: Entry) {
  const rect = entry.el.getBoundingClientRect();
  entry.top = rect.top + window.scrollY - (parseFloat(entry.el.style.getPropertyValue("--px-y")) || 0);
  entry.height = rect.height;
}

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
    const y = window.scrollY;

    // Nothing moved and everything has settled: stop until the next scroll.
    if (y === lastY && idleFrames > 2) {
      running = false;
      frame = 0;
      return;
    }
    if (y === lastY) idleFrames++;
    else idleFrames = 0;
    lastY = y;

    const vh = window.innerHeight;

    for (const entry of entries.values()) {
      if (!entry.visible) continue;

      /*
        Position is derived from a cached document-relative top rather than
        getBoundingClientRect(). The old version read the rect for every
        visible element on every frame, which forces a synchronous layout each
        time — with a dozen registered elements that is a dozen layouts per
        frame, and it is most of why scrolling felt heavy.
      */
      const top = entry.top - y;
      // -1 above the viewport, 0 centred, +1 below.
      const progress = (top + entry.height / 2 - vh / 2) / vh;
      const offset = progress * entry.speed * -100;

      // Custom properties, applied by CSS — never `style.transform` or
      // `style.opacity` directly. Those are props React renders for these
      // elements, and writing to them leaves React's vdom and the DOM
      // disagreeing until something forces a full remount.
      entry.el.style.setProperty("--px-y", `${offset.toFixed(2)}px`);

      if (entry.fade) {
        const enter = 1 - Math.min(1, Math.max(0, (top - vh * 0.92) / (vh * 0.2)));
        entry.el.style.setProperty("--px-o", String(Math.min(1, Math.max(0, enter))));
      }
    }
    frame = requestAnimationFrame(tick);
  };

  const start = () => {
    if (running || reduced) return;
    running = true;
    idleFrames = 0;
    frame = requestAnimationFrame(tick);
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(frame);
    frame = 0;
  };

  // Woken by scroll rather than spinning forever: an idle page runs no frames.
  window.addEventListener("scroll", start, { passive: true });
  window.addEventListener("resize", () => {
    for (const e of entries.values()) measure(e);
    start();
  });
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
  start();
}

export function register(el: HTMLElement, options: ParallaxOptions) {
  ensure();
  // Under reduced motion the element simply sits where the layout put it.
  if (reduced) {
    if (options.fade) el.style.setProperty("--px-o", "1");
    return () => {};
  }

  const entry: Entry = { ...options, el, visible: false, top: 0, height: 0 };
  entries.set(el, entry);
  measure(entry);
  el.dataset.parallax = options.fade ? "fade" : "";
  // Hidden only once JS is definitely running; the CSS default is visible.
  if (options.fade) el.style.setProperty("--px-o", "0");
  observer!.observe(el);

  return () => {
    observer!.unobserve(el);
    entries.delete(el);
    el.style.removeProperty("--px-y");
    el.style.removeProperty("--px-o");
    delete el.dataset.parallax;
  };
}
