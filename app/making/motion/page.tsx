import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import shell from "@/components/PageShell.module.css";
import { MotionGrid } from "@/components/MotionGrid";

export const metadata: Metadata = {
  title: "Motion",
  description: "Logo animation and motion graphics built in After Effects.",
};

export default function MotionPage() {
  return (
    <PageShell
      side="recto"
      eyebrow="Making · 03"
      title="Motion"
      standfirst="Logo animation and motion graphics, built in After Effects. All of them are running; they are all short."
    >
      <section className={shell.section}>
        <MotionGrid />
      </section>
    </PageShell>
  );
}
