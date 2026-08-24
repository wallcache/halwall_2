import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageShell } from "@/components/PageShell";
import shell from "@/components/PageShell.module.css";
import { walks, japhy } from "@/content/walking";
import styles from "./Walking.module.css";

export const metadata: Metadata = {
  title: "Walking",
  description:
    "Two long-distance journals: the West Highland Way, 96 miles from Milngavie to Fort William, and a wildcamp at Cwm Llwch in the Brecon Beacons.",
};

export default function WalkingPage() {
  return (
    <PageShell
      side="recto"
      eyebrow="Measured in miles"
      title="Walking"
      standfirst="Long-distance hiking and wildcamping, mostly in Wales and Scotland, usually with a dog who is faster than me."
    >
      <section className={shell.section} aria-labelledby="journals">
        <h2 id="journals" className={shell.sectionHead}>
          Journals
        </h2>
        <div className={styles.trips}>
          {walks.map((walk) => (
            <Link key={walk.slug} href={`/walking/${walk.slug}`} className={styles.trip}>
              <span className={styles.tripYear}>{walk.year}</span>
              <div>
                <h3 className={styles.tripName}>{walk.name}</h3>
                <p className={styles.tripSummary} style={{ marginTop: "0.6rem" }}>
                  {walk.summary}
                </p>
              </div>
              <span className={styles.tripMeta}>
                <span>{walk.distance}</span>
                <span>{walk.duration}</span>
                <span>{walk.route}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className={shell.section} aria-labelledby="japhy">
        <h2 id="japhy" className={shell.sectionHead}>
          The dog
        </h2>
        <div className={styles.japhy}>
          <div className={styles.japhyMedia}>
            <Image
              src="/media/walking/hal-and-japhy.webp"
              alt={`Hal and ${japhy.name} at a wildcamp, tent pitched under birch trees`}
              fill
              sizes="(max-width: 760px) 100vw, 40vw"
              style={{ objectFit: "cover" }}
            />
          </div>
          <div>
            <h3 className={styles.japhyName}>{japhy.name}</h3>
            <p className={styles.japhyMeta}>
              {japhy.breed} · born {japhy.born}
            </p>
            <p className={styles.japhyNote}>{japhy.note}</p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
