import type { Metadata } from "next";
import { PageShell, shellStyles } from "@/components/PageShell";
import { canon, canonProject } from "@/content/canon";
import styles from "./Canon.module.css";

export const metadata: Metadata = {
  title: "The Daily Canon",
  description:
    "One carefully chosen work of literature for each day of the year. 366 works across three millennia, on iOS and the web. An App Store App of the Day.",
};

export default function CanonPage() {
  return (
    <PageShell side="recto" eyebrow="Measured in readers" title={canon.title} standfirst={canon.standfirst}>
      <section className={shellStyles.section}>
        <div className={styles.lede}>
          <div>
            {canon.body.map((p) => (
              <p key={p.slice(0, 24)} className={styles.prose}>
                {p}
              </p>
            ))}
            <div className={styles.links}>
              {canonProject.links.map((l) => (
                <a key={l.url} className={styles.link} href={l.url} target="_blank" rel="noopener noreferrer">
                  {l.text} <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          </div>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.wordmark} src={canon.wordmark} alt="" aria-hidden="true" />
            <p className={styles.honour} style={{ marginTop: "1.25rem" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={canon.appleMark} alt="" aria-hidden="true" />
              {canon.press.label} {canon.press.honour}
            </p>
          </div>
        </div>
      </section>

      <section className={shellStyles.section} aria-label="By the numbers">
        <div className={styles.stats}>
          {canonProject.figures.map((f) => (
            <div key={f.label} className={styles.stat}>
              <span className={styles.statValue}>
                {f.value.toLocaleString("en-GB")}
                {f.suffix ?? ""}
              </span>
              <span className={styles.statLabel}>{f.label}</span>
            </div>
          ))}
          <div className={styles.stat}>
            <span className={styles.statValue}>{canonProject.stack.length}</span>
            <span className={styles.statLabel}>{canonProject.stack.join(" · ")}</span>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
