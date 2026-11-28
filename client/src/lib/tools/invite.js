/**
 * Client-side helpers for workspace keys.
 *
 * These only format and share codes. Validation and consumption always happen
 * on the API; the browser never decides who is a member.
 */

export function normalizeInviteCode(code) {
  return String(code ?? "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

/** "k7qm3xpd9r" -> "K7QM-3XPD-9R" */
export function formatInviteCode(code) {
  return normalizeInviteCode(code).replace(/(.{4})(?=.)/g, "$1-");
}

/** Absolute join URL, optionally carrying the key. */
export function buildInviteUrl(code) {
  if (typeof window === "undefined") return "";

  const url = new URL("/spaces/join", window.location.origin);

  if (code) {
    url.searchParams.set("code", normalizeInviteCode(code));
  }

  return url.toString();
}
