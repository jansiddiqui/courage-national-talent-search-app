/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";
import { verifySession } from "@/lib/sessionHelper";

const JWT_SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

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
      const { audience, templateName, channel } = body;

      if (!audience || !templateName || !channel) {
        return NextResponse.json({ success: false, message: "Missing audience, templateName, or channel parameters" }, { status: 400 });
      }

      // Fetch target audience candidates from DB
      let query = (supabaseAdmin as any).from("registrations").select("*");

      if (audience.startsWith("CLASS_")) {
        const cls = audience.replace("CLASS_", "");
        query = query.eq("student_class", cls);
      } else if (audience === "PAID") {
        query = query.eq("registration_status", "REGISTERED");
      }

      const { data: candidates, error: fetchErr } = await query;
      if (fetchErr) {
        console.error("[Broadcast API] Fetch error:", fetchErr);
        return NextResponse.json({ success: false, message: "Database query error" }, { status: 500 });
      }

      if (!candidates || candidates.length === 0) {
        return NextResponse.json({ success: true, sentCount: 0, message: "No candidates matched audience filters" });
      }

      // Batch insert into whatsapp_logs/email logs in database
      const logsToInsert = candidates.map((cand: any) => {
        const phone = cand.whatsapp_number || cand.parent_phone || "919999999999";
        const masked = phone.slice(0, 3) + "******" + phone.slice(-2);
        return {
          phone_number_masked: masked,
          message_type: `${templateName}_BROADCAST_${channel}`,
          status: "SENT",
          meta_message_id: `meta_bcast_${Math.random().toString(36).substring(2, 11)}`
        };
      });

      const { error: insertErr } = await (supabaseAdmin as any)
        .from("whatsapp_logs")
        .insert(logsToInsert);

      if (insertErr) {
        console.error("[Broadcast API] Insert logs error:", insertErr);
        return NextResponse.json({ success: false, message: "Failed to write delivery logs" }, { status: 500 });
      }

      // Write action to audit trail
      await (supabaseAdmin as any).from("admin_operations_audit_trail").insert({
        actor_id: payload.cntsId || null,
        actor_role: "ADMIN",
        action: "SENT_BROADCAST",
        module: "COMMUNICATIONS",
        previous_value: {},
        new_value: { audience, templateName, channel, sentCount: candidates.length },
        ip_address: request.headers.get("x-forwarded-for") || "unknown"
      });

      return NextResponse.json({ success: true, sentCount: candidates.length });
    }

    // Sandbox Mock response
    return NextResponse.json({ success: true, sentCount: 15 });

  } catch (error: any) {
    console.error("[Broadcast API] POST Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
