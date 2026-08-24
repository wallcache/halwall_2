import type { Metadata } from "next";
import { cookies } from "next/headers";
import { PageShell, shellStyles } from "@/components/PageShell";
import { UnlockForm } from "@/components/UnlockForm";
import { privateVideos } from "@/content/private";
import { COOKIE_NAME, verifyToken } from "@/lib/gated";

export const metadata: Metadata = {
  title: "Private",
  robots: { index: false, follow: false },
};

export default async function PrivatePage() {
  const unlocked = verifyToken("private", (await cookies()).get(COOKIE_NAME)?.value);

  return (
    <PageShell
      side="verso"
      eyebrow="You found the full stop"
      title="Private"
      standfirst={unlocked ? undefined : "Not for everyone. If you were meant to be here you know the word."}
    >
      <section className={shellStyles.section}>
        {unlocked ? (
          privateVideos.map((v) => (
            <figure key={v.driveId} style={{ marginBottom: "2rem" }}>
              <figcaption className={shellStyles.sectionHead}>{v.year}</figcaption>
              <iframe
                src={`https://drive.google.com/file/d/${v.driveId}/preview`}
                title={`${v.year} film`}
                allow="autoplay"
                style={{ width: "100%", aspectRatio: "16 / 9", border: "1px solid var(--rule)" }}
              />
            </figure>
          ))
        ) : (
          <UnlockForm slug="private" label="Private area" />
        )}
      </section>
    </PageShell>
  );
}
