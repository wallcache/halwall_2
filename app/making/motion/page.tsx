import type { Metadata } from "next";
import { PageShell, shellStyles } from "@/components/PageShell";
import { MotionGrid } from "@/components/MotionGrid";

export const metadata: Metadata = {
  title: "Motion",
  description: "Logo animation and motion graphics built in After Effects.",
};

export default function MotionPage() {
  return (
    <PageShell
      side="verso"
      eyebrow="Making · 03"
      title="Motion"
      standfirst="Logo animation and motion graphics, built in After Effects. Hover to play; they are all short."
    >
      <section className={shellStyles.section}>
        <MotionGrid />
      </section>
    </PageShell>
  );
}
