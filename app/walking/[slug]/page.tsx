import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { Gallery } from "@/components/Gallery";
import { walks, getWalk } from "@/content/walking";
import styles from "../Walking.module.css";

export function generateStaticParams() {
  return walks.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const walk = getWalk((await params).slug);
  if (!walk) return {};
  return { title: walk.name, description: walk.summary };
}

export default async function WalkPage({ params }: { params: Promise<{ slug: string }> }) {
  const walk = getWalk((await params).slug);
  if (!walk) notFound();

  return (
    <PageShell
      side="recto"
      eyebrow={`${walk.year} · ${walk.distance} · ${walk.duration}`}
      title={walk.name}
      standfirst={walk.summary}
    >
      {walk.days.map((day) => (
        <article key={day.day} className={styles.day}>
          <div className={styles.dayHead}>
            <h2 className={styles.dayTitle}>
              {day.date}: {day.title}
            </h2>
            <p className={styles.dayMeta}>
              {day.from && day.to ? `${day.from} → ${day.to}` : walk.route}
              {day.distance ? ` · ${day.distance}` : ""}
            </p>
          </div>

          <p className={styles.dayDesc}>{day.description}</p>

          <ul className={styles.highlights}>
            {day.highlights.map((h) => (
              <li key={h} className={styles.highlight}>
                {h}
              </li>
            ))}
          </ul>

          <Gallery
            items={day.images.map((img) => ({ src: img.src, alt: img.caption, caption: img.caption }))}
            initial={day.images.length}
            sizes="(max-width: 760px) 50vw, 25vw"
          />
        </article>
      ))}
    </PageShell>
  );
}
