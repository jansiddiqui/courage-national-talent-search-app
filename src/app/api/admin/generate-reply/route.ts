import { NextResponse } from "next/server";
import { hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";

export async function POST(request: Request) {
  if (!hasSupabaseAdminConfig) {
    return NextResponse.json({ success: false, error: "Missing admin config" }, { status: 403 });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ success: false, error: "OpenRouter API key is missing." }, { status: 500 });
  }

  try {
    const { name, subject, message } = await request.json();

    if (!message) {
      return NextResponse.json({ success: false, error: "Message is required" }, { status: 400 });
    }

    const systemPrompt = `You are a Customer Support Specialist for Courage National Talent Search (CNTS).

Rules:
- Be professional and reassuring.
- Keep responses under 150 words.
- Never invent registration status, payment status, or exam results.
- If information is unavailable, ask the parent to wait for verification.
- Never promise refunds, scholarships, rankings, or rewards.
- Use simple language understandable by parents.
- End with:

Regards,
CNTS Support Team`;

    const userPrompt = `Parent Name: ${name || "Parent"}
Subject: ${subject || "General Inquiry"}
Parent Message: ${message}

Draft a response to this parent based on the rules.`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        max_tokens: 300,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API error:", errorText);
      return NextResponse.json({ success: false, error: "Failed to generate reply from AI" }, { status: response.status });
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;

    return NextResponse.json({ success: true, reply });

  } catch (error) {
    console.error("Error in /api/admin/generate-reply:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
