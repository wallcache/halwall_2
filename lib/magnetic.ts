/**
 * Magnetic hover.
 *
 * One delegated `pointermove` listener finds the nearest `[data-magnetic]`
 * ancestor of the event target, so elements added by a route change are picked
 * up with no registration and nothing to unbind.
 *
 * Smoothness comes from a continuous rAF loop easing the current offset toward
 * the target every frame, NOT from a CSS transition chasing discrete pointer
 * events. The first version set the offset straight to the cursor position and
 * let `transition: translate 120ms` catch up; because pointermove fires at
 * irregular intervals and each event restarted the transition, it read as a
 * series of small steps rather than a pull. Here the pointer only ever moves
 * the target, and the same loop handles both the pull and the release.
 *
 * The offset is applied through the CSS `translate` property rather than
 * `transform`, so it composes with the transforms elements already carry — the
 * gutter offset on the portrait, and the parallax the scroll engine writes.
 */

const DEFAULT_STRENGTH = 0.16;
/** Per-frame approach rate. Lower is heavier. */
const EASE_IN = 0.14;
/** The release is slower than the pull, which is what gives it weight. */
const EASE_OUT = 0.085;
/** Below this, snap to rest and stop the loop. */
const EPSILON = 0.05;

interface State {
  el: HTMLElement;
  /** Element centre with its own offset removed, so it cannot chase itself. */
  cx: number;
  cy: number;
  limit: number;
  strength: number;
}

let state: State | null = null;
/** The element still easing home after the pointer has left it. */
let releasing: HTMLElement | null = null;

const cur = { x: 0, y: 0 };
const target = { x: 0, y: 0 };

let frame = 0;
let started = false;

const write = (el: HTMLElement, x: number, y: number) => {
  el.style.setProperty("--mag-x", `${x.toFixed(2)}px`);
  el.style.setProperty("--mag-y", `${y.toFixed(2)}px`);
};

function measure(el: HTMLElement): State | null {
  // `data-mag-lock` is set imperatively by whatever is currently in charge of
  // the element — the portrait sets it for the duration of a drag. It is a
  // separate attribute on purpose: `data-magnetic` is rendered by React, and
  // writing to a prop React owns leaves the DOM and the vdom disagreeing,
  // because React only patches props it believes changed.
  if (el.dataset.magLock === "true") return null;

  // Explicit parse: `Number(x) || DEFAULT` would read a deliberate "0" as
  // absent and fall back to the default, which is backwards for an element
  // asking not to be pulled.
  const raw = Number.parseFloat(el.dataset.magnetic ?? "");
  const strength = Number.isFinite(raw) ? raw : DEFAULT_STRENGTH;
  if (strength === 0) return null;

  const rect = el.getBoundingClientRect();
  return {
    el,
    // Subtracting the live offset gives the resting centre. Without this the
    // element moves, its rect moves with it, and it drifts away under the
    // cursor indefinitely.
    cx: rect.left + rect.width / 2 - cur.x,
    cy: rect.top + rect.height / 2 - cur.y,
    // Clamped so a large element does not travel absurdly far.
    // Travel capped tighter too: strength alone still let a big element swing.
    limit: Math.min(rect.width, rect.height) * 0.08,
    strength,
  };
}

function tick() {
  const easing = state ? EASE_IN : EASE_OUT;
  cur.x += (target.x - cur.x) * easing;
  cur.y += (target.y - cur.y) * easing;

  const el = state?.el ?? releasing;
  if (el) write(el, cur.x, cur.y);

  const settled =
    Math.abs(target.x - cur.x) < EPSILON && Math.abs(target.y - cur.y) < EPSILON;

  if (!state && settled) {
    // Home. Park exactly at rest and stop burning frames.
    cur.x = 0;
    cur.y = 0;
    if (releasing) {
      write(releasing, 0, 0);
      releasing.removeAttribute("data-mag-active");
      releasing = null;
    }
    frame = 0;
    return;
  }

  frame = requestAnimationFrame(tick);
}

const run = () => {
  if (!frame) frame = requestAnimationFrame(tick);
};

function release() {
  if (!state) return;
  releasing = state.el;
  state = null;
  target.x = 0;
  target.y = 0;
  run();
}

function onMove(e: PointerEvent) {
  if (e.pointerType === "touch") return;

  const hit = (e.target as HTMLElement | null)?.closest?.(
    "[data-magnetic]",
  ) as HTMLElement | null;

  if (!hit) {
    release();
    return;
  }

  if (!state || state.el !== hit) {
    // A new element takes over from wherever the last one had got to, so the
    // handover eases rather than jumping.
    if (releasing && releasing !== hit) {
      write(releasing, 0, 0);
      releasing.removeAttribute("data-mag-active");
    }
    releasing = null;
    const next = measure(hit);
    if (!next) {
      release();
      return;
    }
    state = next;
    hit.dataset.magActive = "true";
  }

  const s = state!;
  target.x = Math.max(-s.limit, Math.min(s.limit, (e.clientX - s.cx) * s.strength));
  target.y = Math.max(-s.limit, Math.min(s.limit, (e.clientY - s.cy) * s.strength));
  run();
}

/** The page moved under the cursor, so the cached centre is stale. */
function remeasure() {
  if (!state) return;
  const next = measure(state.el);
  if (next) state = next;
}

export function initMagnetic() {
  if (started || typeof window === "undefined") return () => {};
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return () => {};

  started = true;
  document.addEventListener("pointermove", onMove, { passive: true });
  document.addEventListener("pointerleave", release);
  window.addEventListener("blur", release);
  window.addEventListener("scroll", remeasure, { passive: true });
  window.addEventListener("resize", remeasure);

  return () => {
    started = false;
    cancelAnimationFrame(frame);
    frame = 0;
    document.removeEventListener("pointermove", onMove);
    document.removeEventListener("pointerleave", release);
    window.removeEventListener("blur", release);
    window.removeEventListener("scroll", remeasure);
    window.removeEventListener("resize", remeasure);
    release();
  };
}
