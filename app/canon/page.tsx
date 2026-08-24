import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import shell from "@/components/PageShell.module.css";
import { Parallax } from "@/components/Parallax";
import { SlideCarousel } from "@/components/SlideCarousel";
import { canon, canonProject } from "@/content/canon";
import { workForDate, formatDay } from "@/lib/today";
import { Reviews, Rating } from "@/components/Reviews";
import Image from "next/image";
import styles from "./Canon.module.css";

export const metadata: Metadata = {
  title: "The Daily Canon",
  description:
    "One work of literature a day, from four thousand years of it. 366 works across 34 languages and 46 nationalities, on iOS and the web. Featured on the App Store.",
};

/** Today's work changes at midnight; there is no reason to hold it longer. */
export const revalidate = 3600;

const maxForm = Math.max(...canon.composition.forms.map((f) => f.count));

export default function CanonPage() {
  const now = new Date();
  const work = workForDate(now);

  return (
    <PageShell side="recto" eyebrow="Measured in readers" title={canon.title} standfirst={canon.standfirst}>
      {/* ---------------- what readers say ---------------- */}
      <section className={shell.section} aria-labelledby="reviews">
        <div className={styles.brandRow}>
          <Image
            className={styles.brandIcon}
            src={canon.icon}
            alt=""
            aria-hidden="true"
            width={128}
            height={128}
          />
          <div>
            <h2 id="reviews" className={styles.brandTitle}>
              On the App Store
            </h2>
            <p className={styles.brandRating}>
              <Rating value={4.8} size={14} />
              <span>4.8 on the App Store</span>
            </p>
            <p className={styles.brandMeta}>10,000+ downloads · featured by Apple</p>
          </div>
        </div>
        <Reviews />
      </section>

      {/* ----------------------------------------------------------------
          Today. The page does the thing rather than describing it: this is
          the actual work the app serves today, from the same 366-entry
          dataset it ships. It is different tomorrow.
         ---------------------------------------------------------------- */}
      <section className={shell.section} aria-labelledby="today">
        <h2 id="today" className={shell.sectionHead}>
          Today, in the app
        </h2>

        <article className={styles.today}>
          <div>
            <p className={styles.stamp}>
              <span>{formatDay(now)}</span>
              {work.day && <span className={styles.stampDay}>{work.day}</span>}
            </p>

            <h3 className={styles.workTitle}>
              {work.title}
              <span className={styles.workYear}>
                {work.year < 0 ? `${Math.abs(work.year)} BC` : work.year}
              </span>
            </h3>
            <p className={styles.workAuthor}>{work.author}</p>

            <ul className={styles.meta}>
              <li className={styles.chip}>{work.type}</li>
              <li className={styles.chip}>{work.language}</li>
            </ul>

            {work.blurb && <p className={styles.blurb}>{work.blurb}</p>}

            <p className={styles.liveNote}>
              Pulled from the live canon. Come back tomorrow and this is a
              different book.
            </p>
          </div>

          {work.extract && (
            <blockquote className={styles.extract}>&ldquo;{work.extract}&rdquo;</blockquote>
          )}
        </article>

        <div className={styles.links}>
          {canonProject.links.map((l) => (
            <a key={l.url} className={styles.link} href={l.url} target="_blank" rel="noopener noreferrer" data-magnetic="0.5">
              <span>{l.text}</span>
              <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </section>

      {/* ---------------- the app itself ---------------- */}
      <section className={shell.section} aria-labelledby="shots">
        <h2 id="shots" className={shell.sectionHead}>
          What it looks like · drag
        </h2>
        <SlideCarousel />
        <p className={styles.honour} style={{ marginTop: "0.5rem" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={canon.appleMark} alt="" aria-hidden="true" />
          Featured on the App Store
        </p>
      </section>

      {/* ---------------- reading like fishing ---------------- */}
      <section className={shell.section} aria-labelledby="fishing">
        <h2 id="fishing" className={shell.sectionHead}>
          {canon.fishing.heading}
        </h2>
        <Parallax speed={0.05}>
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

        <div className={styles.forms}>
          {canon.composition.forms.map((f) => (
            <div key={f.name} className={styles.form}>
              <span>{f.name}</span>
              <span className={styles.formBar}>
                <span className={styles.formFill} style={{ ["--w" as string]: f.count / maxForm }} />
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
      </section>

      {/* ---------------- the fixed feasts ---------------- */}
      <section className={shell.section} aria-labelledby="feasts">
        <h2 id="feasts" className={shell.sectionHead}>
          {canon.feasts.heading}
        </h2>
        <p className={`${styles.prose} ${styles.small}`}>{canon.feasts.note}</p>
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
      </section>

      {/* ---------------- why these dates ---------------- */}
      <section className={shell.section} aria-labelledby="dates">
        <h2 id="dates" className={shell.sectionHead}>
          {canon.dates.heading}
        </h2>
        {canon.dates.body.map((p) => (
          <p key={p.slice(0, 24)} className={styles.prose}>
            {p}
          </p>
        ))}
      </section>

      {/* ---------------- features ---------------- */}
      <section className={shell.section} aria-labelledby="features">
        <h2 id="features" className={shell.sectionHead}>
          {canon.features.heading}
        </h2>
        <div className={styles.features}>
          {canon.features.items.map((f) => (
            <article key={f.name} className={styles.feature}>
              <h3 className={styles.featureName}>{f.name}</h3>
              <p className={styles.featureDetail}>{f.detail}</p>
            </article>
          ))}
        </div>
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
