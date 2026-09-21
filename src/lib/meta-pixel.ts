// Meta Pixel Client-Side Analytics Utility
// CNTS 2026 Production Safe Tracking Layer

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & {
      callMethod?: (...args: unknown[]) => void;
      queue?: unknown[];
      loaded?: boolean;
      version?: string;
    };
    _fbq?: unknown;
  }
}

/**
 * Safely tracks a PageView event in Meta Pixel
 */
export function trackPageView(): void {
  if (typeof window === "undefined") return;

  try {
    if (typeof window.fbq === "function") {
      window.fbq("track", "PageView");
    }
  } catch (err) {
    // Non-blocking: analytics failures must never break the user experience
    console.warn("[MetaPixel] PageView tracking failed silently:", err);
  }
}

export interface MetaPurchasePayload {
  value: number;
  currency?: string;
  transactionId?: string;
  eventId?: string;
}

/**
 * Safely tracks a verified Purchase event in Meta Pixel
 * Only non-PII transaction metadata (value, currency, and eventID) is transmitted.
 */
export function trackPurchase({
  value,
  currency = "INR",
  eventId,
}: MetaPurchasePayload): void {
  if (typeof window === "undefined") return;

  try {
    if (typeof window.fbq === "function") {
      const options = eventId ? { eventID: eventId } : undefined;
      window.fbq(
        "track",
        "Purchase",
        {
          value,
          currency,
        },
        options
      );
    }
  } catch (err) {
    // Non-blocking: analytics failures must never break the user experience
    console.warn("[MetaPixel] Purchase tracking failed silently:", err);
  }
}

/**
 * Deduplicated client-side Purchase tracking.
 * Ensures the exact same verified transaction ID is only tracked ONCE across refreshes,
 * back/forward navigations, and repeated visits to the confirmation URL.
 *
 * @returns boolean indicating whether the event was freshly fired (true) or skipped as a duplicate (false).
 */
export function trackVerifiedPurchaseOnce({
  transactionId,
  value,
  currency = "INR",
}: {
  transactionId: string;
  value: number;
  currency?: string;
}): boolean {
  if (typeof window === "undefined" || !transactionId) {
    return false;
  }

  const storageKey = `cnts_meta_purchase_${transactionId}`;

  try {
    // Check if this specific verified transaction has already been recorded in browser storage
    const alreadyTracked = localStorage.getItem(storageKey);
    if (alreadyTracked) {
      return false;
    }

    // Fire the Purchase event with deterministic eventID for Meta deduplication
    trackPurchase({
      value,
      currency,
      transactionId,
      eventId: transactionId,
    });

    // Mark as tracked with timestamp
    localStorage.setItem(storageKey, new Date().toISOString());
    return true;
  } catch (err) {
    // If localStorage is disabled or throws, attempt standard tracking safely
    console.warn("[MetaPixel] LocalStorage check failed, firing fallback tracking:", err);
    trackPurchase({
      value,
      currency,
      transactionId,
      eventId: transactionId,
    });
    return true;
  }
}
