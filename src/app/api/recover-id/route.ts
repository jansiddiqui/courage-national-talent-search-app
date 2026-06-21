/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";
import { whatsappService } from "@/services/whatsappService";
import { emailService } from "@/services/emailService";
import { isRateLimited } from "@/lib/rateLimiter";

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";
    const { limited } = await isRateLimited(ip, "recover-id", 5, 60);
    if (limited) {
      return NextResponse.json(
        { success: false, message: "Too many recovery attempts. Please try again later." },
        { status: 429 }
      );
    }

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
      if (
        searchInput === "918707884735" || 
        searchInput === "8707884735" || 
        searchInput === "parent@example.com" || 
        searchInput.toLowerCase() === "aditya@example.com"
      ) {
        // Mock send
        await whatsappService.sendForgotCNTSID(
          searchInput.includes("@") ? "9876543210" : searchInput,
          "Aditya Verma",
          "CNTS26-8XK4P"
        );
        if (searchInput.includes("@")) {
          await emailService.sendRecoveryEmail(searchInput, "CNTS26-8XK4P");
        } else {
          await emailService.sendRecoveryEmail("parent@example.com", "CNTS26-8XK4P");
        }
        return NextResponse.json({
          success: true,
          message: "Candidate credentials associated with this contact info have been dispatched to your registered WhatsApp and email."
        });
      }
      return NextResponse.json(
        { success: false, message: "No registrations found matching the provided mobile number or email in sandbox." },
        { status: 404 }
      );
    }

    // Query registrations where parent_email = searchInput OR mobile_number = searchInput OR whatsapp_number = searchInput
    const formats = [searchInput];
    const cleanPhone = searchInput.replace(/\D/g, "");
    if (cleanPhone.length === 10) {
      formats.push(`91${cleanPhone}`, `+91${cleanPhone}`);
    }

    const { data: matches, error } = await (supabaseAdmin as any)
      .from("registrations")
      .select("registration_id, cnts_id, student_name, student_class, payment_status, whatsapp_number, mobile_number, parent_email")
      .or(`parent_email.ilike.${searchInput},mobile_number.in.(${formats.map(f => `"${f}"`).join(",")}),whatsapp_number.in.(${formats.map(f => `"${f}"`).join(",")})`);

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

    let sentCount = 0;
    for (const match of matches) {
      const cntsId = match.cnts_id || match.registration_id;
      const recipient = match.whatsapp_number || match.mobile_number;
      if (recipient) {
        await whatsappService.sendForgotCNTSID(recipient, match.student_name, cntsId);
        sentCount++;
      }
      if (match.parent_email) {
        await emailService.sendRecoveryEmail(match.parent_email, cntsId);
        sentCount++;
      }
    }

    if (sentCount === 0) {
      return NextResponse.json(
        { success: false, message: "Could not find any contact channels to dispatch the credentials." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Candidate credentials associated with this contact info have been successfully dispatched to your registered WhatsApp and email."
    });
  } catch (error: any) {
    console.error("Recover ID endpoint error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
