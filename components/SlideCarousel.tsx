"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { slides } from "@/content/canon-slides";
import styles from "./SlideCarousel.module.css";

/**
 * The App Store slides, as a filmstrip you can throw.
 *
 * Native overflow scrolling does the work — so it keeps momentum, trackpads,
 * touch and keyboard for free — with pointer drag layered on top for mouse
 * users, who otherwise have no way to move a horizontal strip. Snapping is
 * disabled mid-drag and restored on release, or the strip fights the hand.
 */
export function SlideCarousel() {
  const ref = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [index, setIndex] = useState(1);

  const drag = useRef({ x: 0, left: 0, moved: false });

  const sync = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const p = max > 0 ? el.scrollLeft / max : 0;
    setProgress(p);
    setAtStart(el.scrollLeft < 8);
    setAtEnd(el.scrollLeft > max - 8);
    setIndex(Math.min(slides.length, Math.round(p * (slides.length - 1)) + 1));
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    sync();
    el.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      el.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [sync]);

  const step = useCallback((dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-slide]");
    const by = (card?.offsetWidth ?? 240) + 16;
    el.scrollBy({ left: dir * by, behavior: "smooth" });
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "touch") return; // native touch scrolling is better
    const el = ref.current;
    if (!el) return;
    drag.current = { x: e.clientX, left: el.scrollLeft, moved: false };
    setDragging(true);
    el.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    const el = ref.current;
    if (!el) return;
    const dx = e.clientX - drag.current.x;
    if (Math.abs(dx) > 3) drag.current.moved = true;
    el.scrollLeft = drag.current.left - dx;
  };

  const endDrag = () => {
    if (!dragging) return;
    setDragging(false);
  };

  return (
    <div className={styles.wrap}>
      <div
        ref={ref}
        className={styles.viewport}
        data-dragging={dragging}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        tabIndex={0}
        role="region"
        aria-label="The Daily Canon on the App Store — screenshots"
      >
        {slides.map((slide, i) => (
          <figure key={slide.src} className={styles.slide} data-slide data-magnetic="0.18">
            <Image
              src={slide.src}
              alt={slide.caption}
              width={1000}
              height={2162}
              sizes="(max-width: 760px) 60vw, 268px"
              loading={i < 3 ? "eager" : "lazy"}
            />
          </figure>
        ))}
      </div>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.btn}
          data-magnetic="0.55"
          onClick={() => step(-1)}
          disabled={atStart}
          aria-label="Previous screenshot"
        >
          ‹
        </button>
        <button
          type="button"
          className={styles.btn}
          data-magnetic="0.55"
          onClick={() => step(1)}
          disabled={atEnd}
          aria-label="Next screenshot"
        >
          ›
        </button>
        <span className={styles.progress} aria-hidden="true">
          <span
            className={styles.progressFill}
            style={{ transform: `scaleX(${Math.max(0.04, progress || 0.04)})` }}
          />
        </span>
        <span className={styles.count}>
          {index} / {slides.length}
        </span>
      </div>
    </div>
  );
}
