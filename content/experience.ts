import { tdcIcon } from "./media";
import type { Figure } from "./types";

export interface Role {
  slug: string;
  /** Org mark, fetched from the company's own site. See public/media/orgs. */
  logo?: string;
  title: string;
  company: string;
  /** Kept separate from `company` so the consultancy placement never reads as churn. */
  via?: string;
  companyUrl?: string;
  start: string;
  end: string | "present";
  dateRange: string;
  description: string;
  skills: string[];
  /** The one number this role is remembered by. Drives the counting ledger on /work. */
  figure?: Figure;
}

export const experience: Role[] = [
  {
    slug: "chubb-ai-engineer",
    logo: "/media/orgs/chubb.webp",
    title: "AI Engineer, Global Analytics",
    company: "Chubb Insurance",
    companyUrl: "https://www.chubb.com",
    start: "2026-06",
    end: "present",
    dateRange: "Jun 2026 — Present",
    description:
      "Building AI systems on top of the global data estate: applying language models and probabilistic methods to problems that were previously handled by rules, and putting the results somewhere underwriters can actually use them.",
    skills: ["Python", "SQL", "Databricks", "PySpark", "Azure", "Next.js", "FastAPI"],
  },
  {
    slug: "chubb-global-analytics",
    logo: "/media/orgs/chubb.webp",
    title: "Data Engineer, Global Analytics",
    company: "Chubb Insurance",
    companyUrl: "https://www.chubb.com",
    start: "2025-08",
    end: "present",
    dateRange: "Aug 2025 — Present",
    description:
      "Leading the design and build of Chubb's curated external company data asset across EMEA and Global, owning entity resolution, vendor data conflation, and data architecture across multiple commercial providers and millions of records. Built a probabilistic entity resolution pipeline with a 300× runtime improvement over the production system it replaced. Developed a full-stack automated pipeline dashboard using Next.js, FastAPI and Tailwind.",
    skills: ["Python", "SQL", "Databricks", "PySpark", "Azure", "Next.js", "FastAPI"],
    figure: { value: 300, suffix: "×", label: "faster than the system it replaced" },
  },
  {
    slug: "daily-canon",
    logo: tdcIcon,
    title: "Founder and Curator",
    company: "The Daily Canon",
    companyUrl: "https://thedailycanon.org",
    start: "2023-10",
    end: "present",
    dateRange: "Oct 2023 — Present",
    description:
      "Built and runs a literary calendar on iOS and the web: one carefully chosen work of literature a day, drawn from a growing canon. Everything from the editorial curation to the Next.js and Supabase behind it, the Capacitor iOS build, and the subscriptions. Featured on the App Store.",
    skills: ["Next.js", "TypeScript", "Supabase", "Capacitor"],
    figure: { value: 10000, suffix: "+", label: "downloads" },
  },
  {
    slug: "axa",
    logo: "/media/orgs/axa.webp",
    title: "Data Engineer",
    company: "AXA Insurance",
    via: "Kubrick Group",
    companyUrl: "https://www.axa.co.uk",
    start: "2025-06",
    end: "2025-08",
    dateRange: "Jun 2025 — Aug 2025",
    description:
      "Built an automated deletion and retention framework ensuring GDPR compliance across every layer of a medallion architecture, tested to guarantee zero accidental deletions. Created architectural documentation for complex metadata-driven infrastructure, adopted by both the consultant and internal engineering teams.",
    skills: ["Python", "Databricks", "Azure Data Factory", "Azure DevOps"],
    figure: { value: 0, label: "accidental deletions, by design" },
  },
  {
    slug: "chubb-emea-analytics",
    logo: "/media/orgs/chubb.webp",
    title: "Data Engineer, EMEA Analytics",
    company: "Chubb Insurance",
    via: "Kubrick Group",
    companyUrl: "https://www.chubb.com",
    start: "2024-11",
    end: "2025-05",
    dateRange: "Nov 2024 — May 2025",
    description:
      "Refactored a 30,000-line legacy pipeline from monolithic notebooks into modular PySpark, reducing runtime from 270 minutes to 45. Delivered end-to-end data products supporting AI-driven risk modelling and virtual portfolio analysis. Shaped platform governance during the Azure migration, implementing Unity Catalog and automating critical pipelines with Kafka and Databricks Workflows.",
    skills: ["Python", "SQL", "Databricks", "PySpark", "Azure", "Unity Catalog", "Kafka"],
    figure: { from: 270, value: 45, unit: "min", label: "pipeline runtime, down from 270" },
  },
  {
    slug: "quilter",
    logo: "/media/orgs/quilter.webp",
    title: "Junior Data Engineer",
    company: "Quilter Financial Planning",
    via: "Kubrick Group",
    companyUrl: "https://www.quilter.com",
    start: "2022-10",
    end: "2024-11",
    dateRange: "Oct 2022 — Nov 2024",
    description:
      "Designed a custom PySpark CDC solution on Databricks that reduced data volumes by 85% and cut file transfer times from over an hour to 15 minutes. Architected a JSON-driven contract system enabling dynamic toggling of data file production without code changes. Led sprint planning and backlog grooming across cross-functional squads.",
    skills: ["Databricks", "Azure Data Factory", "Python", "SQL", "PySpark", "Power BI"],
    figure: { value: 85, suffix: "%", label: "reduction in data volume" },
  },
  {
    slug: "kubrick-trainee",
    logo: "/media/orgs/kubrick.webp",
    title: "Data Engineering Trainee",
    company: "Kubrick Group",
    companyUrl: "https://www.kubrickgroup.com",
    start: "2022-05",
    end: "2022-10",
    dateRange: "May 2022 — Oct 2022",
    description:
      "Six months of full-time training in distributed data engineering before the first placement: Spark, cloud architecture, testing and the parts of SQL that only matter at scale.",
    skills: ["Python", "SQL", "PySpark", "Azure", "Git"],
  },
  {
    slug: "twogether",
    logo: "/media/orgs/twogether.webp",
    title: "Marketing Executive",
    company: "Twogether",
    companyUrl: "https://www.wearetwogether.com",
    start: "2021-03",
    end: "2022-04",
    dateRange: "Mar 2021 — Apr 2022",
    description:
      "Owned analytics reporting across B2B marketing campaigns. Piloted and scaled an employee advocacy programme. Collaborated on diversity and inclusion initiatives while managing stakeholder relationships.",
    skills: ["Analytics", "Campaign Management", "Stakeholder Engagement"],
  },
  {
    slug: "wallcache",
    logo: "/media/brand/wallcache-mono-alt.png",
    title: "Founder, Freelance Designer",
    company: "WallCache",
    companyUrl: "/making",
    start: "2019-10",
    end: "2021-05",
    dateRange: "Oct 2019 — May 2021",
    description:
      "Founded a creative consultancy delivering photography, branding and design work. Managed client relationships and design roadmaps, creating visual identities for businesses ranging from startups to established brands.",
    skills: ["Photography", "Graphic Design", "Creative Direction", "Branding"],
  },
];

export interface Education {
  slug: string;
  institution: string;
  logo?: string;
  degree: string;
  dateRange: string;
  details?: string;
  /** What it actually consisted of. The section is worth more than two lines. */
  highlights?: string[];
}

/** Present on the old site's data layer but rendered nowhere. It belongs on /work. */
export const education: Education[] = [
  {
    slug: "imperial-physics",
    institution: "Imperial College London",
    logo: "/media/orgs/imperial.webp",
    degree: "BSc Physics with Theoretical Physics",
    dateRange: "2017 — 2020",
    details:
      "Three years of being taught to take a system apart until you can see what it is actually doing, which turns out to be most of data engineering in different notation. Every module carried real statistical analysis, experimental research or programming.",
    highlights: [
      "Final year thesis: a mathematical derivation of the Black-Scholes-Merton model from physical first principles, supervised by Professor Dimitri Vvedensky. An option price treated as a diffusion problem rather than a finance one",
      "Year two computing project: object-oriented optical ray tracing, investigating lens performance",
      "Statistical mechanics, quantum mechanics, electromagnetism, atomic and nuclear physics, optics",
      "Mathematical methods, Fourier analysis, vector calculus and differential equations",
      "Medical imaging and MRI",
    ],
  },
  {
    slug: "imperial-business-analytics",
    institution: "Imperial College Business School",
    logo: "/media/orgs/imperial.webp",
    degree: "Business Analytics: From Data to Decisions",
    dateRange: "Feb — Jun 2022",
    details:
      "A deliberate bridge from the physics to the commercial side: the same maths, pointed at questions someone is paying to have answered.",
    highlights: [
      "Regression, nearest neighbours, decision trees, support vector machines and clustering",
      "Summarising and visualising data so a decision can actually be made from it",
      "Linear and integer programming applied to real business scenarios",
    ],
  },
  {
    slug: "datacamp",
    institution: "DataCamp",
    logo: "/media/orgs/datacamp-cert.webp",
    degree: "Career Track: Data Science with Python",
    dateRange: "Feb — Apr 2022",
    details: "Completed at 100%.",
    highlights: [
      "Statistical and machine learning techniques against real datasets, including decision trees and natural language processing",
      "Importing, cleaning, manipulating and visualising data in Python",
      "Pandas, NumPy and Matplotlib",
    ],
  },
  {
    slug: "databricks-lakehouse",
    institution: "Databricks",
    logo: "/media/orgs/databricks-cert.webp",
    degree: "Lakehouse Fundamentals",
    dateRange: "2022",
    details:
      "The platform most of the last four years has been built on, certified the year he started building on it in earnest.",
  },
  {
    slug: "malvern",
    institution: "Malvern College",
    logo: "/media/orgs/malvern.webp",
    degree: "A-Levels and iGCSEs",
    dateRange: "2012 — 2017",
    details:
      "A-Levels in Physics, Mathematics and Further Mathematics, all at A*. Twelve iGCSEs, all at A*.",
    highlights: [
      "A-Levels 2017: Physics (A*), Mathematics (A*), Further Mathematics (A*)",
      "iGCSEs 2015: English Language, English Literature, Mathematics, Additional Mathematics, Physics, Chemistry, Biology, French, Latin, Geography, History and Art, all at A*",
      "Duke of Edinburgh Gold: two five-day, 100km expeditions across Dartmoor and Snowdonia, alongside charity work",
      "Captain of the 1st XI hockey team, running training and match strategy",
    ],
  },
];
