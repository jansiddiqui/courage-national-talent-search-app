import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";
import { verifySession } from "@/lib/sessionHelper";
import { checkAdminPermission } from "@/domains/admin/AdminAuthService";
import { writeAuditEntry } from "@/domains/admin/AdminAuditService";

const JWT_SECRET = process.env.JWT_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "";

async function authenticate(permissionKey: string) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("cnts_session");

  if (!sessionCookie || !sessionCookie.value || !JWT_SECRET) return null;

  const session = await verifySession(sessionCookie.value, JWT_SECRET);
  if (!session || !session.id) return null;

  const hasPerm = await checkAdminPermission(supabaseAdmin, session.id, permissionKey);
  if (!hasPerm) return null;

  return session;
}

export async function GET(request: Request) {
  try {
    if (!hasSupabaseAdminConfig) {
      return NextResponse.json({ success: true, prospects: [], total: 0 });
    }

    const session = await authenticate("schools.view");
    if (!session) {
      return NextResponse.json({ success: false, message: "Forbidden: schools.view permission required." }, { status: 403 });
    }

    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "20", 10);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const offset = (page - 1) * limit;

    const search = url.searchParams.get("search") || "";
    const state = url.searchParams.get("state") || "";
    const city = url.searchParams.get("city") || "";
    const board = url.searchParams.get("board") || "";
    const status = url.searchParams.get("status") || "";
    const outreachStatus = url.searchParams.get("outreach_status") || "";
    const minScore = parseInt(url.searchParams.get("minScore") || "0", 10);

    let query = (supabaseAdmin as any)
      .from("school_prospects")
      .select("*", { count: "exact" });

    if (search) {
      query = query.ilike("name", `%${search}%`);
    }
    if (state) {
      query = query.eq("state", state);
    }
    if (city) {
      query = query.eq("city", city);
    }
    if (board) {
      query = query.eq("board", board);
    }
    if (status) {
      query = query.eq("enrichment_status", status);
    }
    if (outreachStatus) {
      query = query.eq("outreach_status", outreachStatus);
    }
    if (minScore > 0) {
      query = query.gte("outreach_score", minScore);
    }

    const { data: prospects, count, error } = await query
      .order("outreach_score", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("[Prospects API] Fetch error:", error);
      return NextResponse.json({ success: false, message: "Failed to fetch prospects" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      prospects: prospects || [],
      total: count || 0
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!hasSupabaseAdminConfig) {
      return NextResponse.json({ success: false, message: "Sandbox sandbox mode." }, { status: 503 });
    }

    const session = await authenticate("schools.edit");
    if (!session) {
      return NextResponse.json({ success: false, message: "Forbidden: schools.edit permission required." }, { status: 403 });
    }

    const body = await request.json();
    const items = Array.isArray(body) ? body : [body];

    const insertedIds: string[] = [];
    const duplicatesCount = { possible: 0, confirmed: 0 };

    for (const item of items) {
      if (!item.name || !item.city || !item.state) continue;

      const normalizedName = item.name.toLowerCase().replace(/\s+/g, "");

      // Check for confirmed duplicate (same name + city + state OR same board affiliation number)
      let duplicateOfId: string | null = null;
      let identityStatus: "DISTINCT" | "POSSIBLE_DUPLICATE" | "CONFIRMED_DUPLICATE" = "DISTINCT";

      if (item.affiliation_number) {
        const { data: dupAff } = await (supabaseAdmin as any)
          .from("school_prospects")
          .select("id")
          .eq("affiliation_number", item.affiliation_number)
          .maybeSingle();
        if (dupAff) {
          duplicateOfId = dupAff.id;
          identityStatus = "CONFIRMED_DUPLICATE";
          duplicatesCount.confirmed++;
        }
      }

      if (!duplicateOfId) {
        // Name + City + State check
        const { data: dupName } = await (supabaseAdmin as any)
          .from("school_prospects")
          .select("id")
          .eq("state", item.state)
          .eq("city", item.city)
          .ilike("name", item.name)
          .maybeSingle();

        if (dupName) {
          duplicateOfId = dupName.id;
          identityStatus = "POSSIBLE_DUPLICATE";
          duplicatesCount.possible++;
        }
      }

      const { data: inserted, error: insertErr } = await (supabaseAdmin as any)
        .from("school_prospects")
        .insert({
          name: item.name.trim(),
          normalized_name: item.name.trim().toLowerCase().replace(/[^a-z0-9]/g, ""),
          alternative_name: item.alternative_name || null,
          city: item.city.trim(),
          district: item.district?.trim() || null,
          state: item.state.trim(),
          board: item.board || null,
          affiliation_number: item.affiliation_number || null,
          school_type: item.school_type || null,
          website: item.website || null,
          discovery_source: item.discovery_source || "MANUAL_IMPORT",
          source_identifier: item.affiliation_number || null,
          enrichment_status: "PENDING",
          outreach_status: "NEW",
          identity_status: identityStatus,
          duplicate_of: duplicateOfId
        })
        .select()
        .single();

      if (!insertErr && inserted) {
        insertedIds.push(inserted.id);
      }
    }

    // Write audit entry
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    await writeAuditEntry(supabaseAdmin, {
      actorId: session.id,
      actorRole: "ADMIN",
      action: "IMPORTED_PROSPECT_SCHOOLS",
      module: "SCHOOLS",
      previousValue: {},
      newValue: { importedCount: insertedIds.length, duplicatesCount },
      ipAddress: ip
    });

    return NextResponse.json({
      success: true,
      importedCount: insertedIds.length,
      duplicatesCount,
      insertedIds
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
