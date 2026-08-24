import { getProject } from "./projects";

/** /canon is the recto's home page. The project record stays the single source of truth. */
export const canonProject = getProject("the-daily-canon")!;

export const canon = {
  title: "The Daily Canon",
  standfirst: "One great work of literature, every day.",
  body: [
    `366 carefully chosen works spanning three millennia of human expression. Novels, poems, short stories, essays, plays, philosophy. One assigned to every day of the year.`,
    `Open the app, see today's work, and let the daily rhythm turn reading from aspiration into practice. There is no feed, no backlog, and nothing to catch up on: whatever today's work is, that is the whole of it.`,
  ],
  press: {
    label: "App Store",
    honour: "App of the Day",
  },
  /** Served locally rather than hotlinked from thedailycanon.org, as it was before. */
  appleMark: "/media/brand/apple-mark.svg",
  wordmark: "/media/brand/tdc-wordmark.svg",
} as const;
