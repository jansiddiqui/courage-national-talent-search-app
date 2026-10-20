import { SITE_URL, getAbsoluteUrl, resolveSiteUrl } from "@/config/site";

describe("SITE_URL single source of truth", () => {
  it("should be https://cnts.couragelibrary.in without trailing slash or www", () => {
    expect(SITE_URL).toBe("https://cnts.couragelibrary.in");
    expect(SITE_URL.endsWith("/")).toBe(false);
    expect(SITE_URL.includes("www.")).toBe(false);
    expect(SITE_URL.includes("thecouragelibrary")).toBe(false);
  });

  it("should generate absolute URLs properly", () => {
    expect(getAbsoluteUrl("/sitemap.xml")).toBe("https://cnts.couragelibrary.in/sitemap.xml");
    expect(getAbsoluteUrl("schools/delhi-public-school")).toBe("https://cnts.couragelibrary.in/schools/delhi-public-school");
    expect(getAbsoluteUrl("https://other.com/page")).toBe("https://other.com/page");
    expect(getAbsoluteUrl("")).toBe("https://cnts.couragelibrary.in");
  });

  describe("resolveSiteUrl sanitization", () => {
    it("should reject https://www.thecouragelibrary.com and fall back to https://cnts.couragelibrary.in", () => {
      expect(resolveSiteUrl("https://www.thecouragelibrary.com")).toBe("https://cnts.couragelibrary.in");
      expect(resolveSiteUrl("https://thecouragelibrary.com/")).toBe("https://cnts.couragelibrary.in");
      expect(resolveSiteUrl("http://thecouragelibrary.com")).toBe("https://cnts.couragelibrary.in");
    });

    it("should strip trailing slashes", () => {
      expect(resolveSiteUrl("https://cnts.couragelibrary.in/")).toBe("https://cnts.couragelibrary.in");
      expect(resolveSiteUrl("https://cnts.couragelibrary.in///")).toBe("https://cnts.couragelibrary.in");
    });

    it("should strip www prefix if present", () => {
      expect(resolveSiteUrl("https://www.cnts.couragelibrary.in")).toBe("https://cnts.couragelibrary.in");
      expect(resolveSiteUrl("http://www.cnts.couragelibrary.in/")).toBe("http://cnts.couragelibrary.in");
    });

    it("should handle empty or undefined by returning https://cnts.couragelibrary.in", () => {
      expect(resolveSiteUrl("")).toBe("https://cnts.couragelibrary.in");
      expect(resolveSiteUrl(undefined)).toBe("https://cnts.couragelibrary.in");
    });

    it("should preserve valid non-legacy domains like localhost", () => {
      expect(resolveSiteUrl("http://localhost:3000")).toBe("http://localhost:3000");
    });
  });
});
