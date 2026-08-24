import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageShell } from "@/components/PageShell";
import shell from "@/components/PageShell.module.css";
import { identityProjects } from "@/content/identity-work";
import styles from "../Making.module.css";

export const metadata: Metadata = {
  title: "Identity",
  description:
    "Twelve logo and brand identity projects from the WallCache years, for businesses from startups through to established brands.",
};

export default function IdentityPage() {
  return (
    <PageShell
      side="recto"
      eyebrow="Making · 02"
      title="Identity"
      standfirst="Logo and brand identity work, mostly between 2019 and 2021, for businesses from startups through to established brands."
    >
      <section className={shell.section}>
        <div className={styles.tiles}>
          {identityProjects.map((project) => (
            <Link key={project.slug} href={`/making/identity/${project.slug}`} className={styles.tile} data-magnetic="0.16">
              <Image
                src={project.src}
                alt={`${project.name} identity`}
                fill
                sizes="(max-width: 760px) 50vw, 25vw"
                style={{ objectFit: "contain" }}
              />
              <span className={styles.tileName}>
                {project.name}
                {project.description && <span className={styles.tileDesc}>{project.description}</span>}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
