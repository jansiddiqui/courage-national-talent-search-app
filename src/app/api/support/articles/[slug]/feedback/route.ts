/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";
import { isRateLimited } from "@/lib/rateLimiter";

export async function POST(request: Request, props: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await props.params;
    if (!slug) {
      return NextResponse.json({ success: false, message: "Missing slug parameter." }, { status: 400 });
    }

    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const { limited } = await isRateLimited(ip, "article-feedback", 10, 60);
    if (limited) {
      return NextResponse.json({ success: false, message: "Too many requests." }, { status: 429 });
    }

    const body = await request.json();
    const { helpful, reason } = body;

    if (helpful === undefined) {
      return NextResponse.json({ success: false, message: "Missing helpful status parameter." }, { status: 400 });
    }

    if (!hasSupabaseAdminConfig) {
      return NextResponse.json({ success: true, message: "Sandbox mode: logged feedback." });
    }

    // Resolve article ID from slug
    const { data: article, error: articleErr } = await (supabaseAdmin as any)
      .from("support_articles")
      .select("id")
      .eq("slug", slug.toLowerCase())
      .single();

    if (articleErr || !article) {
      return NextResponse.json({ success: false, message: "Article not found." }, { status: 404 });
    }

    // Insert feedback entry
    const { error: insertErr } = await (supabaseAdmin as any)
      .from("support_article_feedback")
      .insert({
        article_id: article.id,
        helpful: !!helpful,
        reason: reason ? reason.slice(0, 1000) : null
      });

    if (insertErr) {
      console.error("[Article Feedback API] Insert error:", insertErr.message);
      return NextResponse.json({ success: false, message: "Failed to save feedback." }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Thank you for your feedback!" });

  } catch (error: any) {
    console.error("[Article Feedback API] Server error:", error);
    return NextResponse.json({ success: false, message: "Server error." }, { status: 500 });
  }
}
