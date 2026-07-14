import { stripHtml, extractInternalLinks } from "@/utils/htmlParser";
import { SchoolScoringService } from "@/domains/school-intelligence/SchoolScoringService";
import { SchoolOutreachService } from "@/domains/school-intelligence/SchoolOutreachService";
import { SchoolCrawlerService } from "@/domains/school-intelligence/SchoolCrawlerService";
import { WebsiteDiscoveryService } from "@/domains/school-intelligence/WebsiteDiscoveryService";
import { AIExtractedIntelligence } from "@/domains/school-intelligence/types";

describe("School Intelligence Engine - Unit Tests", () => {
  
  describe("HTML Parser Utility", () => {
    it("should strip style, script, and HTML tags correctly", () => {
      const html = `<html><head><style>body { color: red; }</style></head><body><script>alert(1);</script><h1>School Name</h1><p>Welcome to <b>Greenfield</b> School.</p></body></html>`;
      const text = stripHtml(html);
      expect(text).not.toContain("alert");
      expect(text).not.toContain("color");
      expect(text).toContain("School Name Welcome to Greenfield School.");
    });

    it("should extract internal domain links only", () => {
      const html = `<a href="/about-us">About</a><a href="https://www.google.com">Google</a><a href="http://school.edu/contact">Contact</a>`;
      const links = extractInternalLinks(html, "http://school.edu/home");
      expect(links).toContain("http://school.edu/about-us");
      expect(links).toContain("http://school.edu/contact");
      expect(links).not.toContain("https://www.google.com");
    });
  });

  describe("School Scoring Service", () => {
    const mockIntel = (status: "VERIFIED" | "INFERRED" | "UNKNOWN" | "CONFLICTING"): AIExtractedIntelligence => ({
      board: { value: "CBSE", status, confidence: 90, evidence_quotes: [] },
      school_type: { value: "PRIVATE", status, confidence: 90, evidence_quotes: [] },
      classes_offered: { value: "Classes 5 to 12", status, confidence: 90, evidence_quotes: [] },
      medium: { value: "English", status, confidence: 90, evidence_quotes: [] },
      principal_name: { value: "Dr. Joshi", status, confidence: 90, evidence_quotes: [] },
      director_name: { value: null, status: "UNKNOWN", confidence: 0, evidence_quotes: [] },
      academic_coordinator_name: { value: null, status: "UNKNOWN", confidence: 0, evidence_quotes: [] },
      student_strength_estimate: { value: null, status: "UNKNOWN", confidence: 0, evidence_quotes: [] },
      facilities_computer_lab: { value: true, status, confidence: 90, evidence_quotes: [] },
      facilities_smart_classrooms: { value: null, status: "UNKNOWN", confidence: 0, evidence_quotes: [] },
      facilities_stem_facilities: { value: true, status, confidence: 90, evidence_quotes: [] },
      facilities_atal_tinkering_lab: { value: true, status, confidence: 90, evidence_quotes: [] },
      partnership_signals_olympiad_participation: { value: true, status, confidence: 90, evidence_quotes: [] },
      partnership_signals_competitions_participation: { value: null, status: "UNKNOWN", confidence: 0, evidence_quotes: [] },
      partnership_signals_stem_focus: { value: null, status: "UNKNOWN", confidence: 0, evidence_quotes: [] },
      partnership_signals_coding_curriculum: { value: null, status: "UNKNOWN", confidence: 0, evidence_quotes: [] },
      email: { value: "info@school.com", status, confidence: 90, evidence_quotes: [] },
      phone: { value: "9876543210", status, confidence: 90, evidence_quotes: [] },
      objections: [],
      pitch_recommendation: "Introduce CNTS."
    });

    it("should award maximum points for VERIFIED claims", () => {
      const scoring = SchoolScoringService.calculateScore(mockIntel("VERIFIED"), true);
      // Classes (20) + Olympiads (20) + STEM (15) + Contacts (15) + DecisionMaker (15) + DigitalFootprint (10) + Board (5) = 100
      expect(scoring.totalScore).toBe(100);
      expect(scoring.confidenceScore).toBe(90);
    });

    it("should award half points for INFERRED claims", () => {
      const scoring = SchoolScoringService.calculateScore(mockIntel("INFERRED"), true);
      // Classes (10) + Olympiads (10) + STEM (8) + Contacts (8) + DecisionMaker (8) + DigitalFootprint (10) + Board (3) = 57
      expect(scoring.totalScore).toBe(57);
    });

    it("should award zero points for UNKNOWN status", () => {
      const scoring = SchoolScoringService.calculateScore(mockIntel("UNKNOWN"), false);
      expect(scoring.totalScore).toBe(0);
    });
  });

  describe("Outreach Generator Service", () => {
    it("should generate grounded scripts naming the principal when known", () => {
      const intel: AIExtractedIntelligence = {
        board: { value: "CBSE", status: "VERIFIED", confidence: 90, evidence_quotes: [] },
        school_type: { value: "PRIVATE", status: "VERIFIED", confidence: 90, evidence_quotes: [] },
        classes_offered: { value: "5 to 12", status: "VERIFIED", confidence: 90, evidence_quotes: [] },
        medium: { value: "English", status: "VERIFIED", confidence: 90, evidence_quotes: [] },
        principal_name: { value: "Dr. Rohit Joshi", status: "VERIFIED", confidence: 90, evidence_quotes: [] },
        director_name: { value: null, status: "UNKNOWN", confidence: 0, evidence_quotes: [] },
        academic_coordinator_name: { value: null, status: "UNKNOWN", confidence: 0, evidence_quotes: [] },
        student_strength_estimate: { value: null, status: "UNKNOWN", confidence: 0, evidence_quotes: [] },
        facilities_computer_lab: { value: null, status: "UNKNOWN", confidence: 0, evidence_quotes: [] },
        facilities_smart_classrooms: { value: null, status: "UNKNOWN", confidence: 0, evidence_quotes: [] },
        facilities_stem_facilities: { value: null, status: "UNKNOWN", confidence: 0, evidence_quotes: [] },
        facilities_atal_tinkering_lab: { value: null, status: "UNKNOWN", confidence: 0, evidence_quotes: [] },
        partnership_signals_olympiad_participation: { value: null, status: "UNKNOWN", confidence: 0, evidence_quotes: [] },
        partnership_signals_competitions_participation: { value: null, status: "UNKNOWN", confidence: 0, evidence_quotes: [] },
        partnership_signals_stem_focus: { value: null, status: "UNKNOWN", confidence: 0, evidence_quotes: [] },
        partnership_signals_coding_curriculum: { value: null, status: "UNKNOWN", confidence: 0, evidence_quotes: [] },
        email: { value: "rohit@school.com", status: "VERIFIED", confidence: 90, evidence_quotes: [] },
        phone: { value: null, status: "UNKNOWN", confidence: 0, evidence_quotes: [] },
        objections: [],
        pitch_recommendation: "Introduce CNTS to Noida."
      };

      const prospect = { name: "Greenfield Academy", city: "Noida", district: "Noida", state: "UP", enrichment_status: "PENDING" as any, identity_status: "DISTINCT" as any, outreach_score: 0, confidence_score: 0, scoring_breakdown: {}, outreach_templates: {} };
      const drafts = SchoolOutreachService.generateDrafts(prospect, intel);
      expect(drafts.emailLong).toContain("Principal Dr. Rohit Joshi");
      expect(drafts.whatsappMessage).toContain("Dr. Rohit Joshi");
      expect(drafts.callOpeningScript).toContain("Dr. Rohit Joshi");
    });
  });

  describe("Crawler Security Boundaries", () => {
    it("should reject private and loopback IPs in isSafeIp checks", async () => {
      const localhostSafe = await SchoolCrawlerService.isSafeUrl("http://127.0.0.1/home");
      expect(localhostSafe).toBe(false);

      const privateSafe = await SchoolCrawlerService.isSafeUrl("http://192.168.1.1/home");
      expect(privateSafe).toBe(false);

      const linkLocalSafe = await SchoolCrawlerService.isSafeUrl("http://169.254.169.254/latest/meta-data/");
      expect(linkLocalSafe).toBe(false);
    });
  });
});
