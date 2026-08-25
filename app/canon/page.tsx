import type { Metadata } from "next";
import { getCanonStats } from "@/lib/canon-stats";
import { PageShell } from "@/components/PageShell";
import shell from "@/components/PageShell.module.css";
import { Parallax } from "@/components/Parallax";
import { SlideCarousel } from "@/components/SlideCarousel";
import { canon, canonProject } from "@/content/canon";
import { workForDate, formatDay } from "@/lib/today";
import { Reviews, Rating } from "@/components/Reviews";
import { AppStoreCta } from "@/components/AppStoreCta";
import { TodayPhone } from "@/components/TodayPhone";
import { UiIcon } from "@/components/UiIcon";
import { TechIcon } from "@/components/TechIcon";
import Image from "next/image";
import styles from "./Canon.module.css";

export const metadata: Metadata = {
  title: "The Daily Canon",
  description:
    // No hard count of the canon here. The app's own copy rules forbid framing
    // it as a fixed 366 in user-facing text, and SEO description is exactly
    // that: each year adds a year of daily works and the library grows under it.
    "One work of literature a day, drawn from four thousand years of it. A growing canon, read in ten languages, on iOS and the web. Featured on the App Store.",
};

/** Today's work changes at midnight; there is no reason to hold it longer. */
export const revalidate = 3600;

export default async function CanonPage() {
  const stats = await getCanonStats();

  const now = new Date();
  const work = workForDate(now);

  /*
    Today and the six days before it, formatted here rather than in the
    browser. Date formatting answers to the machine's timezone, so deriving
    these client-side would render one set of days on the server and another on
    the reader's machine.
  */
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (6 - i));
    return formatDay(d);
  });

  const appStore =
    canonProject.links.find((l) => l.text === "App Store")?.url ?? canonProject.primary.url;

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
            <p className={styles.brandMeta}>
              {stats.downloads.toLocaleString("en-GB")}+ downloads · featured by Apple
            </p>
          </div>
        </div>
        <Reviews />
      </section>

      {/* ---------------- today, in the app ---------------- */}
      <section className={shell.section} aria-labelledby="today">
        <h2 id="today" className={shell.sectionHead}>
          Today, in the app
        </h2>
        <TodayPhone work={work} date={formatDay(now)} days={days} href={appStore} />
        <div className={styles.links}>
          {canonProject.links.map((l) => (
            <a key={l.url} className={styles.link} href={l.url} target="_blank" rel="noopener noreferrer">
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
      </section>

      {/* ---------------- why I built it ---------------- */}
      <section className={shell.section} aria-labelledby="origin">
        <h2 id="origin" className={shell.sectionHead}>
          {canon.origin.heading}
        </h2>
        <Parallax speed={0.04}>
          {canon.origin.body.map((p) => (
            <p key={p.slice(0, 24)} className={styles.prose}>
              {p}
            </p>
          ))}
          <p className={styles.pull}>{canon.origin.pull}</p>
          {canon.origin.after.map((p) => (
            <p key={p.slice(0, 24)} className={styles.prose} style={{ marginTop: "1.25rem" }}>
              {p}
            </p>
          ))}
        </Parallax>
      </section>

      {/* ---------------- one day, one work ---------------- */}
      <section className={shell.section} aria-labelledby="idea">
        <h2 id="idea" className={shell.sectionHead}>
          {canon.idea.heading}
        </h2>
        {canon.idea.body.map((p) => (
          <p key={p.slice(0, 24)} className={styles.prose}>
            {p}
          </p>
        ))}
      </section>

      {/* ---------------- the curation ---------------- */}
      <section className={shell.section} aria-labelledby="curation">
        <h2 id="curation" className={shell.sectionHead}>
          {canon.curation.heading}
        </h2>
        {canon.curation.body.map((p) => (
          <p key={p.slice(0, 24)} className={styles.prose}>
            {p}
          </p>
        ))}
        <p className={styles.pull}>{canon.curation.pull}</p>
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

      {/* ---------------- the literary themes ---------------- */}
      <section className={shell.section} aria-labelledby="themes">
        <h2 id="themes" className={shell.sectionHead}>
          {canon.themes.heading}
        </h2>
        <p className={styles.prose}>{canon.themes.body}</p>
        <p className={styles.themeNote}>{canon.themes.note}</p>
      </section>

      {/* ---------------- the progress map ---------------- */}
      <section className={shell.section} aria-labelledby="progress">
        <h2 id="progress" className={shell.sectionHead}>
          {canon.progress.heading}
        </h2>
        {canon.progress.body.map((p) => (
          <p key={p.slice(0, 24)} className={styles.prose}>
            {p}
          </p>
        ))}
      </section>

      {/* ---------------- what it does ---------------- */}
      <section className={shell.section} aria-labelledby="features">
        <h2 id="features" className={shell.sectionHead}>
          {canon.features.heading}
        </h2>
        <div className={styles.features}>
          {canon.features.items.map((f) => (
            <article key={f.name} className={styles.feature}>
              <h3 className={styles.featureName}>
                <UiIcon name={f.icon} className={styles.featureIcon} size={19} />
                {f.name}
              </h3>
              <p className={styles.featureDetail}>{f.detail}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ---------------- building it ---------------- */}
      <section className={shell.section} aria-labelledby="building">
        <h2 id="building" className={shell.sectionHead}>
          {canon.building.heading}
        </h2>
        <p className={styles.prose}>{canon.building.body}</p>
        <div className={styles.build}>
          {canon.building.log.map((l) => (
            <div key={l.what} className={styles.buildRow}>
              <span className={styles.buildLayer}>{l.what}</span>
              <span className={styles.buildTech}>{l.detail}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- how it is built ---------------- */}
      <section className={shell.section} aria-labelledby="stack">
        <h2 id="stack" className={shell.sectionHead}>
          {canon.build.heading}
        </h2>
        <div className={styles.build}>
          {canon.build.items.map((b) => (
            <div key={b.layer} className={styles.buildRow}>
              <span className={styles.buildLayer}>{b.layer}</span>
              <span className={styles.buildTech}>
                {/* The company's own mark where there is one, the site's own
                    icon for the two layers nobody owns. */}
                {"mark" in b ? (
                  <TechIcon slug={b.mark} size={15} brand className={styles.buildIcon} />
                ) : (
                  <UiIcon name={"icon" in b ? b.icon : undefined} size={15} className={styles.buildIcon} />
                )}
                {b.tech}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- what it is for ---------------- */}
      <section className={shell.section} aria-labelledby="purpose">
        <h2 id="purpose" className={shell.sectionHead}>
          {canon.purpose.heading}
        </h2>
        {canon.purpose.body.map((p) => (
          <p key={p.slice(0, 24)} className={styles.prose}>
            {p}
          </p>
        ))}
        <p className={styles.pull}>{canon.purpose.pull}</p>
      </section>

      <AppStoreCta href={appStore} />
    </PageShell>
  );
}
