/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";
import { verifySession } from "@/lib/sessionHelper";

const JWT_SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

// Mock coupons for sandbox mode
let MOCK_COUPONS = [
  { id: "mock-c1", code: "FOUNDER50", discount_percent: 50, is_active: true, created_at: new Date().toISOString() },
  { id: "mock-c2", code: "SCHOOL25", discount_percent: 25, is_active: true, created_at: new Date().toISOString() }
];

async function checkAdminSession() {
  if (!JWT_SECRET) {
    throw new Error("CRITICAL CONFIGURATION ERROR: SUPABASE_SERVICE_ROLE_KEY environment variable is required.");
  }
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("cnts_session");

  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  const session = await verifySession(sessionCookie.value, JWT_SECRET);
  if (!session) {
    return null;
  }

  const role = session.role;
  if (role !== "ADMIN" && role !== "SUPER_ADMIN" && role !== "VOLUNTEER") {
    return null;
  }

  return session;
}

export async function GET() {
  try {
    const admin = await checkAdminSession();
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    if (!hasSupabaseAdminConfig) {
      return NextResponse.json({ success: true, coupons: MOCK_COUPONS });
    }

    const { data: coupons, error } = await (supabaseAdmin as any)
      .from("coupons")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[Coupons GET API] Database error:", error);
      return NextResponse.json({ success: false, message: "Failed to fetch coupons" }, { status: 500 });
    }

    return NextResponse.json({ success: true, coupons: coupons || [] });
  } catch (error: any) {
    console.error("Coupons GET API error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await checkAdminSession();
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { code, discountPercent } = await request.json();

    if (!code || discountPercent === undefined || discountPercent < 0 || discountPercent > 100) {
      return NextResponse.json({ success: false, message: "Invalid parameters. Code and discount percent (0-100) are required." }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase();

    if (!hasSupabaseAdminConfig) {
      // Check if already exists in sandbox memory
      if (MOCK_COUPONS.some(c => c.code === cleanCode)) {
        return NextResponse.json({ success: false, message: "Coupon code already exists." }, { status: 409 });
      }

      const newMock = {
        id: `mock-c-${Date.now()}`,
        code: cleanCode,
        discount_percent: discountPercent,
        is_active: true,
        created_at: new Date().toISOString()
      };
      MOCK_COUPONS = [newMock, ...MOCK_COUPONS];
      return NextResponse.json({ success: true, message: "Coupon created (Sandbox Mode)", coupon: newMock });
    }

    const { data: newCoupon, error } = await (supabaseAdmin as any)
      .from("coupons")
      .insert({
        code: cleanCode,
        discount_percent: discountPercent,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      console.error("[Coupons POST API] Database error:", error);
      if (error.code === "23505") { // Unique key violation
        return NextResponse.json({ success: false, message: "Coupon code already exists." }, { status: 409 });
      }
      return NextResponse.json({ success: false, message: `Failed to create coupon: ${error.message}` }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Coupon created successfully", coupon: newCoupon });
  } catch (error: any) {
    console.error("Coupons POST API error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const admin = await checkAdminSession();
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id, is_active } = await request.json();

    if (!id || is_active === undefined) {
      return NextResponse.json({ success: false, message: "Coupon ID and active status are required." }, { status: 400 });
    }

    if (!hasSupabaseAdminConfig) {
      const index = MOCK_COUPONS.findIndex(c => c.id === id);
      if (index === -1) {
        return NextResponse.json({ success: false, message: "Coupon not found" }, { status: 404 });
      }
      MOCK_COUPONS[index].is_active = is_active;
      return NextResponse.json({ success: true, message: "Coupon toggled (Sandbox Mode)", coupon: MOCK_COUPONS[index] });
    }

    const { data: updatedCoupon, error } = await (supabaseAdmin as any)
      .from("coupons")
      .update({ is_active })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[Coupons PATCH API] Database error:", error);
      return NextResponse.json({ success: false, message: "Failed to update coupon status" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Coupon status updated successfully", coupon: updatedCoupon });
  } catch (error: any) {
    console.error("Coupons PATCH API error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const admin = await checkAdminSession();
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "Coupon ID is required." }, { status: 400 });
    }

    if (!hasSupabaseAdminConfig) {
      MOCK_COUPONS = MOCK_COUPONS.filter(c => c.id !== id);
      return NextResponse.json({ success: true, message: "Coupon deleted (Sandbox Mode)" });
    }

    const { error } = await (supabaseAdmin as any)
      .from("coupons")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("[Coupons DELETE API] Database error:", error);
      return NextResponse.json({ success: false, message: "Failed to delete coupon" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Coupon deleted successfully" });
  } catch (error: any) {
    console.error("Coupons DELETE API error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
