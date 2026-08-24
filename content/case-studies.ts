import type { Figure } from "./types";

/**
 * DRAFT — needs Hal's review before launch.
 *
 * The brief asks /work to be three case studies rather than bullet lists, and
 * neither the old site nor the handoff had a single one. These are drafted
 * from the CV and the existing role descriptions. Everything here is derived
 * from claims Hal has already made in public; nothing has been invented. The
 * architecture and constraint sections are the parts most likely to need
 * correcting, since they infer detail the CV only implies.
 */

export interface CaseStudy {
  slug: string;
  roleSlug: string;
  title: string;
  standfirst: string;
  headline: Figure;
  sections: { heading: string; body: string }[];
  stack: string[];
  needsReview: true;
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "entity-resolution",
    roleSlug: "chubb-global-analytics",
    title: "Resolving one company from many records",
    standfirst:
      "Chubb buys company data from several commercial providers. None of them agree on what a company is called, where it is registered, or whether two records are the same business. The curated external company data asset is the answer to that, and entity resolution is its hardest part.",
    headline: { value: 300, suffix: "×", label: "faster than the system it replaced" },
    sections: [
      {
        heading: "The problem",
        body: "Underwriting and risk decisions rest on knowing which records refer to the same company. Across multiple vendors and millions of records, the same business appears under different legal names, trading names, addresses and identifiers. Deterministic matching on any single field is either too strict, and splits one company into many, or too loose, and merges companies that are unrelated.",
      },
      {
        heading: "The constraint",
        body: "The production system it replaced was correct enough to be trusted but slow enough that it could not be re-run freely. That is the worst combination: it makes the data asset something you inherit rather than something you interrogate. Any replacement had to be materially faster without being less defensible, because a probabilistic match that nobody can explain is not usable in an underwriting context.",
      },
      {
        heading: "The approach",
        body: "A probabilistic entity resolution pipeline: blocking to reduce the candidate space to comparisons worth making, then scored comparison across name, address and identifier fields, with the scoring surfaced rather than buried so a human can see why two records were joined. Built on PySpark over Databricks so the comparison stage distributes rather than serialising.",
      },
      {
        heading: "The outcome",
        body: "A 300× runtime improvement over the production system it replaced, which changes what the asset is for: it becomes something you can re-run against new vendor data and re-examine, rather than a monthly artefact. A full-stack pipeline dashboard in Next.js and FastAPI put the run state in front of the people who depend on it.",
      },
    ],
    stack: ["Python", "PySpark", "Databricks", "Azure", "Next.js", "FastAPI"],
    needsReview: true,
  },
  {
    slug: "thirty-thousand-lines",
    roleSlug: "chubb-emea-analytics",
    title: "Thirty thousand lines, taken apart",
    standfirst:
      "A legacy EMEA analytics pipeline had grown to 30,000 lines of monolithic notebook code and a 270-minute runtime. Refactored into modular PySpark, it now runs in 45.",
    headline: { from: 270, value: 45, unit: "min", label: "runtime, down from 270" },
    sections: [
      {
        heading: "The problem",
        body: "Notebooks are an excellent place to start a pipeline and a poor place to leave one. Thirty thousand lines of it meant no unit boundaries, no reuse, and a 270-minute runtime that put a hard ceiling on how often anything could be checked. A four-and-a-half hour feedback loop is not a feedback loop.",
      },
      {
        heading: "The constraint",
        body: "It could not stop producing output while it was rewritten. The downstream risk models and virtual portfolio analysis depended on it, so the refactor had to proceed underneath a running system rather than replacing it in one move.",
      },
      {
        heading: "The approach",
        body: "Decompose into modular PySpark with real boundaries, so units could be reasoned about and tested independently. In parallel, shape platform governance during the Azure migration: Unity Catalog for lineage and access, and Kafka with Databricks Workflows to automate the pipelines that were still being triggered by hand.",
      },
      {
        heading: "The outcome",
        body: "270 minutes to 45 — a six-fold reduction, which is the difference between a pipeline you run overnight and one you run when you have a question. The modular structure is the more durable half of the result: the runtime is what people notice, the boundaries are what let the next person change it.",
      },
    ],
    stack: ["PySpark", "Databricks", "Azure", "Unity Catalog", "Kafka"],
    needsReview: true,
  },
  {
    slug: "deletion-that-cannot-overreach",
    roleSlug: "axa",
    title: "A deletion framework that cannot overreach",
    standfirst:
      "GDPR requires that data be deleted. A medallion architecture makes that genuinely hard, because the same subject is present at every layer in a different shape. The framework had to guarantee it deleted everything it should, and nothing it should not.",
    headline: { value: 0, label: "accidental deletions, by design" },
    sections: [
      {
        heading: "The problem",
        body: "Bronze, silver and gold hold the same subject differently: raw, conformed, aggregated. Deleting a subject means finding every representation without a single canonical key to follow, and retention rules differ per layer and per dataset.",
      },
      {
        heading: "The constraint",
        body: "The asymmetry of failure is the whole design problem. Failing to delete is a compliance breach. Deleting too much is unrecoverable. A framework that is merely mostly right is not usable, so the guarantee had to be structural rather than a matter of care.",
      },
      {
        heading: "The approach",
        body: "A metadata-driven framework: retention and deletion rules declared as configuration rather than written per-dataset, so the rules can be reviewed as a set. Automated across every layer of the medallion architecture, and tested specifically against the over-deletion case rather than only the happy path.",
      },
      {
        heading: "The outcome",
        body: "Compliance across all layers with a tested guarantee of zero accidental deletions. The architectural documentation written alongside it was adopted by both the consultant and internal engineering teams, which is the part that outlasts the engagement.",
      },
    ],
    stack: ["Python", "Databricks", "Azure Data Factory", "Azure DevOps"],
    needsReview: true,
  },
];
