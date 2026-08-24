import { getProject } from "./projects";
import { tdcIcon } from "./media";

/**
 * /canon, told in Hal's own voice.
 *
 * Drawn from his Medium piece and the app's own docs. First person here, and
 * third person elsewhere on the site, deliberately: this is the one page where
 * he is the founder rather than the subject.
 *
 * Two house rules from the app's docs are observed. The canon is never framed
 * as a fixed "366" — each year adds another year of daily works and the
 * library grows underneath it — and the premium tier is Folio.
 */

export const canonProject = getProject("the-daily-canon")!;

export const canon = {
  title: "The Daily Canon",
  standfirst: "One work of literature a day, drawn from a growing canon that reaches back roughly four millennia.",

  origin: {
    heading: "Why I built it",
    body: [
      `When I was young I devoured books. Then my parents and teachers noticed I had a mathematical brain, and the conveyor belt did what conveyor belts do: I was moved from English literature toward physics, from Dickens toward differential equations. I read Theoretical Physics at Imperial and became, as physics graduates tend to, an extremely rational kind of guy.`,
      `It took years to find my way back to reading, and it did not happen naturally. I had to decide to come back, the way you decide to call an old friend you have been avoiding. And I had a new problem: I could not find the time. So I made myself a rule.`,
    ],
    pull: `If I am going to read something, it had better be worth reading, because it might well be the last thing I read.`,
    after: [
      `That rule changed everything. I started asking anyone who would answer which books are actually worth it, the ones where the time invested cannot possibly be wasted. Across conversations and subreddits the verdict kept converging on the same answer: the classics. Not because they are prestigious or difficult, but because they have already survived the only real test. Centuries of readers have tried to forget them and failed.`,
      `I have since read hundreds of books from the canon and it has changed how I see nearly everything. I used to be an assured atheist. I am no longer sure that stance holds for anyone who reads great literature consistently enough. Something in the accumulated weight of all that human searching makes certainty feel cheap.`,
      `I also build software for a living. So the question became inevitable: what if I built something that brought the two halves together?`,
    ],
  },

  idea: {
    heading: "One day, one work",
    body: [
      `You open the app and it shows you one work of literature for today. Tomorrow, a different one. Novels, poems, short stories, essays, plays, philosophy. The only criterion for inclusion is that a work has survived the one test that matters: rereading.`,
      `The inspiration was Tolstoy's A Calendar of Wisdom. Late in life he compiled quotes and reflections from everything he had read, one page for every day of the year. You turn to today's date and find a handful of ideas arranged around a theme. Some of it is questionable; most of it is very good. I loved the quotidian nature of it, the way it turned reading into a ritual rather than an ambition.`,
      `The Daily Canon points that idea at whole works rather than quotations. Each day you meet a title. Sometimes familiar, sometimes long-intended, often completely new. When something catches you, you save it. When you have read it, you mark it done. The daily rhythm turns reading from an aspiration into a practice: modest enough to keep, meaningful enough to compound.`,
    ],
  },

  curation: {
    heading: "The list was argued into existence",
    body: [
      `Hundreds of hours went into cross-referencing the great literary lists of the Western and Eastern traditions: the Modern Library's hundred, Harold Bloom's Western Canon, LibraryThing's aggregated rankings, and the heated and occasionally unhinged debates of r/classicliterature and r/TrueLit. A work appearing on one list and nowhere else was treated with suspicion. A work appearing on every list was treated with more, because consensus can be a symptom of laziness as easily as of truth.`,
      `Every inclusion is also an exclusion, and a calendar makes that calculus merciless. Shakespeare alone could justify a third of it: King Lear takes one place, Hamlet another, and the rest must yield so that Sophocles and Ibsen and Woolf can breathe. Dickens wrote a dozen masterpieces and gets three, because Tolstoy and Austen and Hugo are waiting. Plath loses Daddy so she can gain The Bell Jar, because Ariel already holds the poetry and the novel does something the poem cannot.`,
    ],
    pull: `The constraint is the point. Without it the exercise is a catalogue. With it, every work has to earn its place against four thousand years of human expression.`,
  },

  dates: {
    heading: "Why these dates",
    body: [
      `Works arrive on days that carry meaning. Hamlet on Shakespeare's birthday. Ulysses on Bloomsday. Dracula at Halloween. Wuthering Heights on Valentine's Day, because love should always be a little unhinged. In Search of Lost Time on the 29th of February, because what better day for a book consumed with the moments that happen in between things. The calendar reaches well beyond the Western tradition, to Diwali, Nowruz, Vesak and the lunar new year.`,
      `These alignments are not decorative. They root the reading in something larger than the text. Where no birthday or occasion fits, a work is placed in the season that suits it, so the rhythm of the year shapes the rhythm of the reading. Each reader walks their own sequence, so the same book finds one person in October and another in March. Seventeen feasts are fixed and shared by everyone, and those are the days the whole readership turns the same page.`,
    ],
  },

  /*
   * No list of individual themes here. Naming seven of them and describing each
   * in a line reads as a features table; the ones worth seeing have to be seen,
   * and they live in the app.
   */
  themes: {
    heading: "Making the books feel like themselves",
    body: `Once the app worked I could not leave it alone. The engineer wanted features; the reader wanted atmosphere. So I started building visual environments tuned to particular works. They are just for fun, a way to feel a book as well as read about it, and they took an absurd amount of work.`,
    note: "More than a hundred of these now, and counting.",
  },

  progress: {
    heading: "A map of where you have been",
    body: [
      `The reading list was obvious: save what interests you, check off what you finish. The timeline is the part I am pleased with. It opens on today and scrolls downward through everything you have read, each book a vertical spine as long as the days you spent inside it. A fortnight with Dostoevsky is a tall column. A Chekhov story read on the bus is a notch.`,
      `Time is the axis rather than page count, which means the shape of the thing is the shape of your attention, not of the books. Over a year it becomes a map of where you have been and a provocation about where you have not. Alongside it a tier system counts what you have finished, and every work counts equally, whether it is a three-line poem or Proust's three thousand pages.`,
    ],
  },

  building: {
    heading: "Building it",
    body: `The commit history tells the real story of how software gets made: not in clean arcs but in dozens of small corrections, reversals and obsessive refinements. About twelve months of them.`,
    log: [
      { what: "Mobile navigation", detail: "A full weekend getting it right, then scrapped and rebuilt." },
      { what: "The reading timeline", detail: "From a flat checklist to a canvas of vertical strata on an inverted time axis, each book as tall as the days it took." },
      { what: "The tiers", detail: "From a handful of levels to thirty-two, colours running sand through teal, blue and green to a deep maroon." },
      { what: "The reading list", detail: "Gained sort controls, time estimates, a reader-speed picker, persistent state, a footer that changed colour with your tier. Then half of it was removed, because it cluttered the thing." },
      { what: "The iOS app", detail: "A privacy policy, a support page, timezone-aware push, offline handling, portrait lock, and about fifteen separate attempts at the status bar colour in Safari's PWA mode." },
      { what: "Everything else", detail: "Visit tracking, a sitemap for Google, country-level analytics with city breakdowns. Redis came and went: the framework's own cache with tag invalidation turned out to do the job with one less service to run." },
      { what: "Then the rewrite", detail: "A native SwiftUI app, started in 2026 and not yet released. Its own theme engine, and an ambience layer of thirteen stems and twenty-four presets so a book can be read in the weather it was written in." },
    ],
  },

  purpose: {
    heading: "What it is for",
    body: [
      `The Daily Canon is not a productivity tool or a gamification engine. It is a daily encounter with something worth your attention.`,
      `If you used to read and want a way back, it is a low-friction place to start. If you are already deep in the canon, it is a way to find the gaps you did not know you had. If you have never read much at all, it is as good a map as I know how to draw.`,
    ],
    pull: `You will not read everything. But you will read enough to recognise the silence where the rest belongs.`,
  },

  features: {
    heading: "What it does",
    items: [
      { icon: "book", name: "The library", detail: "A growing full-text library read in-app, chapter by chapter, with bookmarks and progress. A couple of books are free to read in full; the rest come with Folio, the premium tier." },
      { icon: "calendar", name: "Your own day", detail: "Every reader gets their own assignment, scored against a table of work-and-occasion pairings rather than handed the same page as everyone else. It is the part of the app I would show another engineer first." },
      { icon: "globe", name: "Ten languages", detail: "The reading experience and the app's own chrome in ten languages, translated offline and served as static files. No runtime translation API, no rate limit, and guests get it too." },
      { icon: "sparkle", name: "Bloomy", detail: "A literary companion built on Claude, for talking through a work, chasing a theme, or asking what to read next. Bloomy is genderless, and labelled as AI wherever it appears." },
      { icon: "compass", name: "Reading guides", detail: "Hand-written companions for the books that defeat people. How to read Finnegans Wake. Where to stand in the Critique of Pure Reason. What to skip in Clarissa and what you will regret skipping." },
      { icon: "layers", name: "Immersions", detail: "One work, held for days, read alone or with a cohort. A Chekhov story each morning for ten mornings; a Dickinson poem a day for three weeks. Dozens more behind Folio." },
      { icon: "ranking", name: "My Canon", detail: "Your own ranking of everything you have read, dragged into the order you actually believe." },
      { icon: "flame", name: "Streaks and laurels", detail: "Consecutive days of reading, freezes for when life happens, and laurels for finishing a path. There is no leaderboard: rank against other readers is the one number the app refuses to show." },
    ],
  },

  /**
   * `mark` is a brand icon from the generated simple-icons subset; `icon` is
   * one of the site's own, for the two layers no company owns. The cache row
   * carries the Next.js mark deliberately: the cache IS the framework's, which
   * is the whole reason Redis came out.
   */
  build: {
    heading: "How it is built",
    items: [
      { mark: "nextdotjs", layer: "Framework", tech: "Next.js 15, App Router, TypeScript" },
      { mark: "supabase", layer: "Database", tech: "Supabase Postgres with row-level security" },
      { mark: "nextdotjs", layer: "Cache", tech: "Next.js Data Cache, tag-based invalidation" },
      { mark: "anthropic", layer: "AI", tech: "Anthropic Claude, Bloomy and reading summaries" },
      { mark: "stripe", layer: "Payments", tech: "RevenueCat on iOS, Stripe on the web" },
      { mark: "apple", layer: "Push", tech: "Apple Push Notification Service, hourly cron" },
      { mark: "capacitor", layer: "iOS", tech: "Capacitor over the web bundle, with a native SwiftUI rewrite in the pipeline" },
      { icon: "globe", layer: "Web", tech: "PWA service worker, offline-capable" },
      { icon: "letterform", layer: "Type", tech: "Crimson Text, Spectral, Hanken Grotesk" },
    ],
  },

  press: { label: "App Store", honour: "Featured on the App Store" },
  wordmark: "/media/brand/tdc-wordmark-green.svg",
  icon: tdcIcon,
  appleMark: "/media/brand/apple-mark.svg",
} as const;
