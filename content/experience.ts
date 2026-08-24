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
    degree: "BSc Theoretical Physics",
    dateRange: "2017 — 2020",
    details:
      "Three years of being taught to take a system apart until you can see what it is actually doing, which turns out to be the whole of data engineering with different notation.",
    highlights: [
      "Final year thesis deriving the Black-Scholes-Merton model from physical first principles, treating an option price as a diffusion problem rather than a finance one",
      "Statistical mechanics, quantum theory and computational physics",
      "Numerical methods and simulation in Python and C++",
      "Graduated 2:1",
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
    slug: "datacamp-data-engineer",
    institution: "DataCamp",
    logo: "/media/orgs/datacamp-cert.webp",
    degree: "Data Engineer Associate",
    dateRange: "2024",
    details:
      "Formal coverage of the ground already being worked daily: ingestion, modelling, orchestration and the parts of SQL people skip.",
  },
  {
    slug: "imperial-business-analytics",
    institution: "Imperial College Business School",
    logo: "/media/orgs/imperial.webp",
    degree: "Business Analytics",
    dateRange: "2022",
    details:
      "A deliberate bridge from the physics to the commercial side: the same maths, pointed at questions someone is paying to have answered.",
    highlights: [
      "Machine learning techniques and model selection",
      "Data visualisation and the honest presentation of uncertainty",
      "Optimisation in Python",
    ],
  },
];
