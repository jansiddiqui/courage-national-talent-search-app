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
      couponCode,
      schoolCode
    } = await request.json();

    // Prevent ID Overwrite Race / Check if already PAID
    if (hasSupabaseAdminConfig && draftRegId) {
      const { data: existingReg, error: fetchError } = await (supabaseAdmin as any)
        .from("registrations")
        .select("payment_status, cnts_id")
        .eq("registration_id", draftRegId)
        .maybeSingle();

      if (fetchError) {
        console.error("Database query failed inside verify-signature:", fetchError);
      } else if (existingReg && (existingReg.payment_status === "PAID" || existingReg.cnts_id)) {
        console.log(`[verify-signature] Registration ${draftRegId} already paid. Prevented overwrite. CNTS ID: ${existingReg.cnts_id}`);
        return NextResponse.json({
          success: true,
          message: "Payment verified and registration finalized (idempotent bypass)",
          cntsId: existingReg.cnts_id,
          registrationId: draftRegId || existingReg.cnts_id
        });
      }
    }

    // Smart Duplicate Student Detection
    if (hasSupabaseAdminConfig && formData) {
      const { data: duplicate } = await (supabaseAdmin as any)
        .from("registrations")
        .select("registration_id, cnts_id")
        .eq("dob", formData.dob)
        .eq("student_class", formData.studentClass)
        .ilike("student_name", formData.studentName.trim())
        .in("payment_status", ["PAID", "SPONSORED"])
        .neq("registration_id", draftRegId || "")
        .maybeSingle();

      if (duplicate) {
        console.warn(`[verify-signature] Duplicate student detected for student: ${formData.studentName}`);
        return NextResponse.json({
          success: false,
          error: "A candidate with this name, date of birth, and class is already registered. If you wish to manage this registration, please return to the dashboard. If you believe this is an error, please contact support."
        }, { status: 400 });
      }
    }

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
      const cleanSchoolCode = schoolCode ? schoolCode.trim().toUpperCase() : null;
      const cleanCouponCode = couponCode ? couponCode.trim().toUpperCase() : null;

      if (!cleanCouponCode && !cleanSchoolCode) {
        return NextResponse.json({ success: false, error: "Coupon code or School code is required for free registration" }, { status: 400 });
      }

      if (cleanCouponCode) {
        let discountPercent = 0;

        if (!hasSupabaseAdminConfig) {
          if (cleanCouponCode === "FREE100") {
            discountPercent = 100;
          }
        } else {
          const { data: coupon, error } = await (supabaseAdmin as any)
            .from("coupons")
            .select("discount_percent, is_active")
            .eq("code", cleanCouponCode)
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
      } else if (cleanSchoolCode) {
        if (hasSupabaseAdminConfig) {
          const { data: school, error } = await (supabaseAdmin as any)
            .from("schools")
            .select("id, status, quota, used_quota")
            .eq("school_code", cleanSchoolCode)
            .maybeSingle();

          if (error || !school) {
            return NextResponse.json({ success: false, error: "Invalid school code. Please contact your coordinator." }, { status: 400 });
          }

          if (school.status !== "ACTIVE") {
            return NextResponse.json({ success: false, error: "School account is inactive. Please contact support." }, { status: 400 });
          }

          if (school.used_quota >= school.quota) {
            return NextResponse.json({ success: false, error: "School sponsorship quota limit exceeded." }, { status: 400 });
          }
        }
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

    const cleanSchoolCode = schoolCode ? schoolCode.trim().toUpperCase() : null;
    let schoolId: string | null = null;
    let schoolSponsorshipMode = "NONE";
    let schoolNotes = "";
    let schoolRebatePercent = 10;

    if (hasSupabaseAdminConfig && cleanSchoolCode) {
      const { data: school } = await (supabaseAdmin as any)
        .from("schools")
        .select("id, sponsorship_mode, notes, school_rebate_percent")
        .eq("school_code", cleanSchoolCode)
        .maybeSingle();
      if (school) {
        schoolId = school.id;
        schoolSponsorshipMode = school.sponsorship_mode || "NONE";
        schoolNotes = school.notes || "";
        schoolRebatePercent = school.school_rebate_percent !== undefined ? school.school_rebate_percent : 10;
      }
    }

    const recordPayload = {
      student_name: formData.studentName,
      dob: formData.dob,
      student_class: formData.studentClass,
      school_name: formData.schoolName,
      school_city: formData.schoolCity,
      school_code: cleanSchoolCode || formData.schoolCode || null,
      school_id: schoolId || null,
      parent_name: formData.parentName,
      mobile_number: formattedMobile,
      whatsapp_number: formattedWhatsapp,
      parent_email: formData.parentEmail || null,
      country: formData.country,
      state: formData.state,
      district: formData.district,
      language: formData.language,
      why_participating: formData.whyParticipating,
      how_heard: formData.howHeard,
      payment_id: razorpayPaymentId,
      payment_status: (cleanSchoolCode && schoolSponsorshipMode === "FULL") ? "SPONSORED" : "PAID",
      registration_status: "REGISTERED",
      mobile_verified: true,
      cnts_id: cntsId,
      coupon_code: couponCode || null,
      referral_code: formData.referral_code || null,
      photo_url: formData.photo_url || null
    };

    // 3. Database Write (Updates draft if available, otherwise inserts new)
    if (hasSupabaseAdminConfig) {
      if (cleanSchoolCode && schoolId && (schoolSponsorshipMode === "FULL" || schoolSponsorshipMode === "PARTIAL")) {
        // Atomic quota consumption and registration
        const { error: rpcError } = await (supabaseAdmin as any).rpc("consume_school_quota_and_register", {
          p_registration_id: draftRegId || `CNTS26-${Math.random().toString(36).substring(7).toUpperCase()}`,
          p_student_name: recordPayload.student_name,
          p_dob: recordPayload.dob,
          p_student_class: recordPayload.student_class,
          p_school_name: recordPayload.school_name,
          p_school_city: recordPayload.school_city,
          p_school_code: recordPayload.school_code,
          p_school_id: schoolId,
          p_parent_name: recordPayload.parent_name,
          p_mobile_number: recordPayload.mobile_number,
          p_whatsapp_number: recordPayload.whatsapp_number,
          p_parent_email: recordPayload.parent_email,
          p_state: recordPayload.state,
          p_district: recordPayload.district,
          p_language: recordPayload.language,
          p_why_participating: recordPayload.why_participating,
          p_how_heard: recordPayload.how_heard,
          p_payment_status: schoolSponsorshipMode === "FULL" ? "SPONSORED" : "PAID",
          p_registration_source: "SCHOOL"
        });

        if (rpcError) {
          console.error("Database RPC failed inside verify-signature:", rpcError);
          return NextResponse.json({ success: false, error: `Sponsorship registration failed: ${rpcError.message}` }, { status: 500 });
        }

        // Apply generated sequential CNTS ID to the newly registered student
        await (supabaseAdmin as any)
          .from("registrations")
          .update({ cnts_id: cntsId })
          .eq("registration_id", draftRegId || recordPayload.payment_id);

        // Record school rebate/commission in ledger if applicable
        if (schoolSponsorshipMode === "PARTIAL") {
          const rebatePercent = schoolRebatePercent;
          if (rebatePercent > 0) {
            const rebateAmount = Math.round(99 * rebatePercent / 100);
            const { error: ledgerError } = await (supabaseAdmin as any)
              .from("school_fee_ledger")
              .insert({
                school_id: schoolId,
                transaction_type: "SPONSORED_CREDIT",
                amount: rebateAmount,
                reference_id: draftRegId || recordPayload.payment_id || `reg_${cntsId}`,
                notes: `Rebate/Commission (${rebatePercent}%) for registration of ${recordPayload.student_name} (${cntsId})`
              });

            if (ledgerError) {
              console.error("Failed to insert rebate in ledger:", ledgerError);
            }
          }
        }
      } else {
        // Standard non-sponsored database write
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
        formData.studentName,
        cntsId,
        isFree ? "Free Registration" : razorpayPaymentId
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
