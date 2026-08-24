import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageShell } from "@/components/PageShell";
import shell from "@/components/PageShell.module.css";
import { allPhotos, photographyProjects } from "@/content/photography";
import { identityProjects } from "@/content/identity-work";
import { motionPieces } from "@/content/motion";
import styles from "./Making.module.css";

export const metadata: Metadata = {
  title: "Making",
  description:
    "Photography, brand identity and motion work. 77 photographs across six galleries, twelve identities, ten films.",
};

const commercialCount = photographyProjects.reduce((n, p) => n + p.images.length, 0);

export default function MakingPage() {
  const cards = [
    {
      href: "/making/photography",
      label: "01",
      title: "Photography",
      line: "Photography as an exercise in attention. Quiet scenes, unhurried light, ordinary beauty — plus commercial work for three clients.",
      meta: `${allPhotos.length} personal · ${commercialCount} commercial`,
      image: "/media/photography/landscape/moorland-hikers-mist.webp",
    },
    {
      href: "/making/identity",
      label: "02",
      title: "Identity",
      line: "Logo and brand identity work from the WallCache years, for businesses from startups through to established brands.",
      meta: `${identityProjects.length} projects`,
      image: undefined,
    },
    {
      href: "/making/motion",
      label: "03",
      title: "Motion",
      line: "Logo animation and motion graphics, built in After Effects.",
      meta: `${motionPieces.length} films`,
      image: undefined,
    },
  ];

  return (
    <PageShell
      side="recto"
      eyebrow="The archive"
      title="Making"
      standfirst="Before the pipelines there was a design consultancy called WallCache. Most of this is from then; the photography never stopped."
    >
      <section className={shell.section}>
        <div className={styles.cards}>
          {cards.map((c) => (
            <Link key={c.href} href={c.href} className={styles.card}>
              {c.image && (
                <div className={styles.cardMedia} aria-hidden="true">
                  <Image src={c.image} alt="" fill sizes="(max-width: 760px) 100vw, 33vw" style={{ objectFit: "cover" }} />
                </div>
              )}
              <span className={styles.cardLabel}>{c.label}</span>
              <h2 className={styles.cardTitle}>{c.title}</h2>
              <p className={styles.cardLine}>{c.line}</p>
              <span className={styles.groupCount}>{c.meta}</span>
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
