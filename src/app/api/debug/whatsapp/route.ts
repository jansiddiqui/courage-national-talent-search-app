import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN ? "SET" : "MISSING",
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID ? "SET" : "MISSING",
    businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID ? "SET" : "MISSING",
    nodeEnv: process.env.NODE_ENV
  });
}
