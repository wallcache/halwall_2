import { getProject } from "./projects";

/**
 * /canon is the recto's home page — the founder half of the argument.
 *
 * Everything here is drawn from the live app and its repo (1-apps/tdc):
 * the 366-work dataset, the README, and the shipped feature set. The counts
 * are real counts, not marketing.
 */

export const canonProject = getProject("the-daily-canon")!;

export const canon = {
  title: "The Daily Canon",
  standfirst: "One work of literature a day, from four thousand years of it.",

  intro: [
    `A literary calendar. Each day surfaces one curated work with a blurb, author context and metadata. You track what you have read, build a reading list, keep a streak, and — with a subscription — read the full text in the app.`,
    `It is not about speed-reading the classics or ticking boxes. It is about returning, daily, to language that has endured. The rhythm turns reading from an aspiration into a practice: modest enough to keep, meaningful enough to compound.`,
  ],

  /** The best writing in the whole project. It belongs on the page verbatim. */
  fishing: {
    heading: "Reading like fishing",
    body: [
      `Imagine sitting on a riverbank with a line in the water. While you wait, you are reading. Most of the time nothing bites. You move on, you try another stretch of river. But occasionally something does bite, and when it does you know immediately. A writer reaches you in a way you were not expecting. A sentence stops you. A book follows you around for weeks after you have finished it.`,
      `The Daily Canon is designed to keep your line in the water across as broad a stretch of the literary river as possible. You may find that Tolstoy leaves you cold but Borges will not let you go. That you can take or leave the great realists but something in Kafka speaks directly to you. That a short story you had never heard of, on an unremarkable Tuesday in March, turns out to be the book you needed.`,
    ],
    pull: `We can't tell you which works will bite. We can only put enough of them in front of you that some will.`,
  },

  /** Straight from the 366-work dataset. */
  composition: {
    heading: "What is in it",
    note: "366 works, one for every day of the year including the leap. 34 original languages, 46 nationalities, and a span from the Epic of Gilgamesh to Bolaño.",
    forms: [
      { name: "Novel", count: 164 },
      { name: "Poem", count: 51 },
      { name: "Philosophy", count: 31 },
      { name: "Play", count: 31 },
      { name: "Short story", count: 23 },
      { name: "Epic poem", count: 15 },
      { name: "Novella", count: 12 },
      { name: "Essay", count: 8 },
      { name: "Other forms", count: 31 },
    ],
    span: [
      { label: "Oldest", value: "The Epic of Gilgamesh", meta: "c. 2100 BC" },
      { label: "Newest", value: "2666", meta: "Bolaño, 2004" },
    ],
  },

  /** Six dates every reader shares, every year. */
  feasts: {
    heading: "The fixed feasts",
    note: "Most works are movable — each carries several candidate days and reaches you on whichever arrives first in your journey. Six are fixed, and every reader gets them on the same day.",
    items: [
      { date: "25 December", work: "A Christmas Carol", author: "Dickens", why: "Christmas Day" },
      { date: "16 June", work: "Ulysses", author: "Joyce", why: "Bloomsday" },
      { date: "6 January", work: "The Dead", author: "Joyce", why: "Epiphany" },
      { date: "14 February", work: "Wuthering Heights", author: "Brontë", why: "Valentine's Day" },
      { date: "31 October", work: "Dracula", author: "Stoker", why: "Halloween" },
      {
        date: "29 February",
        work: "In Search of Lost Time",
        author: "Proust",
        why: "What better day for a book consumed with the moments that happen in between things",
      },
    ],
  },

  dates: {
    heading: "Why these dates",
    body: [
      `Works arrive on days that carry meaning. Each one holds several candidate days — an author's birthday, a national day, a festival, a sly topical wink — and a greedy picker assigns it to whichever of its days comes first in your particular journey. The same book finds one reader in October and another in March, each on a day with a real claim to it.`,
      `This does mean a work sometimes arrives not because it is a writer's greatest achievement but because it is the right work for a particular day. A Christmas Carol is not Dickens at his most ambitious. But something has to belong to Christmas Day, and there it is, exactly where it belongs.`,
    ],
  },

  features: {
    heading: "What it does",
    items: [
      { name: "The library", detail: "128+ full texts read in-app, chapter by chapter, with bookmarks and progress. Sourced from Project Gutenberg and formatted by hand." },
      { name: "Visual themes", detail: "48 work-specific themes — CSS, animation and WebGL — that transform the page for works like Hamlet, Moby-Dick and Wuthering Heights." },
      { name: "Reading paths", detail: "Curated thematic journeys through the canon: The Dark Mirror for gothic and horror, Woolf's Room for women writers, The Philosopher's Path." },
      { name: "Bloomy", detail: "An AI literary companion built on Claude, for talking through a work, chasing a theme, or asking what to read next." },
      { name: "Its own weather", detail: "Every book gets an ambience: rain, wind, fire, waves, a train. Use the suggested mix or build your own from The storm, By the fire, The riverbank, A window seat." },
      { name: "Immersions", detail: "One work, held for days, read together with a cohort. The Chekhov Ten, The Dickinson Immersion, Aesop's Fables." },
      { name: "My Canon", detail: "Rank what you have read against what you have read before, one binary choice at a time, and get a reader type out of it." },
      { name: "Streaks and badges", detail: "Consecutive days of reading, freezes when life happens, milestone badges, reader tiers and a leaderboard." },
      { name: "On iOS", detail: "A native wrapper via Capacitor, with push notifications, deep links, Spotlight indexing and haptics." },
    ],
  },

  build: {
    heading: "How it is built",
    items: [
      { layer: "Framework", tech: "Next.js 15, App Router, TypeScript" },
      { layer: "Database", tech: "Supabase Postgres with row-level security" },
      { layer: "Cache", tech: "Upstash Redis" },
      { layer: "AI", tech: "Anthropic Claude — Bloomy and reading summaries" },
      { layer: "Payments", tech: "RevenueCat, iOS in-app purchases" },
      { layer: "Push", tech: "Apple Push Notification Service, hourly cron" },
      { layer: "iOS", tech: "Capacitor wrapper, PWA service worker" },
      { layer: "Type", tech: "Crimson Text, Spectral, Caveat" },
    ],
  },

  press: { label: "App Store", honour: "Featured on the App Store" },
  wordmark: "/media/brand/tdc-wordmark.svg",
  appleMark: "/media/brand/apple-mark.svg",
} as const;
