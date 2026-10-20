/**
 * Single source of truth for official CNTS contact email addresses, communications,
 * and Brevo transactional email senders & reply-to identities.
 *
 * Senders Mapping:
 * - General / Official     : cnts@couragelibrary.in        (name: "Courage National Talent Search")
 * - Results published      : cnts@couragelibrary.in        (name: "CNTS Results")
 * - Support desk           : cnts@couragelibrary.in        (name: "CNTS Support")
 * - System / Auth / Alerts : cnts@couragelibrary.in        (name: "CNTS")
 * - Partnerships / Schools : collaborate@couragelibrary.in (name: "CNTS Partnerships")
 *
 * Reply-To Rules:
 * - All CNTS emails: cnts@couragelibrary.in
 * - Partners emails: collaborate@couragelibrary.in
 */

export type EmailSenderKey = "default" | "results" | "support" | "noreply" | "partners";

export interface EmailSenderConfig {
  name: string;
  email: string;
  replyTo: {
    name: string;
    email: string;
  };
}

/**
 * Defensive sanitizer ensuring outgoing senders only use @couragelibrary.in addresses.
 */
function sanitizeSenderEmail(envEmail: string | undefined, fallback: string): string {
  if (!envEmail) return fallback;
  const clean = envEmail.trim().toLowerCase();
  if (clean.endsWith("@couragelibrary.in")) {
    return clean;
  }
  return fallback;
}

export const EMAIL_SENDERS: Record<EmailSenderKey, EmailSenderConfig> = {
  // Previously cnts@ -> cnts@couragelibrary.in
  default: {
    name: process.env.BREVO_SENDER_NAME || "Courage National Talent Search",
    email: sanitizeSenderEmail(process.env.BREVO_SENDER_EMAIL, "cnts@couragelibrary.in"),
    replyTo: {
      name: "Courage National Talent Search",
      email: sanitizeSenderEmail(process.env.BREVO_REPLY_TO_EMAIL, "cnts@couragelibrary.in"),
    },
  },
  // Previously results@ -> cnts@couragelibrary.in
  results: {
    name: "CNTS Results",
    email: sanitizeSenderEmail(process.env.BREVO_RESULTS_SENDER_EMAIL, "cnts@couragelibrary.in"),
    replyTo: {
      name: "CNTS Results",
      email: "cnts@couragelibrary.in",
    },
  },
  // Previously support@ -> cnts@couragelibrary.in
  support: {
    name: "CNTS Support",
    email: sanitizeSenderEmail(process.env.BREVO_SUPPORT_SENDER_EMAIL, "cnts@couragelibrary.in"),
    replyTo: {
      name: "CNTS Support",
      email: "cnts@couragelibrary.in",
    },
  },
  // Previously noreply@ -> cnts@couragelibrary.in
  noreply: {
    name: "CNTS",
    email: sanitizeSenderEmail(process.env.BREVO_NOREPLY_SENDER_EMAIL, "cnts@couragelibrary.in"),
    replyTo: {
      name: "CNTS",
      email: "cnts@couragelibrary.in",
    },
  },
  // Previously partners@ -> collaborate@couragelibrary.in
  partners: {
    name: "CNTS Partnerships",
    email: sanitizeSenderEmail(process.env.BREVO_PARTNERS_SENDER_EMAIL, "collaborate@couragelibrary.in"),
    replyTo: {
      name: "CNTS Partnerships",
      email: "collaborate@couragelibrary.in",
    },
  },
} as const;

export const CONTACT_EMAILS = {
  SUPPORT: "cnts@couragelibrary.in",
  GENERAL: "cnts@couragelibrary.in",
  SCHOOLS: "collaborate@couragelibrary.in",
  PARTNERS: "collaborate@couragelibrary.in",
  COLLABORATE: "collaborate@couragelibrary.in",
  LEGAL: "cnts@couragelibrary.in",
  SENDER: EMAIL_SENDERS.default.email,
  REPLY_TO: EMAIL_SENDERS.default.replyTo.email,
  PARTNERS_REPLY_TO: EMAIL_SENDERS.partners.replyTo.email,
} as const;

export const CONTACT_PHONE = "+91 83606 03173";
export const CONTACT_PHONE_FORMATTED = "+91 83606 03173";
