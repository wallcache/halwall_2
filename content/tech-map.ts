/**
 * Skill label -> icon slug.
 *
 * Deliberately partial. Several things Hal works with have no icon in
 * simple-icons — Azure and the Adobe suite were removed from it over
 * trademark, and "Stakeholder Engagement" was never going to have one — so
 * anything unmapped renders as a plain text pill. That is the normal case,
 * not a gap to be filled with a lookalike.
 */
export const techMap: Record<string, string> = {
  Python: "python",
  SQL: "postgresql",
  PySpark: "apachespark",
  Databricks: "databricks",
  Kafka: "apachekafka",
  "Next.js": "nextdotjs",
  FastAPI: "fastapi",
  TypeScript: "typescript",
  JavaScript: "javascript",
  "Tailwind CSS": "tailwindcss",
  Supabase: "supabase",
  Capacitor: "capacitor",
  React: "react",
  "HTML/CSS": "html5",
  Git: "git",
  Docker: "docker",
  Vercel: "vercel",
};

export const iconFor = (label: string) => techMap[label];
