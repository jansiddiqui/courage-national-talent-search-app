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

    // Dispatch WhatsApp (non-blocking)
    whatsappService
      .sendFoundingFamilyWelcome(mobileNumber, parentName, dbResult.familyId)
      .then((ok) => {
        if (ok) console.log(`[founding-families] ✅ WhatsApp sent to ${mobileNumber}`);
        else    console.error(`[founding-families] ❌ WhatsApp FAILED for ${mobileNumber} — check template name & token`);
      })
      .catch((e) => console.error("[founding-families] WhatsApp exception:", e));

    // Dispatch Email (non-blocking)
    emailService
      .sendFoundingFamilyEmail(parentEmail, parentName, dbResult.familyId)
      .then((ok) => {
        if (ok) console.log(`[founding-families] ✅ Email sent to ${parentEmail}`);
        else    console.error(`[founding-families] ❌ Email FAILED for ${parentEmail} — check Brevo API key & sender domain`);
      })
      .catch((e) => console.error("[founding-families] Email exception:", e));

    return NextResponse.json({ success: true, familyId: dbResult.familyId });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    console.error("[API founding-families] Handler error:", err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
