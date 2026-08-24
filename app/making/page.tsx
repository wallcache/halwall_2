import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageShell } from "@/components/PageShell";
import shell from "@/components/PageShell.module.css";
import { allPhotos, photographyProjects } from "@/content/photography";
import { identityProjects } from "@/content/identity-work";
import { motionPieces } from "@/content/motion";
import { ArrowUpRight } from "@/components/icons";
import { AutoVideo } from "@/components/AutoVideo";
import styles from "./Making.module.css";

export const metadata: Metadata = {
  title: "Making",
  description:
    "Photography, brand identity and motion work: a selection from the WallCache years and the photography that never stopped.",
};

export default function MakingPage() {
  const cards = [
    {
      href: "/making/photography",
      label: "01",
      title: "Photography",
      line: "Photography as an exercise in attention. Quiet scenes, unhurried light, ordinary beauty, and commercial work alongside it.",
      meta: "personal \u00b7 commercial",
      image: "/media/photography/landscape/countryside-aerial-golden-hour.webp",
      video: undefined,
      posterTime: 0,
    },
    {
      href: "/making/identity",
      label: "02",
      title: "Identity",
      line: "Logo and brand identity work from the WallCache years, for businesses from startups through to established brands.",
      meta: "brand identity",
      image: "/media/identity/onlyone/hero.webp",
      video: undefined,
      posterTime: 0,
    },
    {
      href: "/making/motion",
      label: "03",
      title: "Motion",
      // Motion has no still worth showing, so the card plays. The reel is the
      // work; a frozen frame of a logo animation is just the logo.
      line: "Logo animation and motion graphics, built in After Effects.",
      meta: "logo animation \u00b7 motion graphics",
      image: undefined,
      video: "/media/motion/wallcache-animations.mp4",
      posterTime: 7,
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
            <Link key={c.href} href={c.href} className={styles.card} data-card>
              <span className={styles.cardMedia} data-card-media aria-hidden="true">
                {c.video ? (
                  <AutoVideo className={styles.cardVideo} src={c.video} posterTime={c.posterTime} />
                ) : (
                  c.image && (
                    <Image
                      src={c.image}
                      alt=""
                      fill
                      sizes="(max-width: 760px) 100vw, 33vw"
                      style={{ objectFit: "cover" }}
                    />
                  )
                )}
                <span className={styles.cardTint} />
                <span className={styles.cardLabel}>{c.label}</span>
              </span>


              <span className={styles.cardBody}>
                <h2 className={styles.cardTitle}>
                  {c.title}
                  <ArrowUpRight className={styles.cardArrow} data-card-arrow size={18} />
                </h2>
                <p className={styles.cardLine}>{c.line}</p>
                <span className={styles.cardMeta}>{c.meta}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
