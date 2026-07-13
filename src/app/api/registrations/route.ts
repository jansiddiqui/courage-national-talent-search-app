/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";
import { verifySession } from "@/lib/sessionHelper";

const JWT_SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

export async function GET() {
  try {
    // Sandbox Check — bypass auth and return mock data if DB is not configured
    if (!hasSupabaseAdminConfig) {
      const mockRegistrations = [
        {
          id: "demo-1",
          registration_id: "CNTS26-8XK4P",
          cnts_id: "CNTS260001",
          student_name: "Aditya Verma",
          dob: "2013-05-14",
          student_class: "7",
          school_name: "Delhi Public School",
          school_city: "Kanpur",
          state: "Uttar Pradesh",
          district: "Kanpur Nagar",
          language: "English",
          parent_name: "Parent Name",
          mobile_number: "+919876543210",
          whatsapp_number: "+919876543210",
          parent_email: "parent@example.com",
          payment_status: "PAID",
          payment_id: "pay_mock_123456",
          registration_status: "REGISTERED",
          created_at: new Date().toISOString()
        }
      ];
      return NextResponse.json({ success: true, registrations: mockRegistrations });
    }

    if (!JWT_SECRET) {
      throw new Error("CRITICAL CONFIGURATION ERROR: SUPABASE_SERVICE_ROLE_KEY environment variable is required.");
    }
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("cnts_session");

    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const session = await verifySession(sessionCookie.value, JWT_SECRET);
    if (!session) {
      return NextResponse.json({ success: false, message: "Session expired or invalid" }, { status: 401 });
    }


    const isAdmin = session.role === "ADMIN" || session.role === "SUPER_ADMIN" || session.role === "VOLUNTEER";
    
    if (isAdmin) {
      const { is2FaFresh } = await import("@/lib/sessionHelper");
      if (!is2FaFresh(session)) {
        return NextResponse.json({ success: false, message: "Require Re-Auth" }, { status: 403 });
      }
    }

    let query = (supabaseAdmin as any).from("registrations").select("*");

    if (!isAdmin) {
      const filters = [];
      if (session.cntsId) {
        filters.push(`cnts_id.eq.${session.cntsId}`);
        filters.push(`registration_id.eq.${session.cntsId}`);
      }
      if (session.email) {
        filters.push(`parent_email.eq.${session.email}`);
      }
      if (session.phone) {
        filters.push(`mobile_number.eq.${session.phone}`);
        filters.push(`whatsapp_number.eq.${session.phone}`);
      }

      if (filters.length === 0) {
        return NextResponse.json({ success: true, registrations: [] });
      }

      query = query.or(filters.join(","));
    }

    const { data: registrations, error } = await query.order("created_at", { ascending: false });

    if (error) {
      console.error("[Registrations API] Fetch error:", error);
      return NextResponse.json({ success: false, message: "Failed to fetch registrations" }, { status: 500 });
    }

    return NextResponse.json({ success: true, registrations: registrations || [] });
  } catch (error: any) {
    console.error("Registrations endpoint error:", error);
    return NextResponse.json({ success: false, message: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { registrationId, updates } = await request.json();

    if (!registrationId || !updates) {
      return NextResponse.json({ success: false, message: "Missing required parameters: registrationId and updates" }, { status: 400 });
    }

    // Sandbox Check — bypass auth if DB is not configured
    if (!hasSupabaseAdminConfig) {
      return NextResponse.json({ success: true, message: "Draft updated successfully (Sandbox)" });
    }

    // Check if session is an admin
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("cnts_session");
    let isAdmin = false;

    if (sessionCookie && sessionCookie.value && JWT_SECRET) {
      const session = await verifySession(sessionCookie.value, JWT_SECRET);
      if (session) {
        isAdmin = session.role === "ADMIN" || session.role === "SUPER_ADMIN" || session.role === "VOLUNTEER";
      }
    }

    // Security check: If not admin, verify that this is a draft and unpaid registration
    if (!isAdmin) {
      const { data: currentReg, error: queryError } = await (supabaseAdmin as any)
        .from("registrations")
        .select("payment_status, registration_status")
        .eq("registration_id", registrationId)
        .maybeSingle();

      if (queryError || !currentReg) {
        return NextResponse.json({ success: false, message: "Registration not found or database query failed" }, { status: 404 });
      }

      if (currentReg.payment_status === "PAID" || currentReg.registration_status !== "DRAFT") {
        return NextResponse.json({ success: false, message: "Forbidden: Paid or finalized registrations cannot be edited." }, { status: 403 });
      }
    }

    // Clean up updates payload to prevent malicious columns injection if not admin
    const allowedColumns = [
      "student_name", "dob", "student_class", "school_name", "school_city", "school_code", "school_id",
      "parent_name", "mobile_number", "whatsapp_number", "parent_email", "state", "district",
      "language", "why_participating", "how_heard", "payment_id", "payment_status",
      "registration_status", "mobile_verified", "user_id", "registration_source"
    ];

    const recordToUpdate: any = {};
    Object.keys(updates).forEach(key => {
      if (allowedColumns.includes(key) || isAdmin) {
        recordToUpdate[key] = updates[key];
      }
    });

    const { error: updateError } = await (supabaseAdmin as any)
      .from("registrations")
      .update(recordToUpdate)
      .eq("registration_id", registrationId);

    if (updateError) {
      console.error("[Registrations PUT API] Update error:", updateError);
      return NextResponse.json({ success: false, message: "Failed to update database record" }, { status: 500 });
    }

    // Log status or payment events to registration_events
    if (recordToUpdate.registration_status || recordToUpdate.payment_status) {
      await (supabaseAdmin as any)
        .from("registration_events")
        .insert({
          registration_id: registrationId,
          event_type: recordToUpdate.registration_status || recordToUpdate.payment_status,
          metadata: {
            timestamp: new Date().toISOString(),
            payment_status: recordToUpdate.payment_status,
            registration_status: recordToUpdate.registration_status
          }
        });
    }

    return NextResponse.json({ success: true, message: "Registration updated successfully" });
  } catch (error: any) {
    console.error("Registrations PUT API error:", error);
    return NextResponse.json({ success: false, message: error.message || "Internal Server Error" }, { status: 500 });
  }
}

