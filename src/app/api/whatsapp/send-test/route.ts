/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { whatsappService } from "@/services/whatsappService";
import { verifySession } from "@/lib/sessionHelper";

const JWT_SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

export async function POST(request: Request) {
  try {
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

    const role = session.role;
    if (role !== "ADMIN" && role !== "SUPER_ADMIN" && role !== "VOLUNTEER") {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const { phoneNumber, testType } = await request.json();

    if (!phoneNumber || !testType) {
      return NextResponse.json({ success: false, message: "Phone number and test type are required" }, { status: 400 });
    }

    let success = false;
    
    switch (testType) {
      case "REGISTRATION":
        success = await whatsappService.sendRegistrationConfirmation(phoneNumber, "Demo Student", "Class 6", "CNTS26-DEMO5");
        break;
      case "PAYMENT":
        success = await whatsappService.sendPaymentConfirmation(phoneNumber, "CNTS26-DEMO5");
        break;
      case "RESULT":
        success = await whatsappService.sendResultNotification(phoneNumber, "Demo Student");
        break;
      case "TEST":
      default: {
        const textPayload = {
          type: "text",
          text: { body: "CNTS WhatsApp credentials connection check" }
        };
        const result = await whatsappService.sendMetaWhatsAppMessage(phoneNumber, textPayload);
        success = result.success;
        
        await whatsappService.logAttempt(
          phoneNumber,
          "TEST_CONNECTION",
          result.success ? (whatsappService.isSandbox() ? "SENT_SANDBOX" : "SENT") : "FAILED",
          result.messageId
        );
        break;
      }
    }

    return NextResponse.json({ success, message: success ? "Test message dispatched" : "Failed to dispatch message" });
  } catch (error: any) {
    console.error("Send test message endpoint error:", error);
    return NextResponse.json({ success: false, message: error.message || "Internal Server Error" }, { status: 500 });
  }
}
