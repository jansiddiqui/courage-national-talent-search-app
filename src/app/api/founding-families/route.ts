import { NextResponse } from "next/server";
import { saveFoundingFamily } from "@/services/supabaseService";
import { whatsappService } from "@/services/whatsappService";

export async function POST(request: Request) {
  try {
    const { parentName, mobileNumber, parentEmail } = await request.json();

    if (!parentName || !mobileNumber || !parentEmail) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    // Save to database
    const dbResult = await saveFoundingFamily({
      parentName,
      mobileNumber,
      parentEmail,
    });

    if (!dbResult.success) {
      return NextResponse.json(
        { success: false, error: "Failed to register" },
        { status: 500 }
      );
    }

    // Dispatch Simulated/Meta WhatsApp Confirmation
    try {
      await whatsappService.sendFoundingFamilyWelcome(
        mobileNumber,
        parentName,
        dbResult.familyId
      );
    } catch (wsErr) {
      console.error("[API founding-families] WhatsApp dispatch failed:", wsErr);
    }

    return NextResponse.json({
      success: true,
      familyId: dbResult.familyId,
    });
  } catch (err: any) {
    console.error("[API founding-families] Handler error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
