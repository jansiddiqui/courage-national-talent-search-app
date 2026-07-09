/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";
import { NotificationService } from "@/services/NotificationService";

export async function POST(request: Request) {
  try {
    const apiKey = request.headers.get("x-api-key");
    const secret = process.env.INTERNAL_API_SECRET || "courage-internal-secret-token";

    if (!apiKey || apiKey !== secret) {
      return NextResponse.json({ success: false, message: "Unauthorized access." }, { status: 401 });
    }

    if (!hasSupabaseAdminConfig) {
      return NextResponse.json({ success: true, message: "Sandbox mode: skipped processing." });
    }

    // Query active, unresolved support tickets
    const { data: tickets, error: ticketErr } = await (supabaseAdmin as any)
      .from("support_tickets")
      .select("*")
      .in("status", ["OPEN", "IN_PROGRESS"]);

    if (ticketErr) {
      console.error("[SLA Processor] Error reading active tickets:", ticketErr.message);
      return NextResponse.json({ success: false, message: "Error querying tickets." }, { status: 500 });
    }

    let processedCount = 0;
    let responseBreachCount = 0;
    let resolutionBreachCount = 0;
    let escalationsCreated = 0;
    let skippedCount = 0;

    const now = new Date();

    for (const ticket of (tickets || [])) {
      processedCount++;
      let updateNeeded = false;
      const updates: Record<string, any> = {};

      const firstResponseDue = ticket.first_response_due_at ? new Date(ticket.first_response_due_at) : null;
      const resolutionDue = ticket.resolution_due_at ? new Date(ticket.resolution_due_at) : null;

      // 1. First Response SLA Breach Check
      const responseBreached = !ticket.first_responded_at && firstResponseDue && now > firstResponseDue;
      if (responseBreached && ticket.sla_state !== "RESPONSE_BREACHED") {
        updates.sla_state = "RESPONSE_BREACHED";
        updateNeeded = true;
        responseBreachCount++;

        // Add Escalation Level
        if (ticket.escalation_level < 1) {
          updates.escalation_level = 1;
          
          // Insert escalation log entry safely
          const { error: escErr } = await (supabaseAdmin as any)
            .from("support_escalations")
            .upsert({
              ticket_id: ticket.id,
              escalation_level: 1,
              breach_type: "FIRST_RESPONSE",
              reason: "First response deadline crossed without agent reply."
            }, { onConflict: "ticket_id,breach_type,escalation_level" } as any);

          if (!escErr) {
            escalationsCreated++;
            
            // Dispatch internal escalation alert
            let recipientEmail = "operations@thecouragelibrary.com";
            if (ticket.assigned_to) {
              try {
                const { data: adminUser } = await (supabaseAdmin as any)
                  .from("admin_users")
                  .select("email")
                  .eq("id", ticket.assigned_to)
                  .single();
                if (adminUser?.email) {
                  recipientEmail = adminUser.email;
                }
              } catch (err) {
                // Fallback
              }
            }
            try {
              await NotificationService.sendSLAEscalated(
                recipientEmail,
                ticket.ticket_number,
                ticket.priority,
                "FIRST_RESPONSE",
                1,
                ticket.assigned_to || "Unassigned",
                ticket.first_response_due_at || "N/A"
              );
            } catch (err) {
              console.error("[SLA Processor] Failed to dispatch response breach alert:", err);
            }
          }
        }
      }

      // 2. Resolution SLA Breach Check
      const resolutionBreached = !ticket.resolved_at && resolutionDue && now > resolutionDue;
      if (resolutionBreached && ticket.sla_state !== "RESOLUTION_BREACHED") {
        updates.sla_state = "RESOLUTION_BREACHED";
        updateNeeded = true;
        resolutionBreachCount++;

        if (ticket.escalation_level < 2) {
          updates.escalation_level = 2;

          const { error: escErr } = await (supabaseAdmin as any)
            .from("support_escalations")
            .upsert({
              ticket_id: ticket.id,
              escalation_level: 2,
              breach_type: "RESOLUTION",
              reason: "Resolution deadline breached."
            }, { onConflict: "ticket_id,breach_type,escalation_level" } as any);

          if (!escErr) {
            escalationsCreated++;

            // Dispatch internal escalation alert
            let recipientEmail = "operations@thecouragelibrary.com";
            if (ticket.assigned_to) {
              try {
                const { data: adminUser } = await (supabaseAdmin as any)
                  .from("admin_users")
                  .select("email")
                  .eq("id", ticket.assigned_to)
                  .single();
                if (adminUser?.email) {
                  recipientEmail = adminUser.email;
                }
              } catch (err) {
                // Fallback
              }
            }
            try {
              await NotificationService.sendSLAEscalated(
                recipientEmail,
                ticket.ticket_number,
                ticket.priority,
                "RESOLUTION",
                2,
                ticket.assigned_to || "Unassigned",
                ticket.resolution_due_at || "N/A"
              );
            } catch (err) {
              console.error("[SLA Processor] Failed to dispatch resolution breach alert:", err);
            }
          }
        }
      }

      if (updateNeeded) {
        await (supabaseAdmin as any)
          .from("support_tickets")
          .update(updates)
          .eq("id", ticket.id);
      } else {
        skippedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      processed: processedCount,
      responseBreaches: responseBreachCount,
      resolutionBreaches: resolutionBreachCount,
      escalationsCreated,
      skipped: skippedCount
    }, {
      headers: {
        "Cache-Control": "private, no-store, no-cache, must-revalidate"
      }
    });

  } catch (error: any) {
    console.error("[SLA Processor] Failure:", error);
    return NextResponse.json({ success: false, message: "System error." }, { status: 500 });
  }
}
