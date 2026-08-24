import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { IBM_Plex_Mono, IBM_Plex_Sans, IBM_Plex_Serif } from "next/font/google";
import { GutterProvider, type Mode } from "@/lib/gutter";
import { Header } from "@/components/Header";
import { Preloader } from "@/components/Preloader";
import { MagneticProvider } from "@/components/MagneticProvider";
import { Footer } from "@/components/Footer";
import { SmoothScroll } from "@/components/SmoothScroll";
import { identity, bio } from "@/content/identity";
import "@/styles/globals.css";

/**
 * One superfamily, two voices. Plex Mono was drawn for terminals and Plex
 * Serif for books; they share a skeleton, which is the argument the whole
 * site is making — the engineer and the founder are the same person.
 */
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

const plexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-plex-serif",
  display: "swap",
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://halwall.me"),
  title: {
    default: `${identity.name} · ${identity.role}, ${identity.company}`,
    template: `%s · ${identity.name}`,
  },
  description: bio.twoSentence,
  openGraph: {
    title: `${identity.name} · ${identity.tagline}`,
    description: bio.twoSentence,
    url: "https://halwall.me",
    siteName: identity.name,
    locale: "en_GB",
    type: "website",
  },
  authors: [{ name: identity.professionalName, url: "https://halwall.me" }],
  creator: identity.professionalName,
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbf8f1" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0d0f" },
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // The split is a reading preference, so it survives a reload and a return
  // visit rather than resetting to the spread every time.
  const stored = (await cookies()).get("rv-side")?.value;
  const initial: Mode =
    stored === "verso" || stored === "recto" ? stored : "spread";
  const initialGutter = initial === "verso" ? 1 : initial === "recto" ? 0 : 0.5;

  return (
    <html
      lang="en-GB"
      className={`${plexMono.variable} ${plexSerif.variable} ${plexSans.variable}`}
      style={{ "--gutter": initialGutter } as React.CSSProperties}
    >
      <body>
        <GutterProvider initial={initial}>
          <MagneticProvider />
          <Preloader />
          <SmoothScroll />
          <a className="skip-link" href="#main">
            Skip to content
          </a>
          <Header />
          {children}
          <Footer />
        </GutterProvider>
      </body>
    </html>
  );
}
