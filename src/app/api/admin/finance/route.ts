/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";
import { verifySession } from "@/lib/sessionHelper";

const JWT_SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("cnts_session");

    if (hasSupabaseAdminConfig) {
      if (!sessionCookie || !sessionCookie.value || !JWT_SECRET) {
        return NextResponse.json({ success: false, message: "Authentication session required." }, { status: 401 });
      }

      const payload = await verifySession(sessionCookie.value, JWT_SECRET);
      if (!payload || payload.role !== "admin") {
        return NextResponse.json({ success: false, message: "Forbidden: Admin access required." }, { status: 403 });
      }

      // Fetch all ledger transactions
      const { data: ledger, error: ledgerErr } = await (supabaseAdmin as any)
        .from("school_fee_ledger")
        .select("*, schools(name)")
        .order("created_at", { ascending: false });

      if (ledgerErr) {
        console.error("[Finance API] Ledger fetch error:", ledgerErr);
        return NextResponse.json({ success: false, message: "Failed to query ledger logs" }, { status: 500 });
      }

      // Fetch registration payments
      const { data: regs, error: regsErr } = await (supabaseAdmin as any)
        .from("registrations")
        .select("id, registration_fee, payment_status, created_at")
        .eq("payment_status", "PAID");

      if (regsErr) {
        console.error("[Finance API] Registrations fetch error:", regsErr);
        return NextResponse.json({ success: false, message: "Failed to query registration logs" }, { status: 500 });
      }

      // Compute aggregates
      const grossRevenue = regs.reduce((sum: number, r: any) => sum + (Number(r.registration_fee) || 200.00), 0);
      const refundSum = ledger.filter((l: any) => l.transaction_type === "REFUND").reduce((sum: number, l: any) => sum + Math.abs(Number(l.amount)), 0);
      const netRevenue = grossRevenue - refundSum;

      return NextResponse.json({
        success: true,
        aggregates: {
          grossRevenue,
          netRevenue,
          refundSum,
          collectionCount: regs.length,
          avgRegValue: regs.length > 0 ? grossRevenue / regs.length : 0.00
        },
        transactions: ledger
      });
    }

    // Sandbox Mock response
    return NextResponse.json({
      success: true,
      aggregates: {
        grossRevenue: 85400.00,
        netRevenue: 84600.00,
        refundSum: 800.00,
        collectionCount: 427,
        avgRegValue: 200.00
      },
      transactions: [
        { id: "tx-1", transaction_type: "INVOICE", amount: 12000.00, outstanding_balance: 12000.00, reference_id: "inv-9871", created_at: new Date().toISOString(), schools: { name: "Greenwood High School" } },
        { id: "tx-2", transaction_type: "PAYMENT", amount: -12000.00, outstanding_balance: 0.00, reference_id: "pay_intent_9871", created_at: new Date().toISOString(), schools: { name: "Greenwood High School" } },
        { id: "tx-3", transaction_type: "REFUND", amount: 200.00, outstanding_balance: 200.00, reference_id: "ref_intent_4412", created_at: new Date().toISOString(), schools: { name: "Greenwood High School" } }
      ]
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("cnts_session");

    if (hasSupabaseAdminConfig) {
      if (!sessionCookie || !sessionCookie.value || !JWT_SECRET) {
        return NextResponse.json({ success: false, message: "Authentication session required." }, { status: 401 });
      }

      const payload = await verifySession(sessionCookie.value, JWT_SECRET);
      if (!payload || payload.role !== "admin") {
        return NextResponse.json({ success: false, message: "Forbidden: Admin access required." }, { status: 403 });
      }

      const body = await request.json();
      const { schoolId, transactionType, amount, referenceId } = body;

      if (!schoolId || !transactionType || !amount) {
        return NextResponse.json({ success: false, message: "Missing required transaction parameters" }, { status: 400 });
      }

      // Fetch previous ledger entry to compute outstanding balance
      const { data: previous } = await (supabaseAdmin as any)
        .from("school_fee_ledger")
        .select("outstanding_balance")
        .eq("school_id", schoolId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      const lastBalance = previous ? Number(previous.outstanding_balance) : 0.00;
      const netAmount = Number(amount);
      const newBalance = lastBalance + netAmount;

      const { data: inserted, error: insertErr } = await (supabaseAdmin as any)
        .from("school_fee_ledger")
        .insert({
          school_id: schoolId,
          transaction_type: transactionType,
          amount: netAmount,
          outstanding_balance: newBalance,
          reference_id: referenceId || null
        })
        .select()
        .maybeSingle();

      if (insertErr) {
        console.error("[Finance API] Ledger insert error:", insertErr);
        return NextResponse.json({ success: false, message: "Failed to write transaction entry" }, { status: 500 });
      }

      // Write action to audit trail
      await (supabaseAdmin as any).from("admin_operations_audit_trail").insert({
        actor_id: payload.cntsId || null,
        actor_role: "ADMIN",
        action: transactionType === "REFUND" ? "REFUND_APPROVED" : "CREATED_INVOICE",
        module: "FINANCE",
        previous_value: {},
        new_value: inserted || {},
        ip_address: request.headers.get("x-forwarded-for") || "unknown"
      });

      return NextResponse.json({ success: true, transaction: inserted });
    }

    // Sandbox Mock response
    return NextResponse.json({
      success: true,
      transaction: {
        id: "mock-tx-id",
        school_id: "mock-school-id",
        transaction_type: "PAYMENT",
        amount: -500.00,
        outstanding_balance: 0.00,
        reference_id: "mock-ref-id",
        created_at: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error("[Finance API] POST Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
