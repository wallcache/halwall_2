import "server-only";

/**
 * The Daily Canon's own numbers, counted at request time.
 *
 * The App Store publishes downloads to nobody but the developer, so the only
 * figure available programmatically is the account total in the app's own
 * database. Roughly half of installs go on to create an account, which is the
 * multiplier below.
 *
 * Everything else here is an exact count of a table: works finished, blurbs
 * read, saves, quotes shared. These are the app being used, not marketing
 * numbers, and they are the only figures on the site that change while you are
 * looking at them.
 *
 * The rating is not fetched. The iTunes lookup endpoint reports one storefront
 * at a time -- GB alone currently answers 5.0 from six ratings -- so it is a
 * worse number than the real cross-market average, not a fresher one.
 */

/** The developer's own account, excluded from the count as it is in the ledger. */
const TEST_EMAIL = "h.wallcache@gmail.com";

/** Roughly half of installs create an account. */
const INSTALLS_PER_ACCOUNT = 2;

/** Long enough that the page is effectively static, short enough to stay true. */
const REVALIDATE = 3_600;

/**
 * Last counted 25 August 2026. Used when the credentials are absent, which is
 * the normal case for anyone who clones this repo, and when Supabase is down.
 * A stale-but-true number beats a zero or a crashed render.
 */
const FALLBACK = {
  accounts: 9_975,
  finished: 18_991,
  blurbs: 21_143,
  saves: 26_396,
  shares: 255,
} as const;

export interface SharedQuote {
  quote: string;
  workTitle: string;
  workAuthor: string;
  sharedAt: string;
  /** The card the app rendered, from the public quote-cards bucket. */
  cardUrl: string | null;
  /** The reader's chosen avatar. One of a fixed set of author portraits. */
  avatarUrl: string | null;
  /**
   * The first letter of their display name, and how many letters follow.
   *
   * Only these two things. The name itself never leaves the server, because a
   * blur is a picture of privacy rather than privacy: anyone who opens the
   * inspector can read a name that has merely been blurred in CSS. The page
   * renders the initial and the right number of placeholder glyphs, so it
   * looks like a redacted name because it is one.
   */
  initial: string | null;
  hidden: number;
}

export interface CanonStats {
  /** Registered accounts, the developer's own excluded. */
  accounts: number;
  /** Estimated installs. */
  downloads: number;
  /** Works readers have logged as finished. */
  finished: number;
  /** Blurbs opened. */
  blurbs: number;
  /** Works saved to a reading list. */
  saves: number;
  /** Quote cards made. */
  shares: number;
  /** The most recent one, if it could be read. */
  latestQuote: SharedQuote | null;
  /** False when the fallback was used. */
  live: boolean;
}

function creds() {
  const url = process.env.TDC_SUPABASE_URL;
  const key = process.env.TDC_SUPABASE_KEY;
  return url && key ? { url, key } : null;
}

function headers(key: string, extra: Record<string, string> = {}) {
  return { apikey: key, Authorization: `Bearer ${key}`, ...extra };
}

/**
 * An exact row count without transferring any rows.
 *
 * Asks for a single row and reads the total out of Content-Range. Selecting
 * the whole table to call .length on it, as the ledger dashboard does, pulls
 * tens of thousands of rows across the wire to produce one integer.
 */
async function countOf(
  url: string,
  key: string,
  table: string,
  column: string,
  filter = "",
): Promise<number | null> {
  try {
    const res = await fetch(`${url}/rest/v1/${table}?select=${column}${filter}`, {
      headers: headers(key, { Prefer: "count=exact", Range: "0-0" }),
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return null;
    const total = Number(res.headers.get("content-range")?.split("/")[1]);
    return Number.isFinite(total) && total > 0 ? total : null;
  } catch {
    return null;
  }
}

/** Where the app uploads the card it rendered. A public bucket. */
const CARDS = "/storage/v1/object/public/quote-cards";
/** The fixed set of author portraits a reader picks from. */
const AVATARS = "https://thedailycanon.org/avatars";

async function latestQuote(url: string, key: string): Promise<SharedQuote | null> {
  try {
    const res = await fetch(
      `${url}/rest/v1/quote_shares?select=token,quote,work_title,work_author,user_id,created_at&order=created_at.desc&limit=1`,
      { headers: headers(key), next: { revalidate: REVALIDATE } },
    );
    if (!res.ok) return null;
    const [row] = (await res.json()) as {
      token?: string;
      quote?: string;
      work_title?: string;
      work_author?: string;
      user_id?: string;
      created_at?: string;
    }[];
    if (!row?.quote || !row.work_title) return null;

    let initial: string | null = null;
    let hidden = 0;
    let avatarUrl: string | null = null;

    if (row.user_id) {
      const who = await fetch(
        `${url}/rest/v1/profiles?select=display_name,avatar:preferences->>avatar&id=eq.${row.user_id}`,
        { headers: headers(key), next: { revalidate: REVALIDATE } },
      );
      if (who.ok) {
        const [p] = (await who.json()) as { display_name?: string; avatar?: string }[];
        const first = p?.display_name?.trim().split(/\s+/)[0] ?? "";
        if (first) {
          initial = first[0].toUpperCase();
          hidden = Math.max(0, first.length - 1);
        }
        if (p?.avatar) avatarUrl = `${AVATARS}/${p.avatar}.jpg`;
      }
    }

    return {
      quote: row.quote,
      workTitle: row.work_title,
      workAuthor: row.work_author ?? "",
      sharedAt: row.created_at ?? "",
      cardUrl: row.token ? `${url}${CARDS}/${row.token}.webp` : null,
      avatarUrl,
      initial,
      hidden,
    };
  } catch {
    return null;
  }
}

export async function getCanonStats(): Promise<CanonStats> {
  const c = creds();

  const derive = (
    accounts: number,
    finished: number,
    blurbs: number,
    saves: number,
    shares: number,
    quote: SharedQuote | null,
    live: boolean,
  ): CanonStats => ({
    accounts,
    // Not rounded. Every other figure on the band is an exact count, and one
    // suspiciously round number beside five exact ones reads as the invented
    // one -- which, being an estimate, is exactly what it would be.
    downloads: accounts * INSTALLS_PER_ACCOUNT + 1,
    finished,
    blurbs,
    saves,
    shares,
    latestQuote: quote,
    live,
  });

  if (!c) {
    return derive(
      FALLBACK.accounts, FALLBACK.finished, FALLBACK.blurbs,
      FALLBACK.saves, FALLBACK.shares, null, false,
    );
  }

  const [accounts, finished, blurbs, saves, shares, quote] = await Promise.all([
    countOf(c.url, c.key, "profiles", "id", `&email=neq.${encodeURIComponent(TEST_EMAIL)}`),
    countOf(c.url, c.key, "reading_progress", "id"),
    countOf(c.url, c.key, "blurb_reads", "user_id"),
    countOf(c.url, c.key, "reading_list", "user_id"),
    countOf(c.url, c.key, "quote_shares", "token"),
    latestQuote(c.url, c.key),
  ]);

  // Never report backwards past a number the site has already published.
  const at = (live: number | null, floor: number) => Math.max(live ?? 0, floor);

  return derive(
    at(accounts, FALLBACK.accounts),
    at(finished, FALLBACK.finished),
    at(blurbs, FALLBACK.blurbs),
    at(saves, FALLBACK.saves),
    at(shares, FALLBACK.shares),
    quote,
    accounts !== null,
  );
}
