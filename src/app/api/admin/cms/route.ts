/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";
import { verifySession } from "@/lib/sessionHelper";

const JWT_SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    // 1. Sandbox fallback
    if (!hasSupabaseAdminConfig) {
      const mockArticles = [
        { id: "art-1", title: "Registration Process & FAQ", slug: "registration-faq", category: "FAQ", content: "To register, enter your mobile number...", version: 1, published: true, created_at: new Date().toISOString() },
        { id: "art-2", title: "Benefits of Cognitive Assessments", slug: "benefits-cognitive", category: "BLOG", content: "Cognitive testing helps identify logic...", version: 2, published: true, created_at: new Date().toISOString() },
        { id: "art-3", title: "Exam Schedule Announcement", slug: "schedule-announcement", category: "ANNOUNCEMENT", content: "The founding edition will take place...", version: 1, published: false, created_at: new Date().toISOString() }
      ];

      if (category) {
        return NextResponse.json({ success: true, articles: mockArticles.filter(a => a.category === category) });
      }
      return NextResponse.json({ success: true, articles: mockArticles });
    }

    // 2. Fetch articles from DB
    let query = (supabaseAdmin as any)
      .from("support_articles")
      .select("*")
      .order("created_at", { ascending: false });

    if (category) {
      query = query.eq("category", category);
    }

    const { data: articles, error } = await query;
    if (error) {
      console.error("[CMS API] GET DB error:", error);
      return NextResponse.json({ success: false, message: "Database query error" }, { status: 500 });
    }

    return NextResponse.json({ success: true, articles });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("cnts_session");

    if (hasSupabaseAdminConfig) {
      if (!sessionCookie || !sessionCookie.value || !JWT_SECRET) {
        return NextResponse.json({ success: false, message: "Authentication session required." }, { status: 401 });
      }

      const payload = await verifySession(sessionCookie.value, JWT_SECRET);
      if (!payload || payload.role !== "admin") {
        return NextResponse.json({ success: false, message: "Forbidden: Admin access required." }, { status: 403 });
      }

      const body = await request.json();
      const { id, title, slug, category, content, published } = body;

      if (!title || !slug || !category || !content) {
        return NextResponse.json({ success: false, message: "Missing required parameters: title, slug, category, content" }, { status: 400 });
      }

      let resultArticle: any = null;
      let actionType = "CREATED_CMS";

      if (id) {
        actionType = "MODIFIED_CMS";
        // Fetch current version for history increment
        const { data: current } = await (supabaseAdmin as any)
          .from("support_articles")
          .select("*")
          .eq("id", id)
          .maybeSingle();

        const currentVersion = current?.version || 1;

        const { data: updated, error: updateErr } = await (supabaseAdmin as any)
          .from("support_articles")
          .update({
            title: title.trim(),
            slug: slug.trim().toLowerCase(),
            category,
            content,
            published: !!published,
            version: currentVersion + 1
          })
          .eq("id", id)
          .select()
          .maybeSingle();

        if (updateErr) {
          console.error("[CMS API] Update DB error:", updateErr);
          return NextResponse.json({ success: false, message: "Database update error" }, { status: 500 });
        }
        resultArticle = updated;

        // Log operation in audit trail
        await (supabaseAdmin as any).from("admin_operations_audit_trail").insert({
          actor_id: payload.cntsId || null,
          actor_role: "ADMIN",
          action: "MODIFIED_CMS",
          module: "CMS",
          previous_value: current || {},
          new_value: updated || {},
          ip_address: request.headers.get("x-forwarded-for") || "unknown"
        });
      } else {
        const { data: inserted, error: insertErr } = await (supabaseAdmin as any)
          .from("support_articles")
          .insert({
            title: title.trim(),
            slug: slug.trim().toLowerCase(),
            category,
            content,
            published: !!published,
            version: 1
          })
          .select()
          .maybeSingle();

        if (insertErr) {
          console.error("[CMS API] Insert DB error:", insertErr);
          return NextResponse.json({ success: false, message: "Database insert error" }, { status: 500 });
        }
        resultArticle = inserted;

        // Log operation in audit trail
        await (supabaseAdmin as any).from("admin_operations_audit_trail").insert({
          actor_id: payload.cntsId || null,
          actor_role: "ADMIN",
          action: "PUBLISHED_CMS",
          module: "CMS",
          previous_value: {},
          new_value: inserted || {},
          ip_address: request.headers.get("x-forwarded-for") || "unknown"
        });
      }

      return NextResponse.json({ success: true, article: resultArticle });
    }

    // Sandbox Mock response
    return NextResponse.json({
      success: true,
      article: {
        id: "mock-cms-id",
        title: "Mock CMS Item",
        slug: "mock-slug",
        category: "FAQ",
        content: "Mock Content details",
        version: 1,
        published: true,
        created_at: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error("[CMS API] POST Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
