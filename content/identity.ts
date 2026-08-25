import type { Link } from "./types";

export const identity = {
  name: "Hal Wall",
  /** Used on the CV, in structured data, and anywhere a legal name is right. */
  professionalName: "Henry Wall",
  role: "AI Engineer, Global Analytics",
  company: "Chubb Insurance",
  /**
   * The recto's eyebrow, in two parts to mirror the verso's role-then-employer.
   * "Founder of The Daily Canon" alone described one of the four things this
   * side of the site is actually about.
   */
  otherRoles: "Photographer, designer, walker,",
  founderLine: "founder of",
  founderOrg: "The Daily Canon",
  location: "Barnes, London",
  email: "henry.n.wall@gmail.com",
  tagline: "Somewhere between Databricks and Dickens.",
  /**
   * The hero line, one clause per side of the gutter.
   *
   * First person. The site talks about Hal in the third person everywhere it
   * is describing him to someone else, but the hero is him introducing
   * himself, and "one half of him" read like a caption in somebody else's
   * profile of the man.
   */
  spreadLine: {
    verso: "I build the data systems an insurer runs on.",
    recto: "I run an app that gives you one work of literature a day.",
  },
} as const;

export const bio = {
  twoSentence:
    "Hal Wall is a data engineer at Chubb, where he builds the global data infrastructure behind underwriting and risk. He is also the founder of The Daily Canon, which sends one work of literature into the world every day and has been an App Store App of the Day.",
  verso: `Four years of production pipelines and cloud-native architecture across insurance and finance, now building AI systems on top of them. At Chubb he architects global datasets across North America, EMEA and APAC, the ones underwriting and risk assessment run on. Trained in Theoretical Physics at Imperial, which is where the habit of taking a system apart to see what it is actually doing came from.`,
  recto: `Outside work he builds things: The Daily Canon, a literary app that delivers one work a day; Renovision, an AI property tool; and Timewell, an annual leave planner. He is a long-distance runner, a hiker and wildcamper, and an enthusiastic dog owner, often found in the wilder corners of the UK with Japhy, his Wirehaired Vizsla.`,
} as const;

export const socials: (Link & { name: string; icon: "github" | "linkedin" | "instagram" | "mail" })[] = [
  { name: "GitHub", text: "wallcache", url: "https://github.com/wallcache", icon: "github" },
  { name: "LinkedIn", text: "henrynwall", url: "https://www.linkedin.com/in/henrynwall/", icon: "linkedin" },
  { name: "Instagram", text: "wallcache", url: "https://instagram.com/wallcache", icon: "instagram" },
  { name: "Email", text: "henry.n.wall@gmail.com", url: "mailto:henry.n.wall@gmail.com", icon: "mail" },
];

export const cvPath = "/media/cv/Hal_Wall_CV.pdf";
