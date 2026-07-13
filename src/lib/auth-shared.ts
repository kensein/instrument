export const ADMIN_COOKIE = "psimkg_admin_session";

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "psimkg-admin";
}

/** Edge-safe session token (no Node crypto / next/headers). */
export function createSessionToken() {
  return `psimkg-session:${getAdminPassword()}`;
}

export function verifyPassword(password: string) {
  return password === getAdminPassword();
}
