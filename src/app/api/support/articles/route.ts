/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "10")));
    const offset = (page - 1) * limit;

    if (!hasSupabaseAdminConfig) {
      // Sandbox fallback data
      const mockArticles = [
        { id: "art-1", title: "Who can appear for CNTS?", slug: "who-can-appear", category: "FAQ", content: "Students currently enrolled in Classes 5-8 from any recognized board in India are eligible.", version: 1, published: true, created_at: new Date().toISOString() },
        { id: "art-2", title: "Registration Process & FAQ", slug: "registration-faq", category: "REGISTRATION", content: "To register, enter your mobile number and submit parent approval details.", version: 1, published: true, created_at: new Date().toISOString() },
        { id: "art-3", title: "Benefits of Cognitive Assessments", slug: "benefits-cognitive", category: "BLOG", content: "Cognitive testing helps identify logic and spatial reasoning growth patterns.", version: 2, published: true, created_at: new Date().toISOString() }
      ];

      let filtered = mockArticles.filter(a => a.published);
      if (category) {
        filtered = filtered.filter(a => a.category.toUpperCase() === category.toUpperCase());
      }
      if (search) {
        const query = search.toLowerCase();
        filtered = filtered.filter(a => a.title.toLowerCase().includes(query) || a.content.toLowerCase().includes(query));
      }

      return NextResponse.json({
        success: true,
        articles: filtered.slice(offset, offset + limit),
        total: filtered.length
      });
    }

    let query = (supabaseAdmin as any)
      .from("support_articles")
      .select("id, title, slug, category, content, version, created_at", { count: "exact" })
      .eq("published", true)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (category) {
      query = query.eq("category", category.toUpperCase());
    }

    if (search) {
      const escapedSearch = search.trim().replace(/[%_]/g, "\\$&");
      query = query.or(`title.ilike.%${escapedSearch}%,content.ilike.%${escapedSearch}%`);
    }

    const { data: articles, count, error } = await query;

    if (error) {
      console.error("[Public Articles API] GET error:", error.message);
      return NextResponse.json({ success: false, message: "Database query error." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      articles,
      total: count || 0
    }, {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=300"
      }
    });

  } catch (error: any) {
    console.error("[Public Articles API] Failure:", error);
    return NextResponse.json({ success: false, message: "Server error." }, { status: 500 });
  }
}
