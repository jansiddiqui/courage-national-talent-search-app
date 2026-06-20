import { NextResponse } from "next/server";
import { matchFAQ } from "@/lib/cntsKnowledgeBase";

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role !== "user") {
      return NextResponse.json({ error: "Last message must be from user" }, { status: 400 });
    }

    const userQuery = lastMessage.content.toLowerCase();

    // STEP 1: HYBRID ROUTING - KNOWLEDGE BASE CHECK
    const faqMatch = matchFAQ(userQuery);
    if (faqMatch) {
      return NextResponse.json({ reply: faqMatch });
    }

    // STEP 2: HYBRID ROUTING - HARD EXCLUSIONS
    // Do not let OpenRouter hallucinate sensitive data.
    const excludedKeywords = [
      "result", "score", "marks", "did i pass", "rank", "ranking",
      "payment status", "transaction", "refund status",
      "candidate status", "my child's performance", "application status"
    ];

    if (excludedKeywords.some(keyword => userQuery.includes(keyword))) {
      return NextResponse.json({
        reply: "I cannot access candidate-specific information like results, payment statuses, or rankings. Please log in to the Candidate Portal or contact our support team for assistance."
      });
    }

    // STEP 3: HYBRID ROUTING - AI FALLBACK (OpenRouter)
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      console.error("OpenRouter API key missing. Falling back to support prompt.");
      return NextResponse.json({
        reply: "I am unable to connect to my AI network right now. Please check our FAQ section or contact support."
      });
    }

    const systemPrompt = `You are the CNTS Assistant, a helpful, professional AI representing Courage National Talent Search.

Strict Rules:
- You help parents and students understand the CNTS platform, eligibility, and format.
- Keep answers concise, friendly, and structured. Use bullet points if helpful.
- NEVER invent dates, deadlines, syllabus topics, fees, or rewards that are not common knowledge.
- If a user asks for personal results, candidate data, or payment confirmation, you MUST tell them to log in to the portal or contact support.
- The registration fee is ₹99. It is open to Classes 5 to 8. The exam is 90 minutes online. No webcam needed.
- If you don't know something, do not guess. Tell them to contact support.`;

    const openRouterMessages = [
      { role: "system", content: systemPrompt },
      ...messages
    ];

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: openRouterMessages,
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API error:", errorText);
      return NextResponse.json({ reply: "I'm having trouble connecting right now. Please try again later or contact support." });
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;

    return NextResponse.json({ reply });

  } catch (error) {
    console.error("Error in /api/chat:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
