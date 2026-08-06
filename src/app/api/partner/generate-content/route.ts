import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { format, tone, language, audience, referralCode, partnerName } = await request.json();

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'AI service not configured' }, { status: 503 });
    }

    const referralUrl = `https://thecouragelibrary.com/register?ref=${referralCode || 'CNTSJN'}`;
    const name = partnerName || 'Courage Partner';

    const systemPrompt = `You are a viral content writer for Courage Library, an educational platform running CNTS 2026 (Courage National Talent Search), India's premier merit scholarship exam for Class 5–8 students.

Key facts to always include:
- Exam: CNTS 2026, for Class 5 to 8 students
- Benefit: 100% Merit Scholarships, National Rank Certificate, Skill Diagnostic Report
- Registration Fee: ₹99
- Official Partner: ${name}
- Partner Referral Code: ${referralCode || 'CNTSJN'}
- Referral URL: ${referralUrl}
- Deadline: September 30, 2026

Rules:
- Write ONLY the content itself — no preamble like "Here is..." or "Sure, here is..."
- Use emojis naturally for WhatsApp/Instagram formats
- For LinkedIn: formal, professional tone, no excessive emojis
- For Hindi/Hinglish: mix naturally, don't over-translate
- Always end with the referral URL and code
- Keep it authentic and high-converting`;

    const userPrompt = `Write a ${format} about CNTS 2026.
Tone: ${tone}
Language: ${language}
Target Audience: ${audience}

Generate the complete, ready-to-post content now.`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://thecouragelibrary.com',
        'X-Title': 'Courage Partner AI Studio',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        max_tokens: 600,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter error in generate-content:', errorText);
      return NextResponse.json({ error: 'AI generation failed. Please try again.' }, { status: 502 });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Error in /api/partner/generate-content:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
