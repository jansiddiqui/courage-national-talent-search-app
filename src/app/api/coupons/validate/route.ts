/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code")?.trim().toUpperCase();

    if (!code) {
      return NextResponse.json({ success: false, message: "Coupon code is required." }, { status: 400 });
    }

    // Sandbox check fallback
    if (!hasSupabaseAdminConfig) {
      if (code === "FOUNDER50") {
        return NextResponse.json({ success: true, discount: 50 });
      } else if (code === "SCHOOL25") {
        return NextResponse.json({ success: true, discount: 25 });
      } else if (code === "FREE100") {
        return NextResponse.json({ success: true, discount: 100 });
      }
      return NextResponse.json({ success: false, message: "Invalid coupon code. (Sandbox: use FOUNDER50, SCHOOL25 or FREE100)" }, { status: 404 });
    }

    const { data: coupon, error } = await (supabaseAdmin as any)
      .from("coupons")
      .select("discount_percent, is_active")
      .eq("code", code)
      .maybeSingle();

    if (error) {
      console.error("[Coupon Validate API] Database error:", error);
      return NextResponse.json({ success: false, message: "Failed to validate coupon" }, { status: 500 });
    }

    if (!coupon) {
      return NextResponse.json({ success: false, message: "Invalid coupon code." }, { status: 404 });
    }

    if (!coupon.is_active) {
      return NextResponse.json({ success: false, message: "This coupon code has expired or is inactive." }, { status: 410 });
    }

    return NextResponse.json({ success: true, discount: coupon.discount_percent });
  } catch (error: any) {
    console.error("Coupon validation error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
