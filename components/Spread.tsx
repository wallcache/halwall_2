"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useGutter } from "@/lib/gutter";
import { register } from "@/lib/parallax";
import { identity } from "@/content/identity";
import { portraits } from "@/content/portraits";
import { DappledLight } from "./DappledLight";
import styles from "./Spread.module.css";

const NARROW = "(max-width: 760px)";
/**
 * Two photographs, not one image graded twice: the same face in the City with
 * a work lanyard, and at a wildcamp under trees. The seam wipes between them,
 * so the split stops being a colour treatment and becomes two actual lives.
 *
 * Paths come from a generated module because the filenames are content-hashed
 * — see scripts/crop-portraits.mjs.
 */
const PORTRAIT_VERSO = portraits.city;
const PORTRAIT_RECTO = portraits.camp;
/** How long after a drag before hovering a pane may take the gutter back. */
const HOVER_SUPPRESS_MS = 700;

export function Spread() {
  const { mode, commit, follow, endFollow } = useGutter();
  const heroRef = useRef<HTMLElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const [touched, setTouched] = useState(false);
  const [narrow, setNarrow] = useState(false);
  /**
   * The seam follows the pointer.
   *
   * No drag, no handle, no control to discover: moving across the hero moves
   * the seam, which is the shortest possible distance between "there is a
   * split here" and understanding what it does. The gutter provider eases
   * toward the target rather than pinning to it, so the seam trails the hand.
   */
  const onHeroMove = useCallback(
    (e: PointerEvent) => {
      if (narrow || e.pointerType === "touch") return;
      const el = heroRef.current;
      if (!el) return;
      const { left, width } = el.getBoundingClientRect();
      /*
        Inverted on purpose. The gutter runs 0 = recto (the Canon) to
        1 = verso (the engineering), and the pane left of the seam is always
        the verso one — so mapping the cursor straight through meant moving
        AWAY from a side was what opened it. Taking one minus the fraction
        makes the side you move toward the side that opens.
      */
      /*
        The middle 40% of the screen does the whole sweep; the outer 30% either
        side is a commit zone that holds the seam at its extreme.

        Straight edge-to-edge meant the seam only arrived fully open with the
        cursor pressed against the very edge of the window, which is a place
        nobody puts it. Snapping from 30% in means a decisive move to one side
        actually finishes the gesture.
      */
      const EDGE = 0.3;
      const fraction = (e.clientX - left) / width;
      const t = (fraction - EDGE) / (1 - EDGE * 2);
      follow(Math.min(1, Math.max(0, 1 - t)));
      if (!touched) setTouched(true);
    },
    [narrow, follow, touched],
  );

  /*
    Listened for on the window rather than the hero, so the seam keeps tracking
    while the cursor is over the header or anything else layered on top. Scoped
    to the hero it stalled the moment you touched the bar.
  */
  useEffect(() => {
    window.addEventListener("pointermove", onHeroMove, { passive: true });
    document.addEventListener("pointerleave", endFollow);
    return () => {
      window.removeEventListener("pointermove", onHeroMove);
      document.removeEventListener("pointerleave", endFollow);
    };
  }, [onHeroMove, endFollow]);

  useEffect(() => {
    const mq = window.matchMedia(NARROW);
    const sync = () => setNarrow(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  /*
    Layered parallax. The portrait drifts hardest because it is the thing the
    eye tracks; the masthead drifts against it, which is what reads as depth
    rather than as two things sliding at the same rate.
  */
  useEffect(() => {
    const stop: (() => void)[] = [];
    if (portraitRef.current) stop.push(register(portraitRef.current, { speed: 0.26 }));
    if (nameRef.current) stop.push(register(nameRef.current, { speed: -0.1 }));
    return () => stop.forEach((f) => f());
  }, []);

  /** Hover only takes the gutter when a drag is not in charge of it. */
  return (
    <section
      ref={heroRef}
      className={styles.hero}
      data-touched={touched}
    >
      <DappledLight />

      {/* ---------------- verso: measured in runtime ---------------- */}
      <div
        className={`${styles.pane} ${styles.paneVerso}`}
        data-side="verso"
        data-open={mode === "verso"}
        data-state={mode === "verso" ? "lead" : mode === "recto" ? "mute" : "idle"}
        inert={mode === "recto"}
        onClick={narrow ? () => commit("verso") : undefined}
      >
        <div className={styles.col}>
          <p className={`${styles.eyebrow} ${styles.eyebrowVerso}`}>
            {identity.role}
            <strong>{identity.company}</strong>
          </p>
        </div>
        <div />
        <div className={`${styles.col} ${styles.foot}`}>
          <p className={`${styles.claim} ${styles.claimVerso}`}>{identity.spreadLine.verso}</p>
        </div>
      </div>

      {/* ---------------- recto: measured in readers ---------------- */}
      <div
        className={`${styles.pane} ${styles.paneRecto}`}
        data-side="recto"
        data-open={mode === "recto"}
        data-state={mode === "recto" ? "lead" : mode === "verso" ? "mute" : "idle"}
        inert={mode === "verso"}
        onClick={narrow ? () => commit("recto") : undefined}
      >
        <div className={styles.col}>
          <p className={`${styles.eyebrow} ${styles.eyebrowRecto}`}>
            {identity.otherRoles} {identity.founderLine}
            <strong>{identity.founderOrg}</strong>
          </p>
        </div>
        <div />
        <div className={`${styles.col} ${styles.foot}`}>
          <p className={`${styles.claim} ${styles.claimRecto}`}>{identity.spreadLine.recto}</p>
        </div>
      </div>

      {/*
        One h1, drawn twice. The second copy is decorative and hidden from the
        accessibility tree, so the name is still announced exactly once.
      */}
      <div className={styles.nameLayer}>
        {/* .nameDrift carries the gutter lean, .nameStack the scroll parallax,
            so neither overwrites the other's transform. */}
        <div className={styles.nameDrift}>
        <div ref={nameRef} className={styles.nameStack}>
          <h1 className={`${styles.name} ${styles.nameCopy} ${styles.nameVerso}`}>
            <span className={styles.nameHal}>Hal</span>{" "}
            <span className={styles.nameWall}>Wall</span>
          </h1>
          <span
            className={`${styles.name} ${styles.nameCopy} ${styles.nameRecto}`}
            aria-hidden="true"
          >
            <span className={styles.nameHal}>Hal</span>{" "}
            <span className={styles.nameWall}>Wall</span>
          </span>
        </div>
        </div>
      </div>

      {/*
        The anchor moves with the gutter, the inner element takes the parallax,
        and the whole thing is grabbable: dragging the photograph is the most
        obvious way to move the seam, because the thing you are holding is the
        thing that moves.
      */}
      <div
        className={styles.portraitAnchor}
        data-magnetic="0.045"
      >
        <div ref={portraitRef} className={styles.portraitInner}>
          <Image
            className={`${styles.portrait} ${styles.portraitVerso}`}
            src={PORTRAIT_VERSO}
            alt={`${identity.name} in the City of London.`}
            fill
            priority
            sizes="(max-width: 760px) 52vw, 300px"
          />
          <Image
            className={`${styles.portrait} ${styles.portraitRecto}`}
            src={PORTRAIT_RECTO}
            alt={`${identity.name} at a wildcamp.`}
            fill
            priority
            sizes="(max-width: 760px) 52vw, 300px"
          />
          {/* Colour layers, clipped to match their photographs exactly. */}
          <span className={`${styles.tint} ${styles.tintVerso}`} aria-hidden="true" />
          <span className={`${styles.tint} ${styles.tintRecto}`} aria-hidden="true" />
        </div>
      </div>

      <div className={styles.seam} aria-hidden="true" />

    </section>
  );
}
