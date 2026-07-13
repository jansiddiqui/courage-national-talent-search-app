/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";
import { verifySession } from "@/lib/sessionHelper";
import { createApprovalRequest } from "@/domains/admin/ApprovalRequestService";
import { isLargeRefund } from "@/domains/admin/AdminFinanceService";
import { checkAdminPermission } from "@/domains/admin/AdminAuthService";
import { writeAuditEntry } from "@/domains/admin/AdminAuditService";

const JWT_SECRET = process.env.JWT_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("cnts_session");

    if (!sessionCookie || !sessionCookie.value || !JWT_SECRET) {
      return NextResponse.json({ success: false, message: "Authentication session required." }, { status: 401 });
    }

    const payload = await verifySession(sessionCookie.value, JWT_SECRET);
    if (!payload || !payload.id) {
      return NextResponse.json({ success: false, message: "Forbidden: Admin session required." }, { status: 403 });
    }

    const hasPerm = await checkAdminPermission(supabaseAdmin, payload.id, "finance.view");
    if (!hasPerm) {
      return NextResponse.json({ success: false, message: "Forbidden: finance.view permission required." }, { status: 403 });
    }

    if (hasSupabaseAdminConfig) {
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

    if (!sessionCookie || !sessionCookie.value || !JWT_SECRET) {
      return NextResponse.json({ success: false, message: "Authentication session required." }, { status: 401 });
    }

    const payload = await verifySession(sessionCookie.value, JWT_SECRET);
    if (!payload || !payload.id) {
      return NextResponse.json({ success: false, message: "Forbidden: Admin session required." }, { status: 403 });
    }

    const hasPerm = await checkAdminPermission(supabaseAdmin, payload.id, "refund.large");
    if (!hasPerm) {
      return NextResponse.json({ success: false, message: "Forbidden: refund.large permission required." }, { status: 403 });
    }

    if (hasSupabaseAdminConfig) {
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

      // Maker-checker check: Large refunds (> ₹10,000) require approval
      if (transactionType === "REFUND" && isLargeRefund(Math.abs(netAmount))) {
        const { id: approvalId, idempotencyKey } = await createApprovalRequest(supabaseAdmin, {
          requesterId: payload.id as string,
          actionType: "REFUND_LARGE",
          targetResourceType: "SCHOOL_LEDGER",
          targetResourceId: schoolId,
          payload: { schoolId, transactionType, amount: netAmount, referenceId },
          reason: `Large refund request of ₹${Math.abs(netAmount)}`,
          requiredPermission: "refund.large"
        });
        return NextResponse.json({
          success: true,
          approvalRequired: true,
          message: `Refund of ₹${Math.abs(netAmount)} exceeds limit. Staged in approval request.`,
          approvalId,
          idempotencyKey
        });
      }

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

      // Write action to audit trail using writeAuditEntry
      await writeAuditEntry(supabaseAdmin, {
        actorId: payload.id,
        actorRole: payload.role || "admin",
        action: transactionType === "REFUND" ? "REFUND_APPROVED" : "CREATED_INVOICE",
        module: "FINANCE",
        previousValue: {},
        newValue: inserted || {},
        ipAddress: request.headers.get("x-forwarded-for") || "unknown"
      });

      return NextResponse.json({ success: true, transaction: inserted });
    }

    // Sandbox Mock response
    return NextResponse.json({
      success: true,
      transaction: {
        id: "mock-tx-id",
        school_id: "sandbox-school",
        transaction_type: "CREDIT",
        amount: 0,
        outstanding_balance: 0.00,
        reference_id: null,
        created_at: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error("[Finance API] POST Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
