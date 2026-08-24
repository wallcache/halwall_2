import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import shell from "@/components/PageShell.module.css";
import { Gallery } from "@/components/Gallery";
import { GatedGallery } from "@/components/GatedGallery";
import {
  portraitPhotos,
  landscapePhotos,
  cityscapePhotos,
  photographyProjects,
} from "@/content/photography";
import styles from "../Making.module.css";

export const metadata: Metadata = {
  title: "Photography",
  description:
    "Photography as an exercise in attention. Quiet scenes, unhurried light, ordinary beauty. Portraits, landscapes, cityscapes and commercial work.",
};

const groups = [
  { id: "landscape", name: "Landscapes", photos: landscapePhotos },
  { id: "cityscape", name: "Cityscapes", photos: cityscapePhotos },
  { id: "portrait", name: "Portraits", photos: portraitPhotos },
];

export default function PhotographyPage() {
  return (
    <PageShell
      side="recto"
      eyebrow="Making · 01"
      title="Photography"
      standfirst="Photography as an exercise in attention. Quiet scenes, unhurried light, ordinary beauty."
    >
      {groups.map((g) => (
        <section key={g.id} id={g.id} className={shell.section}>
          <div className={styles.groupHead}>
            <h2 className={styles.groupTitle}>{g.name}</h2>
            <span className={styles.groupCount}>{g.photos.length} images</span>
          </div>
          <Gallery items={g.photos.map((p) => ({ src: p.src, alt: p.alt }))} initial={8} />
        </section>
      ))}

      <section className={shell.section} aria-labelledby="commercial">
        <h2 id="commercial" className={shell.sectionHead}>
          Commercial
        </h2>
        {photographyProjects.map((project) => (
          <div key={project.slug} id={project.slug}>
            <div className={styles.groupHead}>
              <h3 className={styles.groupTitle}>{project.name}</h3>
            </div>
            <p className={shell.prose} style={{ marginBottom: "1.25rem" }}>
              {project.description}
            </p>
            {project.gated ? (
              <GatedGallery slug={project.slug} count={project.images.length} name={project.name} />
            ) : (
              <Gallery
                items={project.images.map((src, i) => ({
                  src,
                  alt: `${project.name}, image ${i + 1}`,
                }))}
                initial={8}
              />
            )}
          </div>
        ))}
      </section>
    </PageShell>
  );
}
