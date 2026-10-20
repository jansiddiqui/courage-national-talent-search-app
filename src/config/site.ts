/**
 * Single source of truth for CNTS site URL.
 * Canonical base URL: https://cnts.couragelibrary.in (no trailing slash, no www).
 *
 * Any stale environment variable pointing to the legacy domain
 * (e.g. `thecouragelibrary.com` or `www.thecouragelibrary.com`) is sanitized
 * and forced to `https://cnts.couragelibrary.in`.
 */
export function resolveSiteUrl(envUrl?: string): string {
  const url = envUrl !== undefined ? envUrl : (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL);
  if (!url) {
    return "https://cnts.couragelibrary.in";
  }

  const clean = url.trim().replace(/\/+$/, "");

  // Prevent legacy domain from poisoning production if stale hosting env vars exist
  if (clean.includes("thecouragelibrary.com") || clean.includes("thecouragelibrary")) {
    return "https://cnts.couragelibrary.in";
  }

  // Ensure no www and no trailing slash
  return clean.replace(/^(https?:\/\/)www\./i, "$1");
}

export const SITE_URL = resolveSiteUrl();

/**
 * Returns an absolute URL for a given relative path.
 */
export function getAbsoluteUrl(path: string = ""): string {
  if (!path) return SITE_URL;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${cleanPath}`;
}
