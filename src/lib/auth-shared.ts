export const ADMIN_COOKIE = "psimkg_admin_session";

/** Cookie value shared by Next middleware and API (:8011). Keep in sync with server/api.mjs */
export const ADMIN_SESSION_VALUE =
  process.env.ADMIN_SESSION_SECRET || "psimkg-session-active";

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "psimkg-admin";
}

/** Edge-safe session token (no Node crypto / next/headers). */
export function createSessionToken() {
  return ADMIN_SESSION_VALUE;
}

export function verifyPassword(password: string) {
  return password === getAdminPassword();
}
