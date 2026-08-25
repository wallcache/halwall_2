"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/content/nav";
import { socials } from "@/content/identity";
import { Dots, Close, Github, LinkedIn, Instagram, Mail } from "./icons";
import styles from "./MobileNav.module.css";

const social = { github: Github, linkedin: LinkedIn, instagram: Instagram, mail: Mail };

const subscribeNoop = () => () => {};
/** False on the server and during hydration, true from the first client render after. */
const useMounted = () => useSyncExternalStore(subscribeNoop, () => true, () => false);

/**
 * The mobile navigation.
 *
 * Three dots into a full-page sheet. The sheet unfolds with a clip-path rather
 * than sliding a transformed panel, so it never sits off-screen taking up
 * scroll width, and it keeps the site's split: verso above the gutter, recto
 * below, with the links set in their own side's face.
 *
 * The sheet is portalled to `body` rather than rendered where the trigger is.
 * It is `position: fixed`, and it used to sit inside the bar, whose
 * `backdrop-filter` (and, folded, the `scale()` on its groups) makes the bar
 * the containing block for fixed descendants in Safari. `inset: 0` then meant
 * the pill's own box, and the clip cut everything below its first line: on an
 * iPhone the menu opened as "Hal Wall" and a cross, and nothing else. Chrome
 * does not do this, which is why it was never seen on a desk.
 *
 * Closed, it is not merely hidden: it is unmounted from the tab order via
 * `inert`, because an invisible full-screen menu that still catches focus is
 * the most common way this pattern goes wrong.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const mounted = useMounted();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpen(false), []);

  // Route changes close it; otherwise you navigate behind an open menu.
  useEffect(() => close(), [pathname, close]);

  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
      triggerRef.current?.focus();
    };
  }, [open, close]);

  /*
    Rendered closed from the first client frame, not only once opened: the
    unfold is a transition on clip-path, and a transition needs a "from" to
    run, so the sheet has to already be in the document when `data-open` flips.
  */
  const sheet = (
    <div className={styles.sheet} data-open={open} inert={!open} aria-hidden={!open}>
      <div className={styles.sheetHead}>
        <span className={styles.brand}>
          <span className={styles.brandVerso}>Hal</span>{" "}
          <span className={styles.brandRecto}>Wall</span>
        </span>
        <button ref={closeRef} type="button" className={styles.close} onClick={close} aria-label="Close menu">
          <Close />
        </button>
      </div>

      <nav className={styles.links} aria-label="Primary">
        {navItems.map((item, i) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.link} ${item.side === "verso" ? styles.linkVerso : styles.linkRecto}`}
            style={{ ["--i" as string]: i }}
            aria-current={pathname === item.href ? "page" : undefined}
          >
            <span className={styles.index}>0{i + 1}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className={styles.foot}>
        {socials.map((s) => {
          const Icon = social[s.icon];
          return (
            <a
              key={s.url}
              className={styles.social}
              href={s.url}
              target={s.icon === "mail" ? undefined : "_blank"}
              rel="noopener noreferrer"
            >
              <Icon size={14} />
              {s.name}
            </a>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
      >
        <Dots />
      </button>

      {mounted && createPortal(sheet, document.body)}
    </>
  );
}
