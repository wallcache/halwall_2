"use client";

import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import styles from "./Lightbox.module.css";

export interface LightboxItem {
  src: string;
  alt?: string;
  caption?: string;
}

/**
 * Portal lightbox with a real focus trap. Escape closes, arrows move, and
 * focus returns to whatever opened it — a gallery that strands keyboard users
 * inside a modal is the sort of thing an awards jury actually checks.
 */
export function Lightbox({
  items,
  index,
  onClose,
  onMove,
}: {
  items: LightboxItem[];
  index: number | null;
  onClose: () => void;
  onMove: (next: number) => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const restoreTo = useRef<HTMLElement | null>(null);
  const open = index !== null;

  useEffect(() => {
    if (!open) return;
    restoreTo.current = document.activeElement as HTMLElement;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      restoreTo.current?.focus();
    };
  }, [open]);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (index === null) return;
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") onMove((index + 1) % items.length);
      else if (e.key === "ArrowLeft") onMove((index - 1 + items.length) % items.length);
      else if (e.key === "Tab") {
        // Only the controls are focusable, so cycling within the dialog is enough.
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>("button");
        if (!focusables?.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [index, items.length, onClose, onMove],
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onKeyDown]);

  if (index === null || typeof document === "undefined") return null;
  const item = items[index];

  return createPortal(
    <div
      ref={dialogRef}
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-label={item.caption ?? item.alt ?? "Image viewer"}
      tabIndex={-1}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <figure className={styles.figure}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={styles.img} src={item.src} alt={item.alt ?? ""} />
        {item.caption && <figcaption className={styles.caption}>{item.caption}</figcaption>}
        <p className={styles.count}>
          {index + 1} / {items.length}
        </p>
      </figure>

      <button
        type="button"
        className={`${styles.btn} ${styles.close}`}
        data-magnetic="0.27"
        onClick={onClose}
        aria-label="Close viewer"
      >
        ✕
      </button>
      {items.length > 1 && (
        <>
          <button
            type="button"
            className={`${styles.btn} ${styles.prev}`}
            onClick={() => onMove((index - 1 + items.length) % items.length)}
            aria-label="Previous image"
          >
            ‹
          </button>
          <button
            type="button"
            className={`${styles.btn} ${styles.next}`}
            onClick={() => onMove((index + 1) % items.length)}
            aria-label="Next image"
          >
            ›
          </button>
        </>
      )}
    </div>,
    document.body,
  );
}
