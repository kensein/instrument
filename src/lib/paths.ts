export const BASE_PATH =
  process.env.NEXT_PUBLIC_BASE_PATH?.replace(/\/$/, "") || "/instrument";

/**
 * Absolute API prefix for browser fetch.
 * Production (Apache): NEXT_PUBLIC_API_URL=/instrument/api → proxy to :8011
 * Dev (Next only): falls back to `${BASE_PATH}/api` on the same host.
 */
export function getApiBase() {
  const fromEnv = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  return `${BASE_PATH}/api`;
}

export function apiUrl(path: string) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${getApiBase()}${p}`;
}

/** Prefix public/ uploads for Next basePath. */
export function publicAsset(path: string) {
  if (!path) return path;
  if (/^https?:\/\//i.test(path)) return path;
  if (path.startsWith(BASE_PATH)) return path;
  return `${BASE_PATH}${path.startsWith("/") ? path : `/${path}`}`;
}
