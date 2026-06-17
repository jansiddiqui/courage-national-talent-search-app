/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";

export async function POST(request: Request) {
  try {
    const { contactInfo } = await request.json();

    if (!contactInfo || !contactInfo.trim()) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid email address or mobile number." },
        { status: 400 }
      );
    }

    const searchInput = contactInfo.trim();
    
    // Fallback response for dev/sandbox mode if supabaseAdmin is not configured
    if (!hasSupabaseAdminConfig) {
      // Mock data matching standard sandbox credentials
      if (
        searchInput === "918707884735" || 
        searchInput === "8707884735" || 
        searchInput === "parent@example.com" || 
        searchInput.toLowerCase() === "aditya@example.com"
      ) {
        return NextResponse.json({
          success: true,
          candidates: [
            {
              registration_id: "CNTS26-8XK4P",
              cnts_id: "CNTS-26-8XK4P",
              student_name: "Aditya Verma",
              student_class: "7",
              payment_status: "PAID"
            }
          ]
        });
      }
      return NextResponse.json(
        { success: false, message: "No candidates found matching the provided mobile number or email. Please verify details and try again." },
        { status: 404 }
      );
    }

    // Query registrations where parent_email = searchInput OR mobile_number = searchInput OR whatsapp_number = searchInput
    const { data: matches, error } = await (supabaseAdmin as any)
      .from("registrations")
      .select("registration_id, cnts_id, student_name, student_class, payment_status")
      .or(`parent_email.ilike.${searchInput},mobile_number.eq.${searchInput},whatsapp_number.eq.${searchInput}`);

    if (error) {
      console.error("[Recover ID API] Query error:", error);
      return NextResponse.json(
        { success: false, message: "Database query failed. Please contact administrator." },
        { status: 500 }
      );
    }

    if (!matches || matches.length === 0) {
      return NextResponse.json(
        { success: false, message: "No candidate registration found with this mobile number or email." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      candidates: matches
    });
  } catch (error: any) {
    console.error("Recover ID endpoint error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
