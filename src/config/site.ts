/**
 * Single source of truth for CNTS site URL.
 * Falls back to https://cnts.couragelibrary.in.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "https://cnts.couragelibrary.in"
).replace(/\/+$/, "");

/**
 * Returns an absolute URL for a given relative path.
 */
export function getAbsoluteUrl(path: string = ""): string {
  if (!path) return SITE_URL;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${cleanPath}`;
}
