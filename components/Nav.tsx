"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGutter, type Side } from "@/lib/gutter";
import { identity } from "@/content/identity";
import { versoNav, rectoNav, type NavItem } from "@/content/nav";
import styles from "./Nav.module.css";

/**
 * The navigation is the switch.
 *
 * Hovering or focusing a link commits the whole page to that link's world
 * before you click it, so the split is discovered by using the site normally
 * rather than by finding a control nobody told you about. Focus is wired to
 * the same handler as hover, so a keyboard gets the real thing rather than a
 * flattened version of it.
 */
export function Nav() {
  const { mode, locked, commit, release } = useGutter();
  const pathname = usePathname();

  const bind = (side: Side) => ({
    onMouseEnter: () => commit(side),
    onFocus: () => commit(side),
    onMouseLeave: release,
    onBlur: release,
  });

  const renderLink = (item: NavItem) => (
    <Link
      key={item.href}
      href={item.href}
      className={`${styles.link} ${item.side === "verso" ? styles.linkVerso : styles.linkRecto}`}
      data-current={pathname === item.href || pathname.startsWith(item.href + "/")}
      {...bind(item.side)}
    >
      {item.label}
    </Link>
  );

  return (
    <nav className={styles.nav} data-mode={mode} aria-label="Primary">
      <div className={styles.group}>{versoNav.map(renderLink)}</div>

      <Link href="/" className={styles.wordmark} aria-label={`${identity.name} — home`}>
        <span className={styles.wordmarkVerso}>Hal</span>
        <span className={styles.wordmarkRecto}>Wall</span>
      </Link>

      <div className={`${styles.group} ${styles.groupRecto}`}>
        {rectoNav.map(renderLink)}
        <span className={styles.readout} aria-hidden="true">
          {locked
            ? mode === "verso"
              ? "reading: runtime"
              : "reading: readers"
            : mode === "verso"
              ? "runtime → readers"
              : mode === "recto"
                ? "readers → runtime"
                : "held in balance"}
        </span>
      </div>
    </nav>
  );
}
