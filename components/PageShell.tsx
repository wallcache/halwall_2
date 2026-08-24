"use client";

import { useSideRoute, type Side } from "@/lib/gutter";
import { Parallax } from "./Parallax";
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
  children,
}: {
  side: Side;
  eyebrow: string;
  title: string;
  standfirst?: string;
  children: React.ReactNode;
}) {
  useSideRoute(side);

  return (
    <main id="main" className={styles.shell} data-side={side}>
      <header className={styles.header}>
        <Parallax speed={0.06}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h1 className={styles.title}>{title}</h1>
          {standfirst && <p className={styles.standfirst}>{standfirst}</p>}
        </Parallax>
      </header>
      <div className={styles.body}>{children}</div>
    </main>
  );
}
