import type { Metadata } from "next";
import { PageShell, shellStyles } from "@/components/PageShell";
import { Ledger } from "@/components/Ledger";
import { caseStudies } from "@/content/case-studies";
import { education } from "@/content/experience";
import { cvPath } from "@/content/identity";
import styles from "./Work.module.css";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Data engineering at Chubb: probabilistic entity resolution, a 30,000-line pipeline refactor, and a GDPR deletion framework tested against over-deletion.",
};

export default function WorkPage() {
  return (
    <PageShell
      side="verso"
      eyebrow="Measured in runtime"
      title="The engineering"
      standfirst="Four years of production pipelines across insurance and finance. Three of them are worth explaining properly rather than listing."
    >
      <section className={shellStyles.section} aria-labelledby="studies">
        <h2 id="studies" className={shellStyles.sectionHead}>
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
              {study.stack.map((s) => (
                <li key={s} className={styles.stackItem}>
                  {s}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className={shellStyles.section} aria-labelledby="ledger">
        <h2 id="ledger" className={shellStyles.sectionHead}>
          The ledger
        </h2>
        <Ledger />
      </section>

      <section className={shellStyles.section} aria-labelledby="education">
        <h2 id="education" className={shellStyles.sectionHead}>
          Education
        </h2>
        <div className={styles.education}>
          {education.map((e) => (
            <article key={e.slug} className={styles.eduItem}>
              <h3 className={styles.eduInstitution}>{e.institution}</h3>
              <p className={styles.eduDegree}>{e.degree}</p>
              <p className={styles.eduDates}>{e.dateRange}</p>
              {e.details && <p className={styles.eduDetails}>{e.details}</p>}
            </article>
          ))}
        </div>

        <a className={styles.cvLink} href={cvPath} target="_blank" rel="noopener noreferrer">
          Full CV (PDF) <span aria-hidden="true">↗</span>
        </a>
      </section>
    </PageShell>
  );
}
