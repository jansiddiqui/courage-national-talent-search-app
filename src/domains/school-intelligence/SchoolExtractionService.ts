import { AIExtractedIntelligence, AIClaim } from "./types";
import { CrawledPage } from "./SchoolCrawlerService";

export class SchoolExtractionService {
  /**
   * Submit crawled page texts to Gemini via OpenRouter to extract structured facts
   */
  static async extractIntelligence(
    pages: CrawledPage[]
  ): Promise<AIExtractedIntelligence> {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error("Missing OPENROUTER_API_KEY environment variable");
    }

    // Compile text content with URL labels
    const context = pages
      .map(
        (p) => `=== SOURCE_URL: ${p.url} ===\nTitle: ${p.title}\nContent:\n${p.text.substring(0, 15000)}\n=== END SOURCE ===`
      )
      .join("\n\n");

    const systemPrompt = `You are a strict data extraction AI. You extract facts about schools from supplied crawled website context.

Your rules:
1. ONLY extract facts that are directly mentioned or logically inferred from the provided sources.
2. If the context does not contain enough information for a field, return status "UNKNOWN", value null, confidence 0, and empty evidence_quotes.
3. Every claim key in the output MUST be a JSON object containing:
   - "value": The extracted value (string, boolean, or null).
   - "status": "VERIFIED" (direct quote matches), "INFERRED" (logical deduction), "UNKNOWN" (no info), or "CONFLICTING" (sources disagree).
   - "confidence": A rating from 0 to 100.
   - "evidence_quotes": Array of exact matching sentences or urls from the context that prove this claim.
4. Output must be raw JSON matching the required schema. No conversational preamble.`;

    const userPrompt = `Context:
${context}

Extract structured facts according to the schema below. Keep unknown values null:
{
  "board": { "value": "CBSE" or "ICSE" or "STATE_BOARD" or "IB" or "OTHER" or null, "status": "VERIFIED"/"INFERRED"/"UNKNOWN"/"CONFLICTING", "confidence": 0-100, "evidence_quotes": [] },
  "school_type": { "value": "PRIVATE" or "GOVERNMENT" or "CO-ED" or "BOYS_ONLY" or "GIRLS_ONLY" or null, "status": "VERIFIED"/"INFERRED"/"UNKNOWN", "confidence": 0-100, "evidence_quotes": [] },
  "classes_offered": { "value": "Nursery to 12" or null, "status": "VERIFIED"/"INFERRED"/"UNKNOWN", "confidence": 0-100, "evidence_quotes": [] },
  "medium": { "value": "English" or null, "status": "VERIFIED"/"INFERRED"/"UNKNOWN", "confidence": 0-100, "evidence_quotes": [] },
  "principal_name": { "value": "Name" or null, "status": "VERIFIED"/"INFERRED"/"UNKNOWN", "confidence": 0-100, "evidence_quotes": [] },
  "director_name": { "value": "Name" or null, "status": "VERIFIED"/"INFERRED"/"UNKNOWN", "confidence": 0-100, "evidence_quotes": [] },
  "academic_coordinator_name": { "value": "Name" or null, "status": "VERIFIED"/"INFERRED"/"UNKNOWN", "confidence": 0-100, "evidence_quotes": [] },
  "student_strength_estimate": { "value": 1200 or null, "status": "VERIFIED"/"INFERRED"/"UNKNOWN", "confidence": 0-100, "evidence_quotes": [] },
  "facilities_computer_lab": { "value": true/false/null, "status": "VERIFIED"/"INFERRED"/"UNKNOWN", "confidence": 0-100, "evidence_quotes": [] },
  "facilities_smart_classrooms": { "value": true/false/null, "status": "VERIFIED"/"INFERRED"/"UNKNOWN", "confidence": 0-100, "evidence_quotes": [] },
  "facilities_stem_facilities": { "value": true/false/null, "status": "VERIFIED"/"INFERRED"/"UNKNOWN", "confidence": 0-100, "evidence_quotes": [] },
  "facilities_atal_tinkering_lab": { "value": true/false/null, "status": "VERIFIED"/"INFERRED"/"UNKNOWN", "confidence": 0-100, "evidence_quotes": [] },
  "partnership_signals_olympiad_participation": { "value": true/false/null, "status": "VERIFIED"/"INFERRED"/"UNKNOWN", "confidence": 0-100, "evidence_quotes": [] },
  "partnership_signals_competitions_participation": { "value": true/false/null, "status": "VERIFIED"/"INFERRED"/"UNKNOWN", "confidence": 0-100, "evidence_quotes": [] },
  "partnership_signals_stem_focus": { "value": true/false/null, "status": "VERIFIED"/"INFERRED"/"UNKNOWN", "confidence": 0-100, "evidence_quotes": [] },
  "partnership_signals_coding_curriculum": { "value": true/false/null, "status": "VERIFIED"/"INFERRED"/"UNKNOWN", "confidence": 0-100, "evidence_quotes": [] },
  "email": { "value": "email@domain.com" or null, "status": "VERIFIED"/"INFERRED"/"UNKNOWN", "confidence": 0-100, "evidence_quotes": [] },
  "phone": { "value": "phone number" or null, "status": "VERIFIED"/"INFERRED"/"UNKNOWN", "confidence": 0-100, "evidence_quotes": [] },
  "objections": ["list of potential school objections to joining a national talent search like CNTS, based on context"],
  "pitch_recommendation": "Grounded pitch strategy tailored to this school's focus, naming specific decision makers if known."
}`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`OpenRouter extraction failed: ${errText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    const parsed: AIExtractedIntelligence = JSON.parse(content);

    return parsed;
  }
}
