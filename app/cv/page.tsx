import type { Metadata } from "next";
import { cv, bullets } from "@/content/cv";
import { experience, education } from "@/content/experience";
import { projects } from "@/content/projects";
import { identity } from "@/content/identity";
import { tdcIcon } from "@/content/media";
import Image from "next/image";
import { TechIcon } from "@/components/TechIcon";
import { iconFor } from "@/content/tech-map";
import styles from "./Cv.module.css";

export const metadata: Metadata = {
  title: "CV",
  description: `${identity.professionalName}, ${identity.role} at ${identity.company}.`,
  // A print artefact, not a page anyone should land on from a search.
  robots: { index: false, follow: false },
};

/** Certifications sit in `education`; on a CV they want their own heading. */
const DEGREES = new Set(["imperial-physics", "malvern"]);

/** Bracketed like a tag, which is the one flourish the old CV had worth keeping. */
function Head({ children }: { children: React.ReactNode }) {
  return (
    <h2 className={styles.sectionHead}>
      <span aria-hidden="true">&lt;</span>
      {children}
      <span aria-hidden="true">/&gt;</span>
    </h2>
  );
}

export default function CvPage() {
  const degrees = education.filter((e) => DEGREES.has(e.slug));
  const certs = education.filter((e) => !DEGREES.has(e.slug));
  /*
    Renovision is out and the Canon is in the rail, so the two projects listed
    beside the work are the two that shipped and are still running.
  */
  const side = projects.filter((p) => p.slug !== "renovision");
  /* The Canon is a role in the site's history and a project on the CV. Listing
     it in both places puts the same three years on the page twice. */
  const roles = experience.filter((r) => r.slug !== "daily-canon");
  /*
    The recent roles in full, the rest as a line each.

    Not only a convention -- it is what keeps the document on one sheet, and
    one sheet is load-bearing here. The layout is two columns, and a CSS grid
    that has to fragment across a page break is drawn on top of itself by
    Chrome's print engine: the first two-page attempt had the closing section
    heading printed through the middle of the previous role.
  */
  const RECENT = 4;
  const recent = roles.slice(0, RECENT);
  const earlier = roles.slice(RECENT);
  const canon = projects.find((p) => p.slug === "the-daily-canon");

  return (
    <main className={styles.sheet}>
      <aside className={styles.rail}>
        <header>
          {/* The site's wordmark, not a name in a heading: mono "Hal", serif
              italic "Wall", the second half in the accent. It is the one thing
              a reader will have seen before if they came from halwall.me. */}
          <h1 className={styles.name}>
            <span className={styles.nameHal}>Hal</span>
            <span className={styles.nameWall}>Wall</span>
            <span aria-hidden="true">.</span>
          </h1>
          <p className={styles.prompt}>
            <span className={styles.promptUser}>{cv.prompt.user}</span>{" "}
            <span className={styles.promptPath}>{cv.prompt.path}</span>{" "}
            <span className={styles.promptMark}>%</span>
            <span className={styles.promptRole}>{cv.prompt.role}</span>
          </p>
        </header>

        <section>
          <Head>Contact</Head>
          <ul className={styles.contact}>
            {cv.contact.map((c) => (
              <li key={c.label}>{c.value}</li>
            ))}
          </ul>
        </section>

        <section>
          <Head>Capabilities</Head>
          {cv.capabilities.map((g) => (
            <div key={g.group} className={styles.group}>
              <p className={styles.groupName}>{g.group}</p>
              <ul className={styles.pills}>
                {g.items.map((i) => {
                  const icon = iconFor(i);
                  return (
                    <li key={i} className={styles.pill}>
                      {/* Inked with currentColor rather than the brand's own:
                          half these marks are near-black and would vanish into
                          the panel they are sitting on. */}
                      {icon && <TechIcon slug={icon} size={9} className={styles.pillIcon} />}
                      {i}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </section>

        <section>
          <Head>Education</Head>
          {degrees.map((e) => (
            <div key={e.slug} className={styles.entry}>
              {e.logo && (
                <Image className={styles.entryMark} src={e.logo} alt="" aria-hidden="true" width={48} height={48} />
              )}
              <div>
                <p className={styles.entryTitle}>{e.degree}</p>
                <p className={styles.entryMeta}>
                  {e.institution} · {e.dateRange}
                </p>
              </div>
            </div>
          ))}
        </section>

        <section>
          <Head>Certifications</Head>
          {certs.map((e) => (
            <div key={e.slug} className={styles.entry}>
              {e.logo && (
                <Image className={styles.entryMark} src={e.logo} alt="" aria-hidden="true" width={48} height={48} />
              )}
              <div>
                <p className={styles.entryTitle}>{e.degree}</p>
                <p className={styles.entryMeta}>
                  {e.institution} · {e.dateRange}
                </p>
              </div>
            </div>
          ))}
        </section>

        <section>
          <Head>Projects</Head>
          {side.map((p) => (
            <div key={p.slug} className={styles.entry}>
              {p.slug === "the-daily-canon" && (
                <Image className={styles.entryMark} src={tdcIcon} alt="" aria-hidden="true" width={48} height={48} />
              )}
              {/* Wrapped, because .entry is a flex row that carries a mark
                  beside its text. Unwrapped, these three lines became three
                  columns. */}
              <div>
                <p className={styles.entryTitle}>{p.title}</p>
                <p className={styles.entryMeta}>{p.line}</p>
                <p className={styles.entryLink}>{p.primary.text}</p>
              </div>
            </div>
          ))}
        </section>

        <section>
          <Head>Interests</Head>
          <ul className={styles.pills}>
            {cv.interests.map((i) => (
              <li key={i} className={styles.pill}>
                {i}
              </li>
            ))}
          </ul>
        </section>
      </aside>

      <div className={styles.body}>
        <p className={styles.tagline}>{cv.tagline}</p>
        <p className={styles.summary}>{cv.summary}</p>

        <section>
          <Head>Experience</Head>
          {recent.map((r) => (
            <article key={r.slug} className={styles.role}>
              <div className={styles.roleHead}>
                <h3 className={styles.roleTitle}>{r.title}</h3>
                <p className={styles.roleDates}>{r.dateRange}</p>
              </div>
              <p className={styles.roleCompany}>
                {r.logo && (
                  <Image className={styles.roleMark} src={r.logo} alt="" aria-hidden="true" width={40} height={40} />
                )}
                {r.company}
                {r.via && ` · via ${r.via}`}
              </p>
              <ul className={styles.bullets}>
                {bullets(r.description).map((b) => (
                  <li key={b.slice(0, 30)}>{b}</li>
                ))}
              </ul>
            </article>
          ))}
          {earlier.length > 0 && (
            <div className={styles.earlier}>
              <p className={styles.earlierLabel}>Earlier</p>
              {earlier.map((r) => (
                <p key={r.slug} className={styles.earlierRole}>
                  <span className={styles.earlierTitle}>{r.title}</span>
                  {/* No mark on these. At this size it sat between the job
                      title and the company like a bullet nobody asked for, and
                      the width it took pushed the longer company names onto a
                      second line, so four tidy rows became a ragged block. */}
                  <span className={styles.earlierCompany}>
                    {r.company}
                    {r.via && ` · via ${r.via}`}
                  </span>
                  <span className={styles.earlierDates}>{r.dateRange}</span>
                </p>
              ))}
            </div>
          )}
        </section>

        {canon && (
          <section>
            <Head>Selected project</Head>
            <article className={styles.role}>
              <div className={styles.roleHead}>
                <h3 className={styles.roleTitle}>{canon.title}</h3>
                <p className={styles.roleDates}>Oct 2023 to Present</p>
              </div>
              <p className={styles.roleCompany}>
                <Image className={styles.roleMark} src={tdcIcon} alt="" aria-hidden="true" width={40} height={40} />
                Founder · {canon.primary.text}
              </p>
              <ul className={styles.bullets}>
                {bullets(canon.description).map((b) => (
                  <li key={b.slice(0, 30)}>{b}</li>
                ))}
              </ul>
            </article>
          </section>
        )}
      </div>
    </main>
  );
}
