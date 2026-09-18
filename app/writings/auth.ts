import "server-only";
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

/**
 * The lock on /writings.
 *
 * Everything here runs on the server and only on the server ("server-only"
 * makes the build fail if it is ever imported into a client component). The
 * password lives in WRITINGS_PASSWORD, never in the source — this repo is
 * public, and a password in the bundle is not a lock.
 *
 * On a correct password the browser is given an httpOnly cookie holding an
 * HMAC derived from the password. Being derived from the password it cannot
 * be forged without knowing it, and being httpOnly it cannot be read by page
 * scripts. The page checks the cookie on every request by recomputing it.
 *
 * If WRITINGS_PASSWORD is unset — say, not yet added on Vercel — everything
 * fails closed: nothing unlocks, rather than the page falling open.
 */

const COOKIE = "writings";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function secret(): string | null {
  const p = process.env.WRITINGS_PASSWORD;
  return p && p.length > 0 ? p : null;
}

function token(pw: string): string {
  return createHmac("sha256", pw).update("writings-unlocked").digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  // timingSafeEqual throws on length mismatch; unequal lengths are unequal.
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export async function isUnlocked(): Promise<boolean> {
  const pw = secret();
  if (!pw) return false;
  const value = (await cookies()).get(COOKIE)?.value;
  return !!value && safeEqual(value, token(pw));
}

/** Compare an attempt against the real password, in constant time. */
export function checkPassword(attempt: string): boolean {
  const pw = secret();
  return !!pw && safeEqual(attempt, pw);
}

export async function setUnlockedCookie(): Promise<void> {
  const pw = secret();
  if (!pw) return;
  (await cookies()).set(COOKIE, token(pw), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/writings",
    maxAge: MAX_AGE,
  });
}

export async function clearUnlockedCookie(): Promise<void> {
  // The cookie was set on path /writings. delete(name) alone targets "/",
  // which the browser treats as a different cookie and leaves the real one
  // in place — Lock did nothing. It has to be cleared on the same path.
  (await cookies()).set(COOKIE, "", { path: "/writings", maxAge: 0 });
}
