/**
 * Magnetic hover.
 *
 * One delegated listener for the whole document rather than a listener per
 * element: `pointermove` finds the nearest `[data-magnetic]` ancestor of the
 * event target, so elements added by a route change are picked up with no
 * registration and nothing to clean up.
 *
 * The offset is written as `--mag-x` / `--mag-y` and applied through the CSS
 * `translate` property, NOT `transform`. That matters here — the portrait
 * already carries a gutter offset in `transform` and a parallax offset written
 * by the scroll engine, and `translate` composes with both instead of
 * overwriting them.
 */

const DEFAULT_STRENGTH = 0.32;
/** Beyond this many pixels outside the element, the pull is released. */
const SLACK = 28;

let active: HTMLElement | null = null;
let frame = 0;
let started = false;

const reset = (el: HTMLElement) => {
  el.style.setProperty("--mag-x", "0px");
  el.style.setProperty("--mag-y", "0px");
  el.removeAttribute("data-mag-active");
};

function apply(el: HTMLElement, clientX: number, clientY: number) {
  const rect = el.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  // Let an element opt out of, or exaggerate, the default pull.
  // Parsed explicitly: `Number(x) || DEFAULT` would treat a deliberate "0" as
  // absent and fall back to the default, which is exactly backwards for an
  // element asking not to be pulled.
  const raw = Number.parseFloat(el.dataset.magnetic ?? "");
  const strength = Number.isFinite(raw) ? raw : DEFAULT_STRENGTH;
  if (strength === 0) {
    reset(el);
    return;
  }

  // Clamped so a large element (the portrait) does not travel absurdly far
  // just because the cursor is near its corner.
  const limit = Math.min(rect.width, rect.height) * 0.18;
  const dx = Math.max(-limit, Math.min(limit, (clientX - cx) * strength));
  const dy = Math.max(-limit, Math.min(limit, (clientY - cy) * strength));

  el.style.setProperty("--mag-x", `${dx.toFixed(2)}px`);
  el.style.setProperty("--mag-y", `${dy.toFixed(2)}px`);
  el.dataset.magActive = "true";
}

function onMove(e: PointerEvent) {
  if (e.pointerType === "touch") return;

  const hit = (e.target as HTMLElement | null)?.closest?.("[data-magnetic]") as HTMLElement | null;

  if (active && active !== hit) {
    reset(active);
    active = null;
  }
  if (!hit) return;
  active = hit;

  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(() => apply(hit, e.clientX, e.clientY));
}

function onLeaveWindow() {
  if (active) reset(active);
  active = null;
}

export function initMagnetic() {
  if (started) return () => {};
  if (typeof window === "undefined") return () => {};
  // Coarse pointers have no hover, and reduced motion should not be nudged at.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return () => {};

  started = true;
  document.addEventListener("pointermove", onMove, { passive: true });
  document.addEventListener("pointerleave", onLeaveWindow);
  window.addEventListener("blur", onLeaveWindow);

  return () => {
    started = false;
    cancelAnimationFrame(frame);
    document.removeEventListener("pointermove", onMove);
    document.removeEventListener("pointerleave", onLeaveWindow);
    window.removeEventListener("blur", onLeaveWindow);
    if (active) reset(active);
    active = null;
  };
}

export { SLACK };
