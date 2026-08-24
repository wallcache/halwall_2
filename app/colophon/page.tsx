import type { Metadata } from "next";
import { PageShell, shellStyles } from "@/components/PageShell";
import { colophon } from "@/content/colophon";

export const metadata: Metadata = {
  title: "Colophon",
  description: "The typefaces, palette, stack and decisions behind halwall.me.",
};

const row: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(140px, 1fr) minmax(0, 3fr)",
  gap: "clamp(0.5rem, 2vw, 2rem)",
  padding: "1rem 0",
  borderTop: "1px solid var(--rule)",
};

const key: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "var(--step--1)",
  color: "var(--accent)",
};

export default function ColophonPage() {
  return (
    <PageShell
      side="verso"
      eyebrow="How it is built"
      title="Colophon"
      standfirst="What the site is made of, and why the awkward decisions were made the way they were."
    >
      <section className={shellStyles.section} aria-labelledby="type">
        <h2 id="type" className={shellStyles.sectionHead}>Typefaces</h2>
        {colophon.type.map((t) => (
          <div key={t.name} style={row}>
            <span style={key}>{t.name}</span>
            <div>
              <p className={shellStyles.prose} style={{ color: "var(--ink)" }}>{t.role}</p>
              <p className={shellStyles.prose}>{t.why}</p>
            </div>
          </div>
        ))}
      </section>

      <section className={shellStyles.section} aria-labelledby="palette">
        <h2 id="palette" className={shellStyles.sectionHead}>Palette</h2>
        {colophon.palette.map((p) => (
          <div key={p.value} style={row}>
            <span style={key}>
              <span
                aria-hidden="true"
                style={{
                  display: "inline-block",
                  width: "0.8em",
                  height: "0.8em",
                  background: p.value,
                  border: "1px solid var(--rule-strong)",
                  marginRight: "0.5em",
                  verticalAlign: "-0.05em",
                }}
              />
              {p.value}
            </span>
            <div>
              <p className={shellStyles.prose} style={{ color: "var(--ink)" }}>{p.name}</p>
              <p className={shellStyles.prose}>{p.note}</p>
            </div>
          </div>
        ))}
      </section>

      <section className={shellStyles.section} aria-labelledby="stack">
        <h2 id="stack" className={shellStyles.sectionHead}>Stack</h2>
        {colophon.stack.map((s) => (
          <div key={s.name} style={row}>
            <span style={key}>{s.name}</span>
            <p className={shellStyles.prose}>{s.note}</p>
          </div>
        ))}
      </section>

      <section className={shellStyles.section} aria-labelledby="decisions">
        <h2 id="decisions" className={shellStyles.sectionHead}>Decisions</h2>
        {colophon.decisions.map((d) => (
          <div key={d.q} style={row}>
            <span style={key}>{d.q}</span>
            <p className={shellStyles.prose}>{d.a}</p>
          </div>
        ))}
      </section>

      <section className={shellStyles.section} aria-labelledby="budget">
        <h2 id="budget" className={shellStyles.sectionHead}>Performance budget</h2>
        {colophon.budget.map((b) => (
          <div key={b.metric} style={row}>
            <span style={key}>{b.metric}</span>
            <p className={shellStyles.prose}>{b.target}</p>
          </div>
        ))}
      </section>
    </PageShell>
  );
}
