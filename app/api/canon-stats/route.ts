import { NextResponse } from "next/server";
import { getCanonStats } from "@/lib/canon-stats";

/**
 * The counts, for the band on /canon to poll.
 *
 * The page is rendered once and cached, so without this the figures would be
 * as old as the last regeneration. They are counts of things readers are doing
 * right now -- the blurb total went up five times while this was being
 * written -- and a number that moves while you are looking at it is the whole
 * reason for putting them on the page.
 *
 * The upstream fetches inside getCanonStats are cached for an hour, so a
 * thousand visitors polling this do not become a thousand queries; they become
 * one an hour. The route's own cache is shorter so the page picks a fresh
 * count up soon after it lands.
 */
export const revalidate = 60;

export async function GET() {
  const s = await getCanonStats();

  return NextResponse.json(
    {
      downloads: s.downloads,
      finished: s.finished,
      blurbs: s.blurbs,
      saves: s.saves,
      shares: s.shares,
    },
    // Let the CDN answer most of these outright.
    { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } },
  );
}
