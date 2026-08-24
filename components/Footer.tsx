import Link from "next/link";
import { identity, socials, cvPath } from "@/content/identity";
import { versoNav, rectoNav } from "@/content/nav";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer} data-side="verso">
      <div className={styles.grid}>
        <div>
          <h2 className={styles.colTitle}>Measured in runtime</h2>
          <div className={styles.list}>
            {versoNav.map((i) => (
              <Link key={i.href} href={i.href} className={styles.link} data-magnetic="0.203">
                {i.label}
              </Link>
            ))}
            <a className={styles.link} href={cvPath} target="_blank" rel="noopener noreferrer">
              cv (pdf) ↗
            </a>
          </div>
        </div>

        <div>
          <h2 className={styles.colTitle}>Measured in readers</h2>
          <div className={styles.list}>
            {rectoNav.map((i) => (
              <Link key={i.href} href={i.href} className={`${styles.link} ${styles.serifLink}`}>
                {i.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className={styles.colTitle}>Elsewhere</h2>
          <div className={styles.list}>
            {socials.map((s) => (
              <a
                key={s.url}
                className={styles.link}
                href={s.url}
                target={s.icon === "mail" ? undefined : "_blank"}
                rel="noopener noreferrer"
              >
                {s.name.toLowerCase()}
                {s.icon !== "mail" && " ↗"}
              </a>
            ))}
          </div>
        </div>

      </div>

      <div className={styles.bottom}>
        <span className={styles.name}>
          {identity.name}
          {/* The full stop. */}
          <Link href="/private" className={styles.dot} aria-label="Private area" prefetch={false}>
            .
          </Link>{" "}
          {identity.tagline}
        </span>
        <span>2026 edition</span>
      </div>
    </footer>
  );
}
