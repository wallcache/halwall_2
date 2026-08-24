import type { Link } from "./types";

export const identity = {
  name: "Hal Wall",
  /** Used on the CV, in structured data, and anywhere a legal name is right. */
  professionalName: "Henry Wall",
  role: "Data Engineer, Global Analytics",
  company: "Chubb Insurance",
  founderLine: "Founder of The Daily Canon",
  location: "Barnes, London",
  email: "henry.n.wall@gmail.com",
  tagline: "Somewhere between Databricks and Dickens.",
  /**
   * The hero line. It states the thesis of the whole site in two clauses,
   * one per side of the gutter.
   */
  spreadLine: {
    verso: "One half of him is measured in runtime.",
    recto: "The other is measured in readers.",
  },
} as const;

/**
 * The two headline pairs, one per side, deliberately symmetrical: two numbers
 * each, and only the ones worth reading. The pipeline internals (85% volume
 * reduction, 30,000 lines) live on /work where there is room to explain them.
 */
export const heroFigures = {
  verso: [
    { value: 300, suffix: "\u00d7", label: "faster than the system it replaced" },
    { from: 270, value: 45, unit: "min", label: "pipeline runtime, down from 270" },
  ],
  recto: [
    { value: 6000, suffix: "+", label: "downloads" },
    { value: 366, label: "works, one for every day" },
  ],
} as const;

export const bio = {
  twoSentence:
    "Hal Wall is a data engineer at Chubb, where he builds the global data infrastructure behind underwriting and risk. He is also the founder of The Daily Canon, which sends one work of literature into the world every day and has been an App Store App of the Day.",
  verso: `Data engineer with over four years designing production-grade pipelines and cloud-native architectures across insurance and finance. Currently architecting global datasets at Chubb, working across North America, EMEA and APAC to enable data-driven underwriting and risk assessment at enterprise scale. Trained in Theoretical Physics at Imperial College London, which is where the habit of taking a system apart to see what it is actually doing came from.`,
  recto: `Outside work he builds things: The Daily Canon, a literary app that delivers one work a day; Renovision, an AI property tool; and Timewell, an annual leave planner. He is a long-distance runner, a hiker and wildcamper, and an enthusiastic dog owner, often found in the wilder corners of the UK with Japhy, his Wirehaired Vizsla.`,
} as const;

export const socials: (Link & { name: string; icon: "github" | "linkedin" | "instagram" | "mail" })[] = [
  { name: "GitHub", text: "wallcache", url: "https://github.com/wallcache", icon: "github" },
  { name: "LinkedIn", text: "henrynwall", url: "https://www.linkedin.com/in/henrynwall/", icon: "linkedin" },
  { name: "Instagram", text: "wallcache", url: "https://instagram.com/wallcache", icon: "instagram" },
  { name: "Email", text: "henry.n.wall@gmail.com", url: "mailto:henry.n.wall@gmail.com", icon: "mail" },
];

export const cvPath = "/media/cv/Hal_Wall_CV.pdf";
