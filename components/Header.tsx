"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGutter, type Side } from "@/lib/gutter";
import { identity } from "@/content/identity";
import { versoNav, rectoNav, type NavItem } from "@/content/nav";
import { MobileNav } from "./MobileNav";
import styles from "./Header.module.css";

/** Past this, the bar goes compact and starts hiding on downward scroll. */
const COMPACT_AT = 90;
/** Ignore jitter below this, or the bar flickers on trackpad noise. */
const DIRECTION_THRESHOLD = 8;

export function Header() {
  const { mode } = useGutter();
  const pathname = usePathname();
  const barRef = useRef<HTMLElement>(null);

  const [compact, setCompact] = useState(false);

  /*
    Re-synced on every navigation. The scroll position resets to the top on a
    route change but this effect used to keep the previous page's baseline, so
    the bar arrived already compact and stayed that way until you scrolled far
    enough to beat the threshold. Keying on pathname re-reads the real
    position and sets the correct state immediately.
  */
  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;
    setCompact(last > COMPACT_AT);

    const update = () => {
      const y = window.scrollY;
      const delta = y - last;

      if (y <= COMPACT_AT) {
        // At the top it is always open.
        setCompact(false);
      } else if (Math.abs(delta) > DIRECTION_THRESHOLD) {
        // Folds going down, opens again coming up. Hovering also opens it,
        // handled in CSS so it costs nothing.
        setCompact(delta > 0);
      }

      if (Math.abs(delta) > DIRECTION_THRESHOLD) last = y;
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  /**
   * The specular highlight follows the pointer across the glass. Coordinates
   * go straight onto the element as custom properties inside a rAF; putting
   * them in state would re-render the header on every mouse move.
   */
  const onBarPointerMove = useCallback((e: React.PointerEvent) => {
    const el = barRef.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    requestAnimationFrame(() => {
      el.style.setProperty("--sheen-x", `${((e.clientX - left) / width) * 100}%`);
      el.style.setProperty("--sheen-y", `${((e.clientY - top) / height) * 100}%`);
    });
  }, []);

  /**
   * Moving the cursor from "work" to "making" used to fire a leave and then an
   * enter, so the gutter snapped back to the spread and lurched out again
   * between two links in the same group. Two fixes: the handlers live on the
   * group rather than each link, and the release is deferred just long enough
   * that crossing the gap between groups cancels it.
   */
  const renderLink = (item: NavItem) => (
    <Link
      key={item.href}
      href={item.href}
      className={`${styles.link} ${item.side === "verso" ? styles.linkVerso : styles.linkRecto}`}
      data-current={pathname === item.href || pathname.startsWith(item.href + "/")}
      data-magnetic="0.203"
    >
      {item.label}
    </Link>
  );

  return (
    <div className={styles.wrap} data-compact={compact} data-mode={mode}>
      <nav ref={barRef} className={styles.bar} aria-label="Primary" onPointerMove={onBarPointerMove}>
        <div className={styles.group}>{versoNav.map(renderLink)}</div>

        <Link href="/" className={styles.wordmark} aria-label={`${identity.name} — home`}>
          <span className={styles.wordmarkVerso}>Hal</span>{" "}
          <span className={styles.wordmarkRecto}>Wall</span>
        </Link>

        {/*
          The header no longer commands the gutter. Hovering a link used to
          commit the whole page to that side and leaving snapped it back to the
          spread, which meant crossing the bar yanked the seam to halfway. The
          seam now just keeps following the cursor, as it does everywhere else.
        */}
        <div className={`${styles.group} ${styles.groupRecto}`}>
          {rectoNav.map(renderLink)}
          <MobileNav />
        </div>
      </nav>
    </div>
  );
}
