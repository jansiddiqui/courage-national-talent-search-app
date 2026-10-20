/**
 * Single source of truth for CNTS site URL.
 * Canonical base URL: https://cnts.couragelibrary.in (no trailing slash, no www).
 *
 * Any stale environment variable pointing to a legacy domain
 * is sanitized and forced to `https://cnts.couragelibrary.in`.
 */
export function resolveSiteUrl(envUrl?: string): string {
  const url = envUrl !== undefined ? envUrl : (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL);
  if (!url) {
    return "https://cnts.couragelibrary.in";
  }

  const clean = url.trim().replace(/\/+$/, "").replace(/^(https?:\/\/)www\./i, "$1");

  // Allow localhost only in local development/testing environments
  if (clean.startsWith("http://localhost:") || clean.startsWith("http://127.0.0.1:")) {
    return clean;
  }

  // Enforce canonical CNTS production domain (defensively rejects any legacy or invalid domains)
  return "https://cnts.couragelibrary.in";
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
