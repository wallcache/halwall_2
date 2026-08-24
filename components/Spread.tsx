"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useGutter } from "@/lib/gutter";
import { register } from "@/lib/parallax";
import { identity, bio } from "@/content/identity";
import { experience } from "@/content/experience";
import { getProject } from "@/content/projects";
import { CountUp } from "./CountUp";
import { DappledLight } from "./DappledLight";
import styles from "./Spread.module.css";

const chubb = experience[0];
const emea = experience.find((r) => r.slug === "chubb-emea-analytics")!;
const quilter = experience.find((r) => r.slug === "quilter")!;
const canon = getProject("the-daily-canon")!;

const NARROW = "(max-width: 760px)";
const PORTRAIT = "/media/portrait/hal.webp";
/** How long after a drag before hovering a pane may take the gutter back. */
const HOVER_SUPPRESS_MS = 700;

export function Spread() {
  const { mode, commit, set, read, settle } = useGutter();
  const heroRef = useRef<HTMLElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const [touched, setTouched] = useState(false);
  const [narrow, setNarrow] = useState(false);
  /**
   * A coarse, throttled mirror of the gutter, purely so the slider can report
   * aria-valuenow. It updates on settle rather than per frame — assistive tech
   * does not need sixty values a second, and React must not see them.
   */
  const [gutterPct, setGutterPct] = useState(50);

  const dragging = useRef(false);
  const last = useRef({ frac: 0.5, t: 0 });
  const velocity = useRef(0);
  const suppressHoverUntil = useRef(0);
  /**
   * Where the gesture began, and how many pixels of cursor travel equal a full
   * 0 -> 1 sweep of the gutter.
   *
   * The gain differs by grab point, and it has to. The seam spans the whole
   * viewport, so it tracks the cursor 1:1 across the hero. The portrait only
   * travels `--portrait-travel`, so if it used the same gain the photo would
   * slide out from under the finger holding it. Matching each source's gain to
   * its own travel is what makes both feel like direct manipulation.
   */
  const grab = useRef({ x: 0, gutter: 0.5, gain: 1 });

  useEffect(() => {
    setGutterPct(Math.round(read() * 100));
  }, [mode, read]);

  useEffect(() => {
    const mq = window.matchMedia(NARROW);
    const sync = () => setNarrow(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // The portrait drifts hardest, because it is the thing the eye tracks.
  useEffect(() => {
    if (!portraitRef.current) return;
    return register(portraitRef.current, { speed: 0.26 });
  }, []);

  const heroWidth = useCallback(
    () => heroRef.current?.getBoundingClientRect().width ?? window.innerWidth,
    [],
  );

  /** Pixels the portrait travels across a full sweep, read from the CSS token. */
  const portraitTravel = useCallback(() => {
    const el = heroRef.current;
    if (!el) return window.innerWidth * 0.34;
    const raw = getComputedStyle(el).getPropertyValue("--portrait-travel").trim();
    const vw = parseFloat(raw);
    if (raw.endsWith("vw") && !Number.isNaN(vw)) return (window.innerWidth * vw) / 100;
    return parseFloat(raw) || window.innerWidth * 0.34;
  }, []);

  /** Hover only takes the gutter when a drag is not in charge of it. */
  const hoverCommit = useCallback(
    (side: "verso" | "recto") => {
      if (narrow || dragging.current) return;
      if (performance.now() < suppressHoverUntil.current) return;
      commit(side);
    },
    [narrow, commit],
  );

  const startDrag = useCallback(
    (e: React.PointerEvent, source: "seam" | "portrait") => {
      if (narrow || e.pointerType === "touch") return;
      if ((e.target as HTMLElement).closest("a")) return;

      dragging.current = true;
      velocity.current = 0;
      grab.current = {
        x: e.clientX,
        gutter: read(),
        gain: source === "seam" ? heroWidth() : portraitTravel(),
      };
      last.current = { frac: read(), t: e.timeStamp };
      setTouched(true);
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      e.preventDefault();
    },
    [narrow, read, heroWidth, portraitTravel],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return;
      const { x, gutter, gain } = grab.current;
      const frac = Math.min(1, Math.max(0, gutter + (e.clientX - x) / gain));

      const dt = Math.max(1, e.timeStamp - last.current.t);
      const instant = ((frac - last.current.frac) / dt) * 1000;
      velocity.current = velocity.current * 0.6 + instant * 0.4;
      last.current = { frac, t: e.timeStamp };
      set(frac);
    },
    [set],
  );

  const endDrag = useCallback(() => {
    if (!dragging.current) return;
    dragging.current = false;
    // Hold hover off while the seam settles, or the release is immediately
    // overridden by whichever pane the cursor happens to be resting on.
    suppressHoverUntil.current = performance.now() + HOVER_SUPPRESS_MS;
    settle(velocity.current);
    setGutterPct(Math.round(read() * 100));
  }, [settle, read]);

  const onHandleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const nudge = (d: number) => {
        set(read() + d);
        setTouched(true);
        suppressHoverUntil.current = performance.now() + HOVER_SUPPRESS_MS;
      };
      if (e.key === "ArrowLeft") { e.preventDefault(); nudge(-0.06); }
      else if (e.key === "ArrowRight") { e.preventDefault(); nudge(0.06); }
      else if (e.key === "Home") { e.preventDefault(); commit("recto"); }
      else if (e.key === "End") { e.preventDefault(); commit("verso"); }
      else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); settle(0); }
    },
    [read, set, commit, settle],
  );

  return (
    <section ref={heroRef} className={styles.hero} data-touched={touched}>
      <DappledLight />

      {/* ---------------- verso: measured in runtime ---------------- */}
      <div
        className={`${styles.pane} ${styles.paneVerso}`}
        data-side="verso"
        data-open={mode === "verso"}
        inert={mode === "recto"}
        onMouseEnter={() => hoverCommit("verso")}
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
        onMouseEnter={() => hoverCommit("recto")}
        onClick={narrow ? () => commit("recto") : undefined}
      >
        <div className={styles.col}>
          <p className={`${styles.eyebrow} ${styles.eyebrowRecto}`}>
            Founder of
            <strong>The Daily Canon</strong>
          </p>
        </div>
        <div />
        <div className={`${styles.col} ${styles.foot}`}>
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

      {/*
        One h1, drawn twice. The second copy is decorative and hidden from the
        accessibility tree, so the name is still announced exactly once.
      */}
      <div className={styles.nameLayer}>
        <div className={styles.nameStack}>
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

      {/*
        The anchor moves with the gutter, the inner element takes the parallax,
        and the whole thing is grabbable: dragging the photograph is the most
        obvious way to move the seam, because the thing you are holding is the
        thing that moves.
      */}
      <div
        className={styles.portraitAnchor}
        data-draggable={!narrow}
        role={narrow ? undefined : "slider"}
        tabIndex={narrow ? undefined : 0}
        aria-label="Move the seam: left gives the page to the founder, right to the engineer"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(gutterPct)}
        aria-valuetext={
          mode === "verso" ? "the engineer" : mode === "recto" ? "the founder" : "both, in balance"
        }
        onPointerDown={narrow ? undefined : (e) => startDrag(e, "portrait")}
        onPointerMove={narrow ? undefined : onPointerMove}
        onPointerUp={narrow ? undefined : endDrag}
        onPointerCancel={narrow ? undefined : endDrag}
        onKeyDown={narrow ? undefined : onHandleKeyDown}
        onFocus={() => setTouched(true)}
      >
        <div ref={portraitRef} className={styles.portraitInner}>
          <Image
            className={`${styles.portrait} ${styles.portraitVerso}`}
            src={PORTRAIT}
            alt={`${identity.name}. Interim frame; the commissioned portrait is still to be shot.`}
            fill
            priority
            sizes="(max-width: 760px) 52vw, 300px"
          />
          <Image
            className={`${styles.portrait} ${styles.portraitRecto}`}
            src={PORTRAIT}
            alt=""
            aria-hidden="true"
            fill
            sizes="(max-width: 760px) 52vw, 300px"
          />
        </div>
        {/* Outside .portraitInner, which clips to round its corners. */}
        <span className={styles.portraitCaption}>Interim frame · drag me</span>
      </div>

      <div className={styles.seam} aria-hidden="true" />

      {!narrow && (
        <>
          {/* A second grab point, for anyone who aims at the line itself. */}
          <div
            className={styles.grab}
            onPointerDown={(e) => startDrag(e, "seam")}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            aria-hidden="true"
          />
        </>
      )}

      <p className={styles.hint} aria-hidden="true">
        {narrow ? "tap a side to open it" : "drag the seam · or use the menu"}
      </p>
    </section>
  );
}
