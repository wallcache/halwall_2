import Link from "next/link";
import Image from "next/image";
import { doors } from "@/content/doors";
import { Parallax } from "./Parallax";
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
          <Link href={door.href} className={styles.door} data-side={door.side}>
            {door.image && (
              <div className={styles.doorMedia} aria-hidden="true">
                <Image
                  src={door.image}
                  alt=""
                  fill
                  sizes="(max-width: 760px) 100vw, 33vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
            )}
            <span className={styles.doorLabel}>{door.label}</span>
            <h3 className={styles.doorTitle}>{door.title}</h3>
            <p className={styles.doorLine}>{door.line}</p>
            <span className={styles.doorFoot}>
              {door.meta}
              <span className={styles.doorArrow} aria-hidden="true">
                →
              </span>
            </span>
          </Link>
          </Parallax>
        ))}
      </div>
    </section>
  );
}
