import { NextResponse } from "next/server";
import { saveFoundingFamily, checkFoundingFamilyDuplicate } from "@/services/supabaseService";
import { whatsappService } from "@/services/whatsappService";
import { emailService } from "@/services/emailService";

export async function POST(request: Request) {
  try {
    const { parentName, mobileNumber, parentEmail } = await request.json();

    if (!parentName || !mobileNumber || !parentEmail) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    // Check for duplicate mobile/email before inserting
    const duplicate = await checkFoundingFamilyDuplicate(mobileNumber, parentEmail);
    if (duplicate.exists) {
      return NextResponse.json(
        { success: false, error: duplicate.message, isDuplicate: true },
        { status: 409 }
      );
    }

    // Save to database
    const dbResult = await saveFoundingFamily({ parentName, mobileNumber, parentEmail });

    if (!dbResult.success) {
      return NextResponse.json(
        { success: false, error: dbResult.error ?? "Failed to register. Please try again." },
        { status: 500 }
      );
    }

    // Dispatch WhatsApp (non-blocking — never fail the request)
    whatsappService
      .sendFoundingFamilyWelcome(mobileNumber, parentName, dbResult.familyId)
      .catch((e) => console.error("[founding-families] WhatsApp failed:", e));

    // Dispatch Email (non-blocking — never fail the request)
    emailService
      .sendFoundingFamilyEmail(parentEmail, parentName, dbResult.familyId)
      .catch((e) => console.error("[founding-families] Email failed:", e));

    return NextResponse.json({ success: true, familyId: dbResult.familyId });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    console.error("[API founding-families] Handler error:", err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
