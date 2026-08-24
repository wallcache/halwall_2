import "server-only";

/**
 * The Daily Canon's own numbers, counted at request time.
 *
 * The App Store publishes downloads to nobody but the developer, so the only
 * figure available programmatically is the account total in the app's own
 * database. Roughly half of installs go on to create an account, which is the
 * multiplier below. That makes downloads an estimate, and it is presented as
 * one: floored to a round hundred and suffixed with a "+".
 *
 * The rating is not fetched. The iTunes lookup endpoint reports one storefront
 * at a time -- GB alone currently answers 5.0 from six ratings -- so it is a
 * worse number than the real cross-market average, not a fresher one.
 */

/** The developer's own account, excluded from the count as it is in the ledger. */
const TEST_EMAIL = "h.wallcache@gmail.com";

/** Roughly half of installs create an account. */
const INSTALLS_PER_ACCOUNT = 2;

/**
 * Last counted 24 August 2026. Used when the credentials are absent, which is
 * the normal case for anyone who clones this repo, and when Supabase is down.
 * A stale-but-true number beats a zero or a crashed render.
 */
const FALLBACK_ACCOUNTS = 9_925;

/** Long enough that the page is effectively static, short enough to stay true. */
const REVALIDATE_SECONDS = 3_600;

export interface CanonStats {
  /** Exact registered accounts, test account excluded. */
  accounts: number;
  /** Estimated installs, floored to a round hundred. */
  downloads: number;
  /** False when the fallback was used, so callers can drop the "+" if they want. */
  live: boolean;
}

function derive(accounts: number, live: boolean): CanonStats {
  return {
    accounts,
    downloads: Math.floor((accounts * INSTALLS_PER_ACCOUNT) / 100) * 100,
    live,
  };
}

export async function getCanonStats(): Promise<CanonStats> {
  const url = process.env.TDC_SUPABASE_URL;
  const key = process.env.TDC_SUPABASE_KEY;
  if (!url || !key) return derive(FALLBACK_ACCOUNTS, false);

  try {
    /*
      Ask for a single row and read the total out of Content-Range. Selecting
      the whole table to call .length on it, as the ledger dashboard does, pulls
      ten thousand rows across the wire to produce one integer.
    */
    const res = await fetch(
      `${url}/rest/v1/profiles?select=id&email=neq.${encodeURIComponent(TEST_EMAIL)}`,
      {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          Prefer: "count=exact",
          Range: "0-0",
        },
        next: { revalidate: REVALIDATE_SECONDS },
      },
    );
    if (!res.ok) return derive(FALLBACK_ACCOUNTS, false);

    // "0-0/9925"
    const total = Number(res.headers.get("content-range")?.split("/")[1]);
    if (!Number.isFinite(total) || total <= 0) return derive(FALLBACK_ACCOUNTS, false);

    // Never report backwards past a number the site has already published.
    return derive(Math.max(total, FALLBACK_ACCOUNTS), true);
  } catch {
    return derive(FALLBACK_ACCOUNTS, false);
  }
}
