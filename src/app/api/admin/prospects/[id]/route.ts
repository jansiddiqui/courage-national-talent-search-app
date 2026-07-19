import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";
import { verifySession } from "@/lib/sessionHelper";
import { checkAdminPermission } from "@/domains/admin/AdminAuthService";
import { writeAuditEntry } from "@/domains/admin/AdminAuditService";
import { SchoolScoringService } from "@/domains/school-intelligence/SchoolScoringService";

const JWT_SECRET = process.env.JWT_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "";

async function authenticate(permissionKey: string) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("cnts_session");

  if (!sessionCookie || !sessionCookie.value || !JWT_SECRET) return null;

  const session = await verifySession(sessionCookie.value, JWT_SECRET);
  if (!session || (!session.id && !session.email && !session.phone)) return null;

  const hasPerm = await checkAdminPermission(supabaseAdmin, session.id || session.email || session.phone, permissionKey);
  if (!hasPerm) return null;

  return session;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!hasSupabaseAdminConfig) {
      return NextResponse.json({ success: false, message: "Sandbox sandbox mode." }, { status: 503 });
    }

    const session = await authenticate("schools.view");
    if (!session) {
      return NextResponse.json({ success: false, message: "Forbidden: schools.view permission required." }, { status: 403 });
    }

    const { id } = await params;

    // Fetch prospect
    const { data: prospect, error: fetchErr } = await (supabaseAdmin as any)
      .from("school_prospects")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchErr || !prospect) {
      return NextResponse.json({ success: false, message: "School prospect not found" }, { status: 404 });
    }

    // Fetch claims evidence
    const { data: evidence, error: evErr } = await (supabaseAdmin as any)
      .from("school_prospect_claims_evidence")
      .select("*")
      .eq("prospect_id", id);

    return NextResponse.json({
      success: true,
      prospect,
      evidence: evidence || []
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!hasSupabaseAdminConfig) {
      return NextResponse.json({ success: false, message: "Sandbox sandbox mode." }, { status: 503 });
    }

    const session = await authenticate("schools.edit");
    if (!session) {
      return NextResponse.json({ success: false, message: "Forbidden: schools.edit permission required." }, { status: 403 });
    }

    const { id } = await params;

    const { data: prospect } = await (supabaseAdmin as any)
      .from("school_prospects")
      .select("name")
      .eq("id", id)
      .single();

    const { error: delErr } = await (supabaseAdmin as any)
      .from("school_prospects")
      .delete()
      .eq("id", id);

    if (delErr) {
      console.error("[Prospects API] Delete error:", delErr);
      return NextResponse.json({ success: false, message: "Failed to delete prospect" }, { status: 500 });
    }

    // Also delete any queued/processing enrichment jobs for this prospect
    await (supabaseAdmin as any)
      .from("admin_background_jobs")
      .delete()
      .eq("job_type", "SCHOOL_PROSPECT_ENRICH")
      .contains("payload", { prospectId: id });

    // Write audit trail
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    await writeAuditEntry(supabaseAdmin, {
      actorId: session.id,
      actorRole: "ADMIN",
      action: "DELETED_SCHOOL_PROSPECT",
      module: "SCHOOLS",
      previousValue: { id, name: prospect?.name },
      newValue: {},
      ipAddress: ip
    });

    return NextResponse.json({
      success: true,
      message: "Prospect successfully deleted"
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!hasSupabaseAdminConfig) {
      return NextResponse.json({ success: false, message: "Sandbox sandbox mode." }, { status: 503 });
    }

    const session = await authenticate("schools.edit");
    if (!session) {
      return NextResponse.json({ success: false, message: "Forbidden: schools.edit permission required." }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    // Separate claims from direct prospect fields
    const { claims, ...prospectFields } = body;

    const { data: previous } = await (supabaseAdmin as any)
      .from("school_prospects")
      .select("outreach_status")
      .eq("id", id)
      .maybeSingle();

    // Filter to ensure only valid columns are updated in school_prospects
    const allowedColumns = [
      "name", "alternative_name", "city", "district", "state", 
      "board", "affiliation_number", "school_type", "website",
      "outreach_status", "last_contacted_at", "next_followup_at", 
      "outreach_channel", "outreach_notes"
    ];

    const updatePayload: any = {};
    for (const key of allowedColumns) {
      if (key in prospectFields) {
        updatePayload[key] = prospectFields[key];
      }
    }
    updatePayload.updated_at = new Date().toISOString();

    const { data: updated, error } = await (supabaseAdmin as any)
      .from("school_prospects")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[Prospect PATCH Error]", error);
      return NextResponse.json({ success: false, message: "Failed to update prospect" }, { status: 500 });
    }

    // Handle claims upsert if provided
    if (claims && typeof claims === "object") {
      for (const [claimKey, claimVal] of Object.entries(claims)) {
        if (claimVal === undefined) continue;

        // Try to find if a claim already exists
        const { data: existingClaim } = await (supabaseAdmin as any)
          .from("school_prospect_claims_evidence")
          .select("id")
          .eq("prospect_id", id)
          .eq("claim_key", claimKey)
          .maybeSingle();

        if (existingClaim) {
          await (supabaseAdmin as any)
            .from("school_prospect_claims_evidence")
            .update({
              extracted_value: claimVal,
              source_url: "MANUAL_ENTRY",
              source_title: "Manual Update",
              evidence_text: "Manually updated by administrator",
              evidence_status: "VERIFIED",
              confidence: 100,
              extracted_at: new Date().toISOString()
            })
            .eq("id", existingClaim.id);
        } else {
          await (supabaseAdmin as any)
            .from("school_prospect_claims_evidence")
            .insert({
              prospect_id: id,
              claim_key: claimKey,
              extracted_value: claimVal,
              source_url: "MANUAL_ENTRY",
              source_title: "Manual Update",
              evidence_text: "Manually updated by administrator",
              evidence_status: "VERIFIED",
              confidence: 100,
              extracted_at: new Date().toISOString()
            });
        }
      }
    }

    if (body.outreach_status && previous && previous.outreach_status !== body.outreach_status) {
      await (supabaseAdmin as any)
        .from("school_prospect_outreach_events")
        .insert({
          prospect_id: id,
          event_type: "STATUS_CHANGE",
          previous_status: previous.outreach_status,
          new_status: body.outreach_status,
          note: body.outreach_notes || null,
          actor_id: session.id || null
        });
    }

    // Recalculate outreach score based on latest database state (direct columns + claims evidence)
    const { data: latestProspect } = await (supabaseAdmin as any)
      .from("school_prospects")
      .select("*")
      .eq("id", id)
      .single();

    const { data: latestClaims } = await (supabaseAdmin as any)
      .from("school_prospect_claims_evidence")
      .select("*")
      .eq("prospect_id", id);

    const makeClaimObj = (val: any, status: string = "UNKNOWN", confidence: number = 0) => ({
      value: val,
      status: status as any,
      confidence,
      evidence_quotes: []
    });

    const intelligence: any = {
      board: makeClaimObj(latestProspect.board, latestProspect.board ? "VERIFIED" : "UNKNOWN", latestProspect.board ? 100 : 0),
      school_type: makeClaimObj(latestProspect.school_type, latestProspect.school_type ? "VERIFIED" : "UNKNOWN", latestProspect.school_type ? 100 : 0),
      classes_offered: makeClaimObj(null),
      medium: makeClaimObj(null),
      principal_name: makeClaimObj(null),
      director_name: makeClaimObj(null),
      academic_coordinator_name: makeClaimObj(null),
      student_strength_estimate: makeClaimObj(null),
      facilities_computer_lab: makeClaimObj(null),
      facilities_smart_classrooms: makeClaimObj(null),
      facilities_stem_facilities: makeClaimObj(null),
      facilities_atal_tinkering_lab: makeClaimObj(null),
      partnership_signals_olympiad_participation: makeClaimObj(null),
      partnership_signals_competitions_participation: makeClaimObj(null),
      partnership_signals_stem_focus: makeClaimObj(null),
      partnership_signals_coding_curriculum: makeClaimObj(null),
      email: makeClaimObj(null),
      phone: makeClaimObj(null),
      objections: [],
      pitch_recommendation: "Introduce CNTS assessment metrics directly to the head of school."
    };

    if (latestClaims) {
      for (const cl of latestClaims) {
        let val: any = cl.extracted_value;
        if (val === "true") val = true;
        else if (val === "false") val = false;
        else if (val !== null && !isNaN(Number(val)) && val.trim() !== "") val = Number(val);

        if (cl.claim_key in intelligence) {
          intelligence[cl.claim_key] = makeClaimObj(val, cl.evidence_status, cl.confidence);
        }
      }
    }

    const scoring = SchoolScoringService.calculateScore(intelligence, !!latestProspect.website);

    const { data: finalUpdated } = await (supabaseAdmin as any)
      .from("school_prospects")
      .update({
        outreach_score: scoring.totalScore,
        confidence_score: scoring.confidenceScore,
        scoring_breakdown: scoring.breakdown,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single();

    return NextResponse.json({
      success: true,
      prospect: finalUpdated || updated
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
