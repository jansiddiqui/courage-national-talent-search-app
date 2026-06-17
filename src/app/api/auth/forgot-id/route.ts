/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";
import { whatsappService } from "@/services/whatsappService";

export async function POST(request: Request) {
  try {
    const { phoneNumber } = await request.json();

    if (!phoneNumber) {
      return NextResponse.json({ success: false, message: "Mobile/WhatsApp number is required." }, { status: 400 });
    }

    const cleanPhone = phoneNumber.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      return NextResponse.json({ success: false, message: "Please enter a valid phone number." }, { status: 400 });
    }

    const last10 = cleanPhone.slice(-10);

    // Sandbox Check
    if (!hasSupabaseAdminConfig) {
      if (last10 === "9876543210" || last10 === "8707884735") {
        const studentName = last10 === "8707884735" ? "Super Admin" : "Aditya Verma";
        const cntsId = last10 === "8707884735" ? "CNTS260000" : "CNTS260001";
        
        await whatsappService.sendForgotCNTSID(phoneNumber, studentName, cntsId);
        return NextResponse.json({ 
          success: true, 
          message: `CNTS ID sent via WhatsApp to ${phoneNumber} (Sandbox mode: check console logs)` 
        });
      }
      return NextResponse.json({ 
        success: false, 
        message: "Phone number not found in registrations. Try 9876543210 in sandbox mode." 
      }, { status: 404 });
    }

    // Search registrations table
    // Querying registrations checking formats with and without +91 country prefix
    const formats = [last10, `91${last10}`, `+91${last10}`];
    
    // We construct the query
    const { data: registrations, error: queryError } = await (supabaseAdmin as any)
      .from("registrations")
      .select("cnts_id, registration_id, student_name, mobile_number, whatsapp_number")
      .or(`mobile_number.in.(${formats.map(f => `"${f}"`).join(",")}),whatsapp_number.in.(${formats.map(f => `"${f}"`).join(",")})`)
      .order("created_at", { ascending: false });

    if (queryError) {
      console.error("Forgot-id query error:", queryError);
      return NextResponse.json({ success: false, message: "Database query error. Please retry." }, { status: 500 });
    }

    if (!registrations || registrations.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: "No registration found associated with this mobile/WhatsApp number." 
      }, { status: 404 });
    }

    // Take the most recent registration to recover
    const match = registrations[0];
    const cntsId = match.cnts_id || match.registration_id;
    const recipient = match.whatsapp_number || match.mobile_number || phoneNumber;

    const success = await whatsappService.sendForgotCNTSID(recipient, match.student_name, cntsId);

    if (!success) {
      return NextResponse.json({ 
        success: false, 
        message: "Failed to dispatch recovery message over WhatsApp. Please try again." 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Your CNTS ID has been successfully dispatched to WhatsApp number ${recipient}.` 
    });
  } catch (e: any) {
    console.error("Forgot-id recovery route error:", e);
    return NextResponse.json({ success: false, message: e.message || "Internal Server Error" }, { status: 500 });
  }
}
