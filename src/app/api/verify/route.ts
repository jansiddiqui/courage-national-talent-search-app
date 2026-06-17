/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const registrationId = searchParams.get("registrationId") || searchParams.get("regId");
    const dob = searchParams.get("dob");

    if (!registrationId || !dob) {
      return NextResponse.json(
        { success: false, message: "Missing registrationId or dob parameters" },
        { status: 400 }
      );
    }

    const normalizedId = registrationId.trim().toUpperCase();

    if (!hasSupabaseAdminConfig) {
      if ((normalizedId === "CNTS26-8XK4P" || normalizedId === "CNTS-26-8XK4P") && dob === "2013-05-14") {
        return NextResponse.json({
          success: true,
          match: {
            registration_id: normalizedId,
            student_name: "Aditya Verma",
            student_class: "7",
            school_name: "Delhi Public School",
            school_city: "Kanpur",
            state: "Uttar Pradesh",
            district: "Kanpur Nagar",
            payment_status: "PAID",
            created_at: new Date().toISOString()
          }
        });
      }
      return NextResponse.json(
        { success: false, message: "No active credentials found for the provided Registration ID and DOB combo." },
        { status: 404 }
      );
    }

    const { data: match, error } = await (supabaseAdmin as any)
      .from("registrations")
      .select("registration_id, student_name, student_class, school_name, school_city, state, district, payment_status, created_at")
      .or(`registration_id.eq.${normalizedId},cnts_id.eq.${normalizedId}`)
      .eq("dob", dob)
      .maybeSingle();

    if (error) {
      console.error("[Verify API] Query error:", error);
      return NextResponse.json(
        { success: false, message: "Database query failed" },
        { status: 500 }
      );
    }

    if (!match) {
      return NextResponse.json(
        { success: false, message: "No active credentials found for the provided Registration ID and DOB combo." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      match
    });
  } catch (error: any) {
    console.error("Verification endpoint error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { registrationId, dob } = await request.json();

    if (!registrationId || !dob) {
      return NextResponse.json(
        { success: false, message: "Missing registrationId or dob parameters" },
        { status: 400 }
      );
    }

    const normalizedId = registrationId.trim().toUpperCase();

    // Sandbox/Mock response check if Supabase admin is not configured
    if (!hasSupabaseAdminConfig) {
      if ((normalizedId === "CNTS26-8XK4P" || normalizedId === "CNTS-26-8XK4P") && dob === "2013-05-14") {
        return NextResponse.json({
          success: true,
          match: {
            registration_id: normalizedId,
            student_name: "Aditya Verma",
            student_class: "7",
            school_name: "Delhi Public School",
            school_city: "Kanpur",
            state: "Uttar Pradesh",
            district: "Kanpur Nagar",
            payment_status: "PAID",
            created_at: new Date().toISOString()
          }
        });
      }
      return NextResponse.json(
        { success: false, message: "No active credentials found for the provided Registration ID and DOB combo." },
        { status: 404 }
      );
    }

    // Query DB for matching record, only select safe public fields to avoid PII leak
    const { data: match, error } = await (supabaseAdmin as any)
      .from("registrations")
      .select("registration_id, student_name, student_class, school_name, school_city, state, district, payment_status, created_at")
      .or(`registration_id.eq.${normalizedId},cnts_id.eq.${normalizedId}`)
      .eq("dob", dob)
      .maybeSingle();

    if (error) {
      console.error("[Verify API] Query error:", error);
      return NextResponse.json(
        { success: false, message: "Database query failed" },
        { status: 500 }
      );
    }

    if (!match) {
      return NextResponse.json(
        { success: false, message: "No active credentials found for the provided Registration ID and DOB combo." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      match
    });
  } catch (error: any) {
    console.error("Verification endpoint error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
