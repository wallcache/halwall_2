import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import shell from "@/components/PageShell.module.css";
import { Parallax } from "@/components/Parallax";
import { canon, canonProject } from "@/content/canon";
import styles from "./Canon.module.css";

export const metadata: Metadata = {
  title: "The Daily Canon",
  description:
    "One work of literature a day, from four thousand years of it. 366 works across 34 languages and 46 nationalities, on iOS and the web. An App Store App of the Day.",
};

const maxForm = Math.max(...canon.composition.forms.map((f) => f.count));

export default function CanonPage() {
  return (
    <PageShell side="recto" eyebrow="Measured in readers" title={canon.title} standfirst={canon.standfirst}>
      {/* ---------------- what it is ---------------- */}
      <section className={shell.section}>
        <div className={styles.lede}>
          <div>
            {canon.intro.map((p) => (
              <p key={p.slice(0, 24)} className={styles.prose}>
                {p}
              </p>
            ))}
            <div className={styles.links} style={{ marginTop: "1.75rem" }}>
              {canonProject.links.map((l) => (
                <a key={l.url} className={styles.link} href={l.url} target="_blank" rel="noopener noreferrer">
                  <span>{l.text}</span>
                  <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          </div>

          <aside className={styles.aside}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.wordmark} src={canon.wordmark} alt="" aria-hidden="true" />
            <span className={styles.honour}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={canon.appleMark} alt="" aria-hidden="true" />
              {canon.press.label} {canon.press.honour}
            </span>
            <div className={styles.span} style={{ marginTop: 0, paddingTop: 0, border: 0 }}>
              {canonProject.figures.map((f) => (
                <div key={f.label} className={styles.spanItem}>
                  <span className={styles.spanValue}>
                    {f.value.toLocaleString("en-GB")}
                    {f.suffix ?? ""}
                  </span>
                  <span className={styles.spanLabel}>{f.label}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      {/* ---------------- reading like fishing ---------------- */}
      <section className={`${shell.section} ${styles.fishing}`} aria-labelledby="fishing">
        <h2 id="fishing" className={shell.sectionHead}>
          {canon.fishing.heading}
        </h2>
        <Parallax speed={0.05} fade>
          {canon.fishing.body.map((p) => (
            <p key={p.slice(0, 24)} className={styles.prose}>
              {p}
            </p>
          ))}
          <p className={styles.pull}>{canon.fishing.pull}</p>
        </Parallax>
      </section>

      {/* ---------------- composition ---------------- */}
      <section className={shell.section} aria-labelledby="composition">
        <h2 id="composition" className={shell.sectionHead}>
          {canon.composition.heading}
        </h2>
        <p className={`${styles.prose} ${styles.small}`}>{canon.composition.note}</p>

        <Parallax speed={0.04} fade>
          <div className={styles.forms}>
            {canon.composition.forms.map((f) => (
              <div key={f.name} className={styles.form}>
                <span>{f.name}</span>
                <span className={styles.formBar}>
                  <span
                    className={styles.formFill}
                    style={{ ["--w" as string]: f.count / maxForm }}
                  />
                </span>
                <span className={styles.formCount}>{f.count}</span>
              </div>
            ))}
          </div>

          <div className={styles.span}>
            {canon.composition.span.map((s) => (
              <div key={s.label} className={styles.spanItem}>
                <span className={styles.spanLabel}>{s.label}</span>
                <span className={styles.spanValue}>{s.value}</span>
                <span className={styles.spanMeta}>{s.meta}</span>
              </div>
            ))}
            <div className={styles.spanItem}>
              <span className={styles.spanLabel}>Languages</span>
              <span className={styles.spanValue}>34</span>
              <span className={styles.spanMeta}>46 nationalities</span>
            </div>
          </div>
        </Parallax>
      </section>

      {/* ---------------- the fixed feasts ---------------- */}
      <section className={shell.section} aria-labelledby="feasts">
        <h2 id="feasts" className={shell.sectionHead}>
          {canon.feasts.heading}
        </h2>
        <p className={`${styles.prose} ${styles.small}`}>{canon.feasts.note}</p>
        <Parallax speed={0.05} fade>
          <div className={styles.feasts}>
            {canon.feasts.items.map((f) => (
              <article key={f.date} className={styles.feast}>
                <span className={styles.feastDate}>{f.date}</span>
                <h3 className={styles.feastWork}>{f.work}</h3>
                <span className={styles.feastAuthor}>{f.author}</span>
                <p className={styles.feastWhy}>{f.why}</p>
              </article>
            ))}
          </div>
        </Parallax>
      </section>

      {/* ---------------- why these dates ---------------- */}
      <section className={shell.section} aria-labelledby="dates">
        <h2 id="dates" className={shell.sectionHead}>
          {canon.dates.heading}
        </h2>
        <Parallax speed={0.04} fade>
          {canon.dates.body.map((p) => (
            <p key={p.slice(0, 24)} className={styles.prose}>
              {p}
            </p>
          ))}
        </Parallax>
      </section>

      {/* ---------------- features ---------------- */}
      <section className={shell.section} aria-labelledby="features">
        <h2 id="features" className={shell.sectionHead}>
          {canon.features.heading}
        </h2>
        <Parallax speed={0.05} fade>
          <div className={styles.features}>
            {canon.features.items.map((f) => (
              <article key={f.name} className={styles.feature}>
                <h3 className={styles.featureName}>{f.name}</h3>
                <p className={styles.featureDetail}>{f.detail}</p>
              </article>
            ))}
          </div>
        </Parallax>
      </section>

      {/* ---------------- how it is built ---------------- */}
      <section className={shell.section} aria-labelledby="build">
        <h2 id="build" className={shell.sectionHead}>
          {canon.build.heading}
        </h2>
        <div className={styles.build}>
          {canon.build.items.map((b) => (
            <div key={b.layer} className={styles.buildRow}>
              <span className={styles.buildLayer}>{b.layer}</span>
              <span className={styles.buildTech}>{b.tech}</span>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
