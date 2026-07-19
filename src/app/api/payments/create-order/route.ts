/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { couponCode, email, schoolCode, draftRegId } = await request.json();
    let finalAmount = 99; // Default price: ₹99

    const { supabaseAdmin, hasSupabaseAdminConfig } = await import("@/lib/supabaseAdmin");

    // Prevent Admin/SuperAdmin from registering
    if (hasSupabaseAdminConfig && email) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: adminCheck } = await (supabaseAdmin as any)
        .from("admin_users")
        .select("email")
        .eq("email", email)
        .maybeSingle();
      
      if (adminCheck) {
        return NextResponse.json(
          { success: false, error: "Administrators cannot register as candidates." },
          { status: 403 }
        );
      }
    }

    // Smart Duplicate Student Detection
    if (hasSupabaseAdminConfig && draftRegId) {
      const { data: draftReg, error: draftError } = await (supabaseAdmin as any)
        .from("registrations")
        .select("student_name, dob, student_class")
        .eq("registration_id", draftRegId)
        .maybeSingle();

      if (draftError) {
        console.error("Database query for draft registration failed in create-order:", draftError);
      } else if (draftReg) {
        const { data: duplicate, error: dupError } = await (supabaseAdmin as any)
          .from("registrations")
          .select("registration_id")
          .eq("dob", draftReg.dob)
          .eq("student_class", draftReg.student_class)
          .ilike("student_name", draftReg.student_name.trim())
          .in("payment_status", ["PAID", "SPONSORED"])
          .neq("registration_id", draftRegId)
          .maybeSingle();

        if (dupError) {
          console.error("Database query for duplicate verification failed in create-order:", dupError);
        } else if (duplicate) {
          return NextResponse.json(
            { success: false, error: "A candidate with this name, date of birth, and class is already registered. If you wish to manage this registration, please return to the dashboard. If you believe this is an error, please contact support." },
            { status: 400 }
          );
        }
      }
    }

    if (couponCode) {
      const cleanCode = couponCode.trim().toUpperCase();
      let discountPercent = 0;

      if (!hasSupabaseAdminConfig) {
        // Sandbox fallback for local developer testing
        if (cleanCode === "FOUNDER50") {
          discountPercent = 50;
        } else if (cleanCode === "SCHOOL25") {
          discountPercent = 25;
        } else if (cleanCode === "FREE100") {
          discountPercent = 100;
        }
      } else {
        // Production check: Query coupons table
        const { data: coupon, error } = await (supabaseAdmin as any)
          .from("coupons")
          .select("discount_percent, is_active")
          .eq("code", cleanCode)
          .maybeSingle();

        if (error) {
          console.error("Database query for coupon failed inside create-order API:", error);
        } else if (coupon && coupon.is_active) {
          discountPercent = coupon.discount_percent;
        }
      }

      if (discountPercent > 0) {
        // Calculate discounted amount
        finalAmount = Math.max(0, Math.round(99 * (1 - discountPercent / 100)));
      }
    }

    if (schoolCode && finalAmount > 0) {
      const cleanSchoolCode = schoolCode.trim().toUpperCase();
      if (!hasSupabaseAdminConfig) {
         if (cleanSchoolCode === "DEMO-123") {
           finalAmount = 0;
         } else if (cleanSchoolCode === "DEMO-PARTIAL") {
           finalAmount = Math.max(0, Math.round(finalAmount * 0.8));
         }
      } else {
         const { data: school, error } = await (supabaseAdmin as any)
          .from("schools")
          .select("sponsorship_mode, quota, used_quota, status, student_discount_percent")
          .eq("school_code", cleanSchoolCode)
          .eq("status", "ACTIVE")
          .maybeSingle();
        
        if (school && (school.quota - school.used_quota > 0)) {
          if (school.sponsorship_mode === "FULL") {
            finalAmount = 0;
          } else if (school.sponsorship_mode === "PARTIAL") {
            const discountPercent = school.student_discount_percent !== undefined ? school.student_discount_percent : 20;
            finalAmount = Math.max(0, Math.round(finalAmount * (1 - discountPercent / 100)));
          }
        }
      }
    }

    // Zero-payment checkout bypass
    if (finalAmount === 0) {
      return NextResponse.json({
        success: true,
        orderId: `free_${Math.random().toString(36).substring(7)}`,
        amount: 0,
        currency: "INR",
        keyId: "",
        isSandbox: false,
        isFree: true
      });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (process.env.NODE_ENV === "production") {
      if (!keyId || !keySecret) {
        throw new Error("Razorpay credentials missing");
      }
    }

    // If API credentials are not set, fallback to Sandbox mode for development
    if (!keyId || !keySecret) {
      return NextResponse.json({
        success: true,
        orderId: `mock_order_${Math.random().toString(36).substring(7)}`,
        amount: finalAmount * 100,
        currency: "INR",
        keyId: "mock_key_id",
        isSandbox: true
      });
    }

    // Connect securely to Razorpay endpoint via fetch
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount: finalAmount * 100, // amount in paise
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        notes: {
          draftRegId: draftRegId || ""
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Razorpay order creation failed:", errorText);
      return NextResponse.json(
        { success: false, error: "Failed to create payment order" },
        { status: 500 }
      );
    }

    const order = await response.json();
    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
      isSandbox: false
    });
  } catch (error) {
    console.error("Payment order endpoint error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
