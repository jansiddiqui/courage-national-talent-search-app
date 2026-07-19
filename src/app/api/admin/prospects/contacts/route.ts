import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";
import { verifySession } from "@/lib/sessionHelper";
import { checkAdminPermission } from "@/domains/admin/AdminAuthService";

const JWT_SECRET = process.env.JWT_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "";

async function authenticate(permissionKey: string) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("cnts_session");

  console.log("[Contacts Auth Debug] Cookie exists:", !!sessionCookie, "Value length:", sessionCookie?.value?.length);
  console.log("[Contacts Auth Debug] JWT_SECRET exists:", !!JWT_SECRET);

  if (!sessionCookie || !sessionCookie.value || !JWT_SECRET) {
    console.warn("[Contacts Auth Debug] Missing cookie or JWT_SECRET");
    return null;
  }

  const session = await verifySession(sessionCookie.value, JWT_SECRET);
  console.log("[Contacts Auth Debug] Verified Session:", session ? { id: session.id, email: session.email, phone: session.phone } : "null");

  if (!session || (!session.id && !session.email && !session.phone)) {
    console.warn("[Contacts Auth Debug] Session verification failed or empty identifier");
    return null;
  }

  const hasPerm = await checkAdminPermission(supabaseAdmin, session.id || session.email || session.phone, permissionKey);
  console.log("[Contacts Auth Debug] Permission key:", permissionKey, "hasPerm:", hasPerm);

  if (!hasPerm) return null;

  return session;
}

export async function GET(request: Request) {
  try {
    if (!hasSupabaseAdminConfig) {
      return NextResponse.json({ success: true, contacts: [] });
    }

    const session = await authenticate("schools.view");
    if (!session) {
      return NextResponse.json({ success: false, message: "Forbidden: schools.view permission required." }, { status: 403 });
    }

    // 1. Fetch claims for email and phone using batching (bypasses PostgREST 1000 limit)
    const claims: any[] = [];
    let claimsPage = 0;
    const pageSize = 1000;
    while (true) {
      const { data, error: claimsErr } = await (supabaseAdmin as any)
        .from("school_prospect_claims_evidence")
        .select("prospect_id, claim_key, extracted_value")
        .in("claim_key", ["email", "phone"])
        .range(claimsPage * pageSize, (claimsPage + 1) * pageSize - 1);

      if (claimsErr) {
        console.error("[Contacts API] Claims fetch error:", claimsErr);
        return NextResponse.json({ success: false, message: "Failed to fetch claims data" }, { status: 500 });
      }
      if (!data || data.length === 0) break;
      claims.push(...data);
      if (data.length < pageSize) break;
      claimsPage++;
    }

    // 2. Fetch all prospects with outreach info using batching (bypasses PostgREST 1000 limit)
    const prospects: any[] = [];
    let prospectsPage = 0;
    while (true) {
      const { data, error: prospectsErr } = await (supabaseAdmin as any)
        .from("school_prospects")
        .select("id, name, state, city, website, enrichment_status, outreach_status")
        .order("name", { ascending: true })
        .range(prospectsPage * pageSize, (prospectsPage + 1) * pageSize - 1);

      if (prospectsErr) {
        console.error("[Contacts API] Prospects fetch error:", prospectsErr);
        return NextResponse.json({ success: false, message: "Failed to fetch prospects data" }, { status: 500 });
      }
      if (!data || data.length === 0) break;
      prospects.push(...data);
      if (data.length < pageSize) break;
      prospectsPage++;
    }

    // 3. Also fetch principal_name from claims using batching (bypasses PostgREST 1000 limit)
    const principalClaims: any[] = [];
    let principalPage = 0;
    while (true) {
      const { data, error: principalErr } = await (supabaseAdmin as any)
        .from("school_prospect_claims_evidence")
        .select("prospect_id, extracted_value")
        .eq("claim_key", "principal_name")
        .range(principalPage * pageSize, (principalPage + 1) * pageSize - 1);

      if (principalErr) {
        console.error("[Contacts API] Principal claims fetch error:", principalErr);
        return NextResponse.json({ success: false, message: "Failed to fetch principal claims" }, { status: 500 });
      }
      if (!data || data.length === 0) break;
      principalClaims.push(...data);
      if (data.length < pageSize) break;
      principalPage++;
    }

    const principalMap = new Map<string, string>();
    (principalClaims || []).forEach((c: any) => {
      if (c.extracted_value) principalMap.set(c.prospect_id, c.extracted_value);
    });

    // 4. Merge claims and prospects in-memory
    const contactMap = new Map<string, { email: string | null; phone: string | null }>();
    (claims || []).forEach((c: any) => {
      if (!contactMap.has(c.prospect_id)) {
        contactMap.set(c.prospect_id, { email: null, phone: null });
      }
      const entry = contactMap.get(c.prospect_id)!;
      if (c.claim_key === "email") entry.email = c.extracted_value;
      if (c.claim_key === "phone") entry.phone = c.extracted_value;
    });

    const contactsList = (prospects || []).map((p: any) => ({
      id: p.id,
      name: p.name,
      state: p.state,
      city: p.city,
      website: p.website,
      enrichment_status: p.enrichment_status,
      outreach_status: p.outreach_status || "NEW",
      principal_name: principalMap.get(p.id) || null,
      email: contactMap.get(p.id)?.email || null,
      phone: contactMap.get(p.id)?.phone || null,
    }));

    return NextResponse.json({
      success: true,
      contacts: contactsList
    });

  } catch (err: any) {
    console.error("[Contacts API] Handler error:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
