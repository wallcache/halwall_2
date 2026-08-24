import type { Figure, Link } from "./types";

export interface Project {
  slug: string;
  title: string;
  line: string;
  description: string;
  primary: Link;
  links: Link[];
  stack: string[];
  figures: Figure[];
  featured: boolean;
}

export const projects: Project[] = [
  {
    slug: "the-daily-canon",
    title: "The Daily Canon",
    line: "One carefully chosen work of literature for each day of the year.",
    description:
      "Novels, short stories, poems, essays, plays, philosophy: great writing in all its forms, delivered one day at a time. 366 works spanning three millennia, one assigned to every day of the year. Open the app, see today's work, and let the daily rhythm turn reading from aspiration into practice.",
    primary: { url: "https://thedailycanon.org", text: "thedailycanon.org" },
    links: [
      { url: "https://thedailycanon.org", text: "thedailycanon.org" },
      { url: "https://apps.apple.com/gb/app/daily-canon/id6758525527", text: "App Store" },
      {
        url: "https://medium.com/@henry.n.wall/i-built-a-web-app-that-gives-you-one-work-of-great-literature-a-day-heres-why-597212d4408f",
        text: "Why I built it",
      },
    ],
    stack: ["Next.js", "TypeScript", "Supabase", "Capacitor"],
    figures: [
      // TODO(hal): confirm the live download figure. The design brief says 6,000+;
      // the handoff's content.json claimed 10,000+ with no source. Using the brief.
      { value: 6000, suffix: "+", label: "downloads" },
      { value: 366, label: "works, one for every day" },
    ],
    featured: true,
  },
  {
    slug: "renovision",
    title: "Renovision",
    line: "Paste a Rightmove URL and see the house as it could be.",
    description:
      "An AI-powered property renovation visualiser. Paste a Rightmove URL, select rooms, configure a renovation style, and see possibilities beyond avocado walls. Built during my partner's and my own property search, for exactly the problem we kept running into.",
    primary: { url: "https://renovision.uk", text: "renovision.uk" },
    links: [
      { url: "https://renovision.uk", text: "renovision.uk" },
      { url: "https://github.com/wallcache/renovision", text: "GitHub" },
    ],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "AI/ML"],
    figures: [],
    featured: true,
  },
  {
    slug: "timewell",
    title: "Timewell",
    line: "An annual leave planner stripped of its usual HR clunkiness.",
    description:
      "Annual leave planning for UK employees, dressed in clarity rather than enterprise software. It gives visual insight into the year ahead and calculates the ROI of your time off. Vanilla JavaScript, no build step, just honest utility.",
    primary: { url: "https://timewell.uk", text: "timewell.uk" },
    links: [
      { url: "https://timewell.uk", text: "timewell.uk" },
      { url: "https://github.com/wallcache/annual_leave_planner", text: "GitHub" },
    ],
    stack: ["JavaScript", "HTML/CSS", "UX Design"],
    figures: [],
    featured: true,
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
