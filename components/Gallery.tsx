"use client";

import { useState } from "react";
import Image from "next/image";
import { Lightbox, type LightboxItem } from "./Lightbox";
import styles from "./Gallery.module.css";

/**
 * A gallery that never puts hundreds of images in the initial payload. Only
 * `initial` cells render until asked for more, and every one below the fold
 * is lazily loaded — the identity archive alone is 342 images.
 */
export function Gallery({
  items,
  initial = 8,
  sizes = "(max-width: 760px) 50vw, (max-width: 1280px) 33vw, 25vw",
}: {
  items: LightboxItem[];
  initial?: number;
  sizes?: string;
}) {
  const [shown, setShown] = useState(initial);
  const [open, setOpen] = useState<number | null>(null);
  const visible = items.slice(0, shown);
  const remaining = items.length - shown;

  return (
    <>
      <div className={styles.grid}>
        {visible.map((item, i) => (
          <button
            key={item.src}
            type="button"
            className={styles.cell}
            onClick={() => setOpen(i)}
            aria-label={`Open image ${i + 1} of ${items.length}${item.caption ? `: ${item.caption}` : ""}`}
          >
            <Image
              src={item.src}
              alt={item.alt ?? ""}
              fill
              sizes={sizes}
              loading={i < 4 ? "eager" : "lazy"}
              style={{ objectFit: "cover" }}
            />
            {item.caption && <span className={styles.caption}>{item.caption}</span>}
          </button>
        ))}
      </div>

      {remaining > 0 && (
        <button type="button" className={styles.more} data-magnetic="0.225" onClick={() => setShown(items.length)}>
          Show all {items.length} — {remaining} more
        </button>
      )}

      <Lightbox items={items} index={open} onClose={() => setOpen(null)} onMove={setOpen} />
    </>
  );
}
