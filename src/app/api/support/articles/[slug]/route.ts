/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";

export async function GET(request: Request, props: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await props.params;
    if (!slug) {
      return NextResponse.json({ success: false, message: "Missing slug parameter." }, { status: 400 });
    }

    if (!hasSupabaseAdminConfig) {
      // Sandbox fallback data
      const mockArticles = [
        { id: "art-1", title: "Who can appear for CNTS?", slug: "who-can-appear", category: "FAQ", content: "Students currently enrolled in Classes 5-8 from any recognized board in India are eligible.", version: 1, published: true, created_at: new Date().toISOString() },
        { id: "art-2", title: "Registration Process & FAQ", slug: "registration-faq", category: "REGISTRATION", content: "To register, enter your mobile number and submit parent approval details.", version: 1, published: true, created_at: new Date().toISOString() },
        { id: "art-3", title: "Benefits of Cognitive Assessments", slug: "benefits-cognitive", category: "BLOG", content: "Cognitive testing helps identify logic and spatial reasoning growth patterns.", version: 2, published: true, created_at: new Date().toISOString() }
      ];

      const article = mockArticles.find(a => a.slug === slug && a.published);
      if (!article) {
        return NextResponse.json({ success: false, message: "Article not found." }, { status: 404 });
      }

      // Fetch related mock articles
      const related = mockArticles.filter(a => a.category === article.category && a.id !== article.id && a.published).slice(0, 3);

      return NextResponse.json({
        success: true,
        article: {
          title: article.title,
          slug: article.slug,
          category: article.category,
          content: article.content,
          created_at: article.created_at
        },
        related
      });
    }

    const { data: article, error } = await (supabaseAdmin as any)
      .from("support_articles")
      .select("id, title, slug, category, content, version, created_at")
      .eq("slug", slug.toLowerCase())
      .eq("published", true)
      .maybeSingle();

    if (error || !article) {
      return NextResponse.json({ success: false, message: "Article not found." }, { status: 404 });
    }

    // Query related articles
    const { data: related } = await (supabaseAdmin as any)
      .from("support_articles")
      .select("title, slug, category")
      .eq("category", article.category)
      .eq("published", true)
      .neq("id", article.id)
      .limit(3);

    return NextResponse.json({
      success: true,
      article: {
        title: article.title,
        slug: article.slug,
        category: article.category,
        content: article.content,
        created_at: article.created_at
      },
      related: related || []
    }, {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=300"
      }
    });

  } catch (error: any) {
    console.error("[Public Article Detail API] Failure:", error);
    return NextResponse.json({ success: false, message: "Server error." }, { status: 500 });
  }
}
