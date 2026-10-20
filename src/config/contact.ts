/**
 * Single source of truth for official CNTS contact email addresses and communications.
 *
 * Mappings:
 * - Support / General queries / Parents: cnts@couragelibrary.in
 * - "For Schools" / Partnerships / Sponsors / Collaborations: collaborate@couragelibrary.in
 * - Privacy / Terms / Refund / Data Deletion / Legal: cnts@couragelibrary.in
 * - Transactional email From / Reply-To: cnts@couragelibrary.in
 *
 * Rules:
 * - Do NOT put team@couragelibrary.in anywhere public.
 * - Do NOT use support@couragelibrary.in in CNTS (reserved for main site).
 */
export const CONTACT_EMAILS = {
  SUPPORT: "cnts@couragelibrary.in",
  GENERAL: "cnts@couragelibrary.in",
  SCHOOLS: "collaborate@couragelibrary.in",
  PARTNERS: "collaborate@couragelibrary.in",
  COLLABORATE: "collaborate@couragelibrary.in",
  LEGAL: "cnts@couragelibrary.in",
  SENDER: "cnts@couragelibrary.in",
} as const;

export const CONTACT_PHONE = "+91 83606 03173";
export const CONTACT_PHONE_FORMATTED = "+91 83606 03173";
