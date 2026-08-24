import type { MetadataRoute } from "next";
import { walks } from "@/content/walking";
import { identityProjects } from "@/content/identity-work";

/**
 * Every entry here resolves to a real route. The old sitemap advertised
 * /writing at priority 0.8 after the page had been deleted, which is the
 * exact class of bug this rebuild exists to fix — so the list is derived from
 * content rather than hand-maintained.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://halwall.me";

  const staticRoutes = [
    { path: "", priority: 1 },
    { path: "/work", priority: 0.9 },
    { path: "/canon", priority: 0.9 },
    { path: "/making", priority: 0.8 },
    { path: "/making/photography", priority: 0.7 },
    { path: "/making/identity", priority: 0.7 },
    { path: "/making/motion", priority: 0.6 },
    { path: "/walking", priority: 0.6 },
  ];

  return [
    ...staticRoutes.map((r) => ({
      url: `${base}${r.path}`,
      changeFrequency: "monthly" as const,
      priority: r.priority,
    })),
    ...walks.map((w) => ({
      url: `${base}/walking/${w.slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
    ...identityProjects.map((p) => ({
      url: `${base}/making/identity/${p.slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
