/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";
import { NotificationService } from "@/services/NotificationService";

async function generateSequentialCNTSId(): Promise<string> {
  if (!hasSupabaseAdminConfig) {
    // Sandbox sequence: return a pseudo-sequential mock ID
    const count = Math.floor(Math.random() * 50) + 10;
    return `CNTS26${String(count).padStart(4, '0')}`;
  }

  try {
    // Count existing registrations that already have a non-null CNTS ID
    const { count, error } = await (supabaseAdmin as any)
      .from("registrations")
      .select("id", { count: "exact", head: true })
      .not("cnts_id", "is", null);

    if (error) {
      console.error("Error fetching registrations count:", error);
    }

    let nextIndex = (count || 0) + 1;
    
    // Safety check loop to guarantee uniqueness
    while (true) {
      const candidateId = `CNTS26${String(nextIndex).padStart(4, '0')}`;
      const { data } = await (supabaseAdmin as any)
        .from("registrations")
        .select("cnts_id")
        .eq("cnts_id", candidateId)
        .maybeSingle();

      if (!data) {
        return candidateId;
      }
      nextIndex++;
    }
  } catch (e) {
    console.error("Failed to generate sequential CNTS ID, fallback to random number:", e);
    return `CNTS26${String(Math.floor(1000 + Math.random() * 9000))}`;
  }
}

export async function POST(request: Request) {
  try {
    const { 
      razorpayOrderId, 
      razorpayPaymentId, 
      razorpaySignature, 
      draftRegId, 
      formData,
      couponCode
    } = await request.json();

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (process.env.NODE_ENV === "production") {
      if (!keyId || !keySecret) {
        throw new Error("Razorpay credentials missing");
      }
    }

    const isSandboxMode = !keyId || !keySecret;

    const isFree = razorpayOrderId?.startsWith("free_");

    // 1. Signature / Coupon Verification Check
    if (isFree) {
      if (!couponCode) {
        return NextResponse.json({ success: false, error: "Coupon code is required for free registration" }, { status: 400 });
      }

      const cleanCode = couponCode.trim().toUpperCase();
      let discountPercent = 0;

      if (!hasSupabaseAdminConfig) {
        if (cleanCode === "FREE100") {
          discountPercent = 100;
        }
      } else {
        const { data: coupon, error } = await (supabaseAdmin as any)
          .from("coupons")
          .select("discount_percent, is_active")
          .eq("code", cleanCode)
          .maybeSingle();

        if (error) {
          console.error("Database query for coupon failed inside verify-signature API:", error);
        } else if (coupon && coupon.is_active) {
          discountPercent = coupon.discount_percent;
        }
      }

      if (discountPercent !== 100) {
        return NextResponse.json({ success: false, error: "Invalid free registration transaction" }, { status: 400 });
      }
    } else if (isSandboxMode) {
      const isMock = razorpayOrderId?.startsWith("mock_order_") || razorpaySignature === "mock_signature_verified";
      if (!isMock) {
        return NextResponse.json({ success: false, error: "Invalid mock payment order ID" }, { status: 400 });
      }
    } else {
      if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
        return NextResponse.json({ success: false, error: "Missing required signature verification parameters" }, { status: 400 });
      }

      const text = `${razorpayOrderId}|${razorpayPaymentId}`;
      const generatedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(text)
        .digest("hex");

      if (generatedSignature !== razorpaySignature) {
        return NextResponse.json({ success: false, error: "Payment signature verification failed" }, { status: 400 });
      }
    }

    // 2. Generate permanent sequential CNTS ID
    const cntsId = await generateSequentialCNTSId();

    const cleanMobile = formData.mobile_number.replace(/\D/g, "").slice(-10);
    const cleanWhatsapp = formData.whatsapp_number.replace(/\D/g, "").slice(-10);
    const formattedMobile = `+91${cleanMobile}`;
    const formattedWhatsapp = `+91${cleanWhatsapp}`;

    const recordPayload = {
      student_name: formData.studentName,
      dob: formData.dob,
      student_class: formData.studentClass,
      school_name: formData.schoolName,
      school_city: formData.schoolCity,
      school_code: formData.schoolCode || null,
      parent_name: formData.parentName,
      mobile_number: formattedMobile,
      whatsapp_number: formattedWhatsapp,
      parent_email: formData.parentEmail || null,
      state: formData.state,
      district: formData.district,
      language: formData.language,
      why_participating: formData.whyParticipating,
      how_heard: formData.howHeard,
      payment_id: razorpayPaymentId,
      payment_status: "PAID",
      registration_status: "REGISTERED",
      mobile_verified: true,
      cnts_id: cntsId,
      coupon_code: couponCode || null,
      photo_url: formData.photo_url || null
    };

    // 3. Database Write (Updates draft if available, otherwise inserts new)
    if (hasSupabaseAdminConfig) {
      if (draftRegId) {
        const { error: updateError } = await (supabaseAdmin as any)
          .from("registrations")
          .update(recordPayload)
          .eq("registration_id", draftRegId);

        if (updateError) {
          console.error("Database update failed inside verify-signature:", updateError);
          return NextResponse.json({ success: false, error: `Database update failed: ${updateError.message}` }, { status: 500 });
        }
      } else {
        const randomRegId = `CNTS26-${Math.random().toString(36).substring(7).toUpperCase()}`;
        const { error: insertError } = await (supabaseAdmin as any)
          .from("registrations")
          .insert({
            registration_id: randomRegId,
            ...recordPayload
          });

        if (insertError) {
          console.error("Database insert failed inside verify-signature:", insertError);
          return NextResponse.json({ success: false, error: `Database insert failed: ${insertError.message}` }, { status: 500 });
        }
      }

      // Log milestone payment received event
      await (supabaseAdmin as any).from("registration_events").insert({
        registration_id: draftRegId || recordPayload.cnts_id,
        event_type: "REGISTERED",
        metadata: {
          timestamp: new Date().toISOString(),
          payment_id: razorpayPaymentId,
          payment_status: "PAID",
          cnts_id: cntsId
        }
      });
    } else {
      console.log(`[Sandbox Mode] Skipping database inserts. Generated CNTS ID: ${cntsId}`);
    }

    // 4. Trigger Unified Notifications
    try {
      // Notification 1: Registration Success (WhatsApp + Email if available)
      await NotificationService.sendRegistrationSuccess(
        formattedWhatsapp,
        formData.parentEmail || null,
        formData.studentName,
        formData.studentClass,
        cntsId
      );

      // Notification 2: Payment Success (WhatsApp + Email if available)
      await NotificationService.sendPaymentSuccess(
        formattedWhatsapp,
        formData.parentEmail || null,
        cntsId
      );
    } catch (notifyError) {
      console.error("Error sending post-payment notifications:", notifyError);
    }

    return NextResponse.json({
      success: true,
      message: isSandboxMode ? "Mock payment verified (Sandbox Mode)" : "Payment verified and registration finalized",
      cntsId: cntsId,
      registrationId: draftRegId || cntsId
    });
  } catch (error: any) {
    console.error("Verify signature route error:", error);
    return NextResponse.json({ success: false, error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
