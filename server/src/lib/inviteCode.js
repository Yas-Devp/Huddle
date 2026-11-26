import crypto from "node:crypto";

// Crockford-style alphabet: 32 characters, no I, L, O or U, so codes are
// safe to read out loud and cannot be confused with 1/l or 0/O.
const ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
const DEFAULT_LENGTH = 10;

/**
 * Generate a cryptographically random invitation code.
 * 10 characters of a 32-symbol alphabet is 50 bits of entropy.
 */
export function generateInviteCode(length = DEFAULT_LENGTH) {
  const bytes = crypto.randomBytes(length);
  let code = "";

  for (let index = 0; index < length; index += 1) {
    // 256 / 32 is an exact division, so there is no modulo bias here.
    code += ALPHABET[bytes[index] % ALPHABET.length];
  }

  return code;
}

/**
 * Canonical form used for storage and lookups: uppercase, alphanumerics only.
 * Accepts "k7qm-3xpd-9r", "K7QM 3XPD 9R" and "K7QM3XPD9R" identically.
 */
export function normalizeInviteCode(value) {
  return String(value ?? "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

/**
 * Human-friendly display form: "K7QM-3XPD-9R".
 */
export function formatInviteCode(code) {
  return normalizeInviteCode(code).replace(/(.{4})(?=.)/g, "$1-");
}
