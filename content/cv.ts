/**
 * The parts of the CV that are not already on the site.
 *
 * Everything else -- roles, dates, descriptions, education -- comes from
 * content/experience.ts, and the projects from content/projects.ts, so the CV
 * and /work cannot drift apart. The old PDF had drifted badly: it still said
 * 6,000 downloads and described the iOS app as Capacitor.
 */
export const cv = {
  tagline: "From first principles to production pipelines.",
  summary:
    "Data and AI engineer with over four years of experience designing production-grade pipelines and cloud-native architectures across insurance and finance. Currently building AI systems on top of Chubb's global data estate, working across North America, EMEA and APAC to support data-driven underwriting and risk assessment at enterprise scale. Trained in Theoretical Physics at Imperial College London, which is where the habit of taking a system apart to see what it is actually doing came from.",

  /** The terminal line under the name. The engineer's half of the site, in one line. */
  prompt: { user: "hal@chubb", path: "~", role: "ai_engineer" },

  contact: [
    { label: "Location", value: "Barnes, London" },
    { label: "Email", value: "henry.n.wall@gmail.com" },
    { label: "Phone", value: "07516 188203" },
    { label: "Site", value: "halwall.me" },
    { label: "LinkedIn", value: "henrynwall" },
  ],

  capabilities: [
    { group: "Languages", items: ["Python", "PySpark", "SQL", "TypeScript"] },
    { group: "Platforms", items: ["Databricks", "Azure", "Kafka", "Delta Lake", "ADF", "Unity Catalog", "Supabase"] },
    { group: "DevOps and methods", items: ["Git", "CI/CD", "Azure DevOps", "Agile/Scrum", "Tableau", "Power BI"] },
  ],

  interests: [
    "Reading",
    "Hiking",
    "Wildcamping",
    "App development",
    "Dog training",
    "Guitar",
    "French (B2)",
    "Cooking",
    "Running",
  ],
} as const;

/**
 * A role's prose, cut into the bullets a CV wants.
 *
 * The site writes each role as a short paragraph, which is right on a page you
 * read and wrong on a page that gets skimmed in ten seconds. Splitting on
 * sentence ends gives the two or three lines the old CV had, without keeping a
 * second copy of every description in a second file to fall out of date.
 */
export function bullets(description: string): string[] {
  return description
    .split(/(?<=\.)\s+(?=[A-Z])/)
    .map((s) => s.trim())
    .filter(Boolean);
}
