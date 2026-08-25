import type { Metadata } from "next";
import Image from "next/image";
import { PageShell } from "@/components/PageShell";
import shell from "@/components/PageShell.module.css";
import { Ledger } from "@/components/Ledger";
import { getCanonStats } from "@/lib/canon-stats";
import { caseStudies } from "@/content/case-studies";
import { education } from "@/content/experience";
import { cvPath } from "@/content/identity";
import { Document, ArrowUpRight } from "@/components/icons";
import { TechIcon } from "@/components/TechIcon";
import { iconFor } from "@/content/tech-map";
import styles from "./Work.module.css";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Data engineering at Chubb: probabilistic entity resolution, a 30,000-line pipeline refactor, and a GDPR deletion framework tested against over-deletion.",
};

/** The live index in the left margin. Ids match the section headings below. */
const INDEX = [
  { id: "ledger", label: "The ledger" },
  { id: "education", label: "Education" },
  { id: "studies", label: "Case studies" },
] as const;

export default async function WorkPage() {
  const stats = await getCanonStats();

  return (
    <PageShell
      side="verso"
      eyebrow="Measured in runtime"
      index={INDEX}
      light
      title="The engineering"
      standfirst="Four years of production pipelines across insurance and finance. The ledger first, then the two that are worth explaining properly rather than listing."
    >
      {/*
        No visible heading. The index in the margin already says "The ledger",
        and the rows below announce themselves: a date, a job title and a
        company need no line of prose explaining that is what they are.

        The id moves to the section so the index still has something to scroll
        to, and the name the heading was providing is kept as an aria-label
        rather than as a hidden element.
      */}
      <section id="ledger" className={shell.section} aria-label="The ledger">
        <Ledger counts={stats} />
        <a className={styles.cvLink} href={cvPath} target="_blank" rel="noopener noreferrer" data-magnetic="0.225">
          <Document size={15} /> Full CV (PDF) <ArrowUpRight size={13} />
        </a>
      </section>

      <section className={shell.section} aria-labelledby="education">
        <h2 id="education" className={shell.sectionHead}>
          Education and certifications
        </h2>
        <div className={styles.education}>
          {education.map((e) => (
            <article key={e.slug} className={styles.eduItem}>
              {e.logo && (
                <Image
                  className={styles.eduLogo}
                  src={e.logo}
                  alt=""
                  aria-hidden="true"
                  width={92}
                  height={92}
                />
              )}
              <div className={styles.eduHead}>
                <h3 className={styles.eduInstitution}>{e.institution}</h3>
                <p className={styles.eduDegree}>{e.degree}</p>
                <p className={styles.eduDates}>{e.dateRange}</p>
              </div>
              <div className={styles.eduBody}>
                {e.details && <p className={styles.eduDetails}>{e.details}</p>}
                {e.highlights && (
                  <ul className={styles.eduHighlights}>
                    {e.highlights.map((h) => (
                      <li key={h} className={styles.eduHighlight}>
                        <span className={styles.eduBullet} aria-hidden="true" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          ))}
        </div>

      </section>

      <section className={shell.section} aria-labelledby="studies">
        <h2 id="studies" className={shell.sectionHead}>
          Case studies
        </h2>

        {caseStudies.map((study) => (
          <article key={study.slug} className={styles.study}>
            <div className={styles.studyHead}>
              <h3 className={styles.studyTitle}>{study.title}</h3>
              <p className={styles.studyFigure}>
                {study.headline.from ? `${study.headline.from} → ` : ""}
                {study.headline.value.toLocaleString("en-GB")}
                {study.headline.suffix ?? ""}
                {study.headline.unit ? ` ${study.headline.unit}` : ""}
              </p>
            </div>

            <p className={styles.standfirst}>{study.standfirst}</p>

            <div className={styles.sections}>
              {study.sections.map((s) => (
                <div key={s.heading}>
                  <h4 className={styles.sectionHeading}>{s.heading}</h4>
                  <p className={styles.sectionBody}>{s.body}</p>
                </div>
              ))}
            </div>

            <ul className={styles.stack}>
              {study.stack.map((tech) => {
                const icon = iconFor(tech);
                return (
                  <li key={tech} className={styles.stackItem}>
                    {icon && <TechIcon slug={icon} size={12} brand />}
                    {tech}
                  </li>
                );
              })}
            </ul>
          </article>
        ))}
      </section>

    </PageShell>
  );
}
