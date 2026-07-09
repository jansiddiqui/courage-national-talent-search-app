/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";
import { verifySession } from "@/lib/sessionHelper";
import { isRateLimited } from "@/lib/rateLimiter";

const JWT_SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

export async function GET(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    
    // 1. Throttling Check
    const { limited } = await isRateLimited(ip, "admin-tickets-list", 100, 60);
    if (limited) {
      return NextResponse.json({ success: false, message: "Too many requests. Please try again later." }, { status: 429 });
    }

    if (!hasSupabaseAdminConfig) {
      return NextResponse.json({ success: true, tickets: [], total: 0 });
    }

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("cnts_session");

    if (!sessionCookie || !sessionCookie.value || !JWT_SECRET) {
      return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });
    }

    // 2. Cryptographic session verification
    const payload = await verifySession(sessionCookie.value, JWT_SECRET);
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ success: false, message: "Forbidden: Admin access required." }, { status: 403 });
    }

    // 3. Parse query filters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const category = searchParams.get("category");
    const assignedTo = searchParams.get("assigned_to");
    const search = searchParams.get("search");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "10")));
    const fromOffset = (page - 1) * limit;

    let query = (supabaseAdmin as any)
      .from("support_tickets")
      .select("*, assigned_agent:assigned_to(id, name, email)", { count: "exact" });

    // Apply filters
    if (status) {
      if (status.toLowerCase() === "response_breached") {
        query = query.eq("sla_state", "RESPONSE_BREACHED");
      } else if (status.toLowerCase() === "resolution_breached") {
        query = query.eq("sla_state", "RESOLUTION_BREACHED");
      } else {
        query = query.eq("status", status.toUpperCase());
      }
    }
    if (priority) {
      query = query.eq("priority", priority.toUpperCase());
    }
    if (category) {
      query = query.eq("category", category.toUpperCase());
    }
    if (assignedTo === "unassigned") {
      query = query.is("assigned_to", null);
    } else if (assignedTo) {
      query = query.eq("assigned_to", assignedTo);
    }

    if (search) {
      query = query.or(`ticket_number.ilike.%${search}%,subject.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Paginate and order by priority and created date
    query = query
      .order("created_at", { ascending: false })
      .range(fromOffset, fromOffset + limit - 1);

    const { data: tickets, count, error } = await query;

    if (error) {
      console.error("[Admin Tickets API] fetch error:", error);
      return NextResponse.json({ success: false, message: "Unable to query tickets from database." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      tickets: tickets || [],
      total: count || 0,
      page,
      limit
    }, {
      headers: {
        "Cache-Control": "private, no-store, no-cache, must-revalidate"
      }
    });

  } catch (error: any) {
    console.error("[Admin Tickets API] System failure:", error);
    return NextResponse.json({ success: false, message: "Server error." }, { status: 500 });
  }
}
