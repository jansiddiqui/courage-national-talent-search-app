import { SITE_URL, getAbsoluteUrl, resolveSiteUrl } from "@/config/site";
import { EMAIL_SENDERS, CONTACT_EMAILS } from "@/config/contact";

describe("SITE_URL single source of truth", () => {
  it("should be https://cnts.couragelibrary.in without trailing slash or www", () => {
    expect(SITE_URL).toBe("https://cnts.couragelibrary.in");
    expect(SITE_URL.endsWith("/")).toBe(false);
    expect(SITE_URL.includes("www.")).toBe(false);
  });

  it("should generate absolute URLs properly", () => {
    expect(getAbsoluteUrl("/sitemap.xml")).toBe("https://cnts.couragelibrary.in/sitemap.xml");
    expect(getAbsoluteUrl("schools/delhi-public-school")).toBe("https://cnts.couragelibrary.in/schools/delhi-public-school");
    expect(getAbsoluteUrl("https://other.com/page")).toBe("https://other.com/page");
    expect(getAbsoluteUrl("")).toBe("https://cnts.couragelibrary.in");
  });

  describe("resolveSiteUrl sanitization", () => {
    it("should reject unauthorized domains and fall back to https://cnts.couragelibrary.in", () => {
      expect(resolveSiteUrl("https://unauthorized-domain.com")).toBe("https://cnts.couragelibrary.in");
      expect(resolveSiteUrl("https://old-domain.com/")).toBe("https://cnts.couragelibrary.in");
    });

    it("should strip trailing slashes", () => {
      expect(resolveSiteUrl("https://cnts.couragelibrary.in/")).toBe("https://cnts.couragelibrary.in");
      expect(resolveSiteUrl("https://cnts.couragelibrary.in///")).toBe("https://cnts.couragelibrary.in");
    });

    it("should strip www prefix if present and enforce https", () => {
      expect(resolveSiteUrl("https://www.cnts.couragelibrary.in")).toBe("https://cnts.couragelibrary.in");
      expect(resolveSiteUrl("http://www.cnts.couragelibrary.in/")).toBe("https://cnts.couragelibrary.in");
    });

    it("should handle empty or undefined by returning https://cnts.couragelibrary.in", () => {
      expect(resolveSiteUrl("")).toBe("https://cnts.couragelibrary.in");
      expect(resolveSiteUrl(undefined)).toBe("https://cnts.couragelibrary.in");
    });

    it("should preserve valid local development domains like localhost", () => {
      expect(resolveSiteUrl("http://localhost:3000")).toBe("http://localhost:3000");
    });
  });

  describe("Brevo EMAIL_SENDERS configuration", () => {
    it("should configure default CNTS sender and reply-to", () => {
      expect(EMAIL_SENDERS.default.email).toBe("cnts@couragelibrary.in");
      expect(EMAIL_SENDERS.default.name).toBe("Courage National Talent Search");
      expect(EMAIL_SENDERS.default.replyTo.email).toBe("cnts@couragelibrary.in");
    });

    it("should configure results sender and reply-to", () => {
      expect(EMAIL_SENDERS.results.email).toBe("cnts@couragelibrary.in");
      expect(EMAIL_SENDERS.results.name).toBe("CNTS Results");
      expect(EMAIL_SENDERS.results.replyTo.email).toBe("cnts@couragelibrary.in");
    });

    it("should configure support sender and reply-to", () => {
      expect(EMAIL_SENDERS.support.email).toBe("cnts@couragelibrary.in");
      expect(EMAIL_SENDERS.support.name).toBe("CNTS Support");
      expect(EMAIL_SENDERS.support.replyTo.email).toBe("cnts@couragelibrary.in");
    });

    it("should configure noreply sender and reply-to", () => {
      expect(EMAIL_SENDERS.noreply.email).toBe("cnts@couragelibrary.in");
      expect(EMAIL_SENDERS.noreply.name).toBe("CNTS");
      expect(EMAIL_SENDERS.noreply.replyTo.email).toBe("cnts@couragelibrary.in");
    });

    it("should configure partners sender and reply-to", () => {
      expect(EMAIL_SENDERS.partners.email).toBe("collaborate@couragelibrary.in");
      expect(EMAIL_SENDERS.partners.name).toBe("CNTS Partnerships");
      expect(EMAIL_SENDERS.partners.replyTo.email).toBe("collaborate@couragelibrary.in");
    });

    it("should align CONTACT_EMAILS with canonical senders", () => {
      expect(CONTACT_EMAILS.SUPPORT).toBe("cnts@couragelibrary.in");
      expect(CONTACT_EMAILS.COLLABORATE).toBe("collaborate@couragelibrary.in");
      expect(CONTACT_EMAILS.SENDER).toBe("cnts@couragelibrary.in");
      expect(CONTACT_EMAILS.REPLY_TO).toBe("cnts@couragelibrary.in");
      expect(CONTACT_EMAILS.PARTNERS_REPLY_TO).toBe("collaborate@couragelibrary.in");
    });
  });
});
