import crypto from "node:crypto";

/**
 * Access control for the Vivienne Westwood gallery.
 *
 * The version this replaces compared a plaintext string inside the client
 * bundle, and served the images from public/ regardless — so the password was
 * readable in the JS and the files were fetchable without it. Neither half of
 * that was protection.
 *
 * Here the secret never reaches the browser, the files live outside public/,
 * and the only thing the client holds is an HMAC the server can verify.
 */

const SECRET = process.env.GALLERY_SECRET ?? "";
const PASSWORD = process.env.GALLERY_PASSWORD ?? "";

export const COOKIE_NAME = "gallery-access";
export const COOKIE_MAX_AGE = 60 * 60 * 12;

const isConfigured = () => SECRET.length > 0 && PASSWORD.length > 0;

const sign = (slug: string) =>
  crypto.createHmac("sha256", SECRET).update(`gallery:${slug}`).digest("hex");

export function issueToken(slug: string, attempt: string): string | null {
  if (!isConfigured()) return null;

  const a = Buffer.from(attempt);
  const b = Buffer.from(PASSWORD);
  // Length must match before timingSafeEqual, and comparing lengths first
  // leaks only the length, which is not the secret.
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  return sign(slug);
}

export function verifyToken(slug: string, token: string | undefined): boolean {
  if (!isConfigured() || !token) return false;
  const expected = sign(slug);
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/** Surfaced in the UI so a missing env var reads as misconfiguration, not a wrong password. */
export const gatingConfigured = isConfigured;
