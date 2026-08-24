"use client";

import { useSideRoute, type Side } from "@/lib/gutter";
import { Parallax } from "./Parallax";
import { PageIndex, type IndexEntry } from "./PageIndex";
import styles from "./PageShell.module.css";

/**
 * Interior pages belong to a side, and pin the gutter to it on mount. That is
 * what stops the split being a hero widget: it is the state you are reading in,
 * and it persists across navigation.
 */
export function PageShell({
  side,
  eyebrow,
  title,
  standfirst,
  index,
  children,
}: {
  side: Side;
  eyebrow: string;
  title: string;
  standfirst?: string;
  /** Section headings to pin beside the reading column as a live index. */
  index?: readonly IndexEntry[];
  children: React.ReactNode;
}) {
  useSideRoute(side);

  return (
    <main id="main" className={styles.shell} data-side={side}>
      <header className={`${styles.header} ${index ? styles.headerIndexed : ""}`}>
        <Parallax speed={0.06}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h1 className={styles.title}>{title}</h1>
          {standfirst && <p className={styles.standfirst}>{standfirst}</p>}
        </Parallax>
      </header>
      <div className={`${styles.body} ${index ? styles.bodyIndexed : ""}`}>
        {index && <PageIndex entries={index} />}
        <div className={styles.column}>{children}</div>
      </div>
    </main>
  );
}
