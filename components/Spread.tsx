"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useGutter } from "@/lib/gutter";
import { identity, bio } from "@/content/identity";
import { experience } from "@/content/experience";
import { getProject } from "@/content/projects";
import { CountUp } from "./CountUp";
import styles from "./Spread.module.css";

const chubb = experience[0];
const emea = experience.find((r) => r.slug === "chubb-emea-analytics")!;
const quilter = experience.find((r) => r.slug === "quilter")!;
const canon = getProject("the-daily-canon")!;

const NARROW = "(max-width: 760px)";
const PORTRAIT = "/media/portrait/hal-interim.webp";

export function Spread() {
  const { mode, commit, set, read, settle } = useGutter();
  const heroRef = useRef<HTMLElement>(null);
  const [touched, setTouched] = useState(false);
  const [narrow, setNarrow] = useState(false);

  // Drag bookkeeping lives in refs. None of it belongs in React state: the
  // gutter is written straight to the DOM and re-rendering per frame is
  // exactly the mistake this design exists to avoid.
  const dragging = useRef(false);
  const last = useRef({ frac: 0.5, t: 0 });
  const velocity = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia(NARROW);
    const sync = () => setNarrow(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const fractionFor = useCallback((clientX: number) => {
    const el = heroRef.current;
    if (!el) return 0.5;
    const { left, width } = el.getBoundingClientRect();
    return Math.min(1, Math.max(0, (clientX - left) / width));
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      // The seam must never swallow a click meant for a link or a button.
      if ((e.target as HTMLElement).closest("a,button")) return;
      if (narrow || e.pointerType === "touch") return;

      dragging.current = true;
      velocity.current = 0;
      const frac = fractionFor(e.clientX);
      last.current = { frac, t: e.timeStamp };
      set(frac);
      setTouched(true);
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    },
    [narrow, fractionFor, set],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return;
      const frac = fractionFor(e.clientX);
      const dt = Math.max(1, e.timeStamp - last.current.t);
      // Fraction per second, lightly smoothed so a jittery trackpad does not
      // throw the settle in the wrong direction.
      const instant = ((frac - last.current.frac) / dt) * 1000;
      velocity.current = velocity.current * 0.6 + instant * 0.4;
      last.current = { frac, t: e.timeStamp };
      set(frac);
    },
    [fractionFor, set],
  );

  const endDrag = useCallback(() => {
    if (!dragging.current) return;
    dragging.current = false;
    settle(velocity.current);
  }, [settle]);

  const nudge = useCallback(
    (delta: number) => {
      set(read() + delta);
      setTouched(true);
    },
    [read, set],
  );

  const onHandleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        nudge(-0.06);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        nudge(0.06);
      } else if (e.key === "Home") {
        e.preventDefault();
        commit("recto");
      } else if (e.key === "End") {
        e.preventDefault();
        commit("verso");
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        settle(0);
      }
    },
    [nudge, commit, settle],
  );

  return (
    <section
      ref={heroRef}
      className={styles.hero}
      data-touched={touched}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      {/* ---------------- verso: measured in runtime ---------------- */}
      <div
        className={`${styles.pane} ${styles.paneVerso}`}
        data-side="verso"
        data-open={mode === "verso"}
        inert={mode === "recto"}
        onMouseEnter={narrow ? undefined : () => commit("verso")}
        onClick={narrow ? () => commit("verso") : undefined}
      >
        <p className={`${styles.eyebrow} ${styles.eyebrowVerso}`}>
          {identity.role}
          <strong>{identity.company}</strong>
        </p>
        <div />
        <div className={styles.foot}>
          <p className={`${styles.claim} ${styles.claimVerso}`}>{identity.spreadLine.verso}</p>
          <p className={`${styles.deep} ${styles.deepVerso}`}>{bio.verso}</p>
          <ul className={styles.figures}>
            {[chubb.figure!, emea.figure!, quilter.figure!].map((f) => (
              <li key={f.label} className={styles.figure}>
                <span className={styles.figureValue}>
                  <CountUp figure={f} run={mode === "verso"} />
                </span>
                <span className={styles.figureLabel}>{f.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ---------------- recto: measured in readers ---------------- */}
      <div
        className={`${styles.pane} ${styles.paneRecto}`}
        data-side="recto"
        data-open={mode === "recto"}
        inert={mode === "verso"}
        onMouseEnter={narrow ? undefined : () => commit("recto")}
        onClick={narrow ? () => commit("recto") : undefined}
      >
        <p className={`${styles.eyebrow} ${styles.eyebrowRecto}`}>
          Founder of
          <strong>The Daily Canon</strong>
        </p>
        <div />
        <div className={styles.foot}>
          <p className={`${styles.claim} ${styles.claimRecto}`}>{identity.spreadLine.recto}</p>
          <p className={`${styles.deep} ${styles.deepRecto}`}>{bio.recto}</p>
          <ul className={styles.figures}>
            {canon.figures.map((f) => (
              <li key={f.label} className={styles.figure}>
                <span className={styles.figureValue}>
                  <CountUp figure={f} run={mode === "recto"} />
                </span>
                <span className={styles.figureLabel}>{f.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* One h1, set once. "Hal" in the machine's voice, "Wall" in the book's,
          with the seam passing between them at rest. */}
      <div className={styles.nameLayer}>
        <h1 className={styles.name}>
          <span className={styles.nameHal}>Hal</span>{" "}
          <span className={styles.nameWall}>Wall</span>
        </h1>
      </div>

      <div className={styles.portraitLayer}>
        {/*
          One image, two grades, clipped by the same number as the panes: cold
          and technical on the verso, warm on the recto, changing at the seam.

          This frame is INTERIM. It is a real photograph of Hal rather than a
          stock stranger, but it is an arm's-length wildcamp selfie with no
          directional key, so it cannot do what the design asks of it. See
          PHOTOGRAPHER_BRIEF.md — the commissioned frame drops in here.
        */}
        <Image
          className={`${styles.portrait} ${styles.portraitVerso}`}
          src={PORTRAIT}
          alt={`${identity.name}. Interim frame; the commissioned portrait is still to be shot.`}
          fill
          priority
          sizes="(max-width: 760px) 56vw, 330px"
        />
        <Image
          className={`${styles.portrait} ${styles.portraitRecto}`}
          src={PORTRAIT}
          alt=""
          aria-hidden="true"
          fill
          sizes="(max-width: 760px) 56vw, 330px"
        />
        <span className={styles.portraitCaption}>Interim frame — portrait to be commissioned</span>
      </div>

      <div className={styles.seam} aria-hidden="true" />

      {!narrow && (
        <button
          type="button"
          className={styles.handle}
          onKeyDown={onHandleKeyDown}
          aria-label="Move the seam: left gives the page to the founder, right to the engineer"
          onFocus={() => setTouched(true)}
        >
          <span className={styles.handleGlyph} aria-hidden="true">
            ‹›
          </span>
        </button>
      )}

      <p className={styles.hint} aria-hidden="true">
        {narrow ? "tap a side to open it" : "drag the seam · or just use the menu"}
      </p>
    </section>
  );
}
