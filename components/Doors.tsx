import Link from "next/link";
import Image from "next/image";
import { doors } from "@/content/doors";
import { Parallax } from "./Parallax";
import { ArrowUpRight } from "./icons";
import { PrintStack } from "./PrintStack";
import styles from "./Doors.module.css";

export function Doors() {
  return (
    <section className={styles.section} aria-labelledby="doors-heading">
      <Parallax className={styles.head} speed={0.05} fade>
        <h2 id="doors-heading" className={styles.headTitle}>
          Everything, reachable
        </h2>
        <p className={styles.headNote}>
          Four ways in. Two of them are work and two of them are not, which is
          roughly the correct proportion.
        </p>
      </Parallax>

      <div className={styles.grid}>
        {doors.map((door, i) => (
          // Alternating drift so the four cards do not move as one slab.
          <Parallax key={door.href} speed={i % 2 === 0 ? 0.07 : 0.14} fade>
            {/*
              A plain link. The hover used to need a client component to work
              out which edge the cursor crossed; the shared card language in
              styles/card.css is pure CSS, so the whole thing costs no JS.
            */}
            <Link href={door.href} className={styles.door} data-card data-side={door.side}>
              {door.image && (
                <span className={styles.doorMedia} data-card-media aria-hidden="true">
                  <Image
                    src={door.image}
                    alt=""
                    fill
                    sizes="(max-width: 760px) 100vw, 50vw"
                    style={{ objectFit: "cover" }}
                  />
                </span>
              )}

              {/* The scrim is drawn from the card's own ground, so it holds the
                  type on a dark card and a paper one without a second rule. */}
              <span className={styles.doorScrim} aria-hidden="true" />

              {door.mark && (
                <span className={styles.doorMark} aria-hidden="true">
                  <Image src={door.mark} alt="" width={512} height={512} />
                </span>
              )}

              {door.figure && (
                <span className={styles.doorFigure} aria-hidden="true">
                  {door.figure}
                </span>
              )}

              {door.stack && (
                <span className={styles.doorStack}>
                  <PrintStack slots={door.stack} />
                </span>
              )}

              <span className={styles.doorLabel}>{door.label}</span>

              <span className={styles.doorBody}>
                <h3 className={styles.doorTitle}>{door.title}</h3>
                <p className={styles.doorLine}>{door.line}</p>
                <span className={styles.doorFoot}>
                  {door.meta}
                  <ArrowUpRight className={styles.doorArrow} data-card-arrow size={16} />
                </span>
              </span>
            </Link>
          </Parallax>
        ))}
      </div>
    </section>
  );
}
