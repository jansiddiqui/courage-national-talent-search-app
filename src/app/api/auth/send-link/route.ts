/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";
import { signSession } from "@/lib/sessionHelper";
import { emailService } from "@/services/emailService";

const JWT_SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

export async function POST(request: Request) {
  try {
    if (!JWT_SECRET) {
      throw new Error("CRITICAL CONFIGURATION ERROR: SUPABASE_SERVICE_ROLE_KEY environment variable is required.");
    }
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ success: false, message: "Email address is required." }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    let registration = null;
    let adminUser = null;

    // Sandbox check
    if (!hasSupabaseAdminConfig) {
      // Allow parent@example.com or admin@example.com for mock logins
      if (cleanEmail === "parent@example.com" || cleanEmail === "admin@example.com") {
        registration = { cnts_id: "CNTS260001", parent_email: cleanEmail, mobile_number: "+919876543210" };
        if (cleanEmail === "admin@example.com") {
          adminUser = { role: "SUPER_ADMIN" };
        }
      } else {
        return NextResponse.json({ 
          success: false, 
          message: "Email not found. Use parent@example.com or admin@example.com for sandbox mode." 
        }, { status: 404 });
      }
    } else {
      // 1. Check registrations table
      const { data: regData, error: regError } = await (supabaseAdmin as any)
        .from("registrations")
        .select("cnts_id, registration_id, parent_email, mobile_number")
        .eq("parent_email", cleanEmail)
        .limit(1)
        .maybeSingle();

      if (regError) {
        console.error("Registrations query error:", regError);
      }
      registration = regData;

      const { data: admData, error: admError } = await (supabaseAdmin as any)
        .from("admin_users")
        .select("id, role")
        .eq("email", cleanEmail)
        .maybeSingle();

      if (admError) {
        console.error("Admin query error:", admError);
      }
      adminUser = admData;

      // If not in either, fail
      if (!registration && !adminUser) {
        return NextResponse.json({ 
          success: false, 
          message: "Email address not found in registrations." 
        }, { status: 404 });
      }
    }

    // 3. Generate token (expires in 15 mins)
    const payload = {
      id: adminUser?.id || undefined,   // Admin UUID — required for RBAC permission checks
      email: cleanEmail,
      cntsId: registration?.cnts_id || registration?.registration_id || "ADMIN",
      phone: registration?.mobile_number || "",
      role: adminUser?.role || "PARENT",
      exp: Date.now() + 15 * 60 * 1000 // 15 minutes
    };

    const token = await signSession(payload, JWT_SECRET);
    
    // 4. Construct verification URL
    const origin = request.headers.get("origin") || "http://localhost:3000";
    const link = `${origin}/api/auth/verify-link?token=${token}`;

    // 5. Send via Brevo SMTP API using EmailService
    const subject = "CNTS Dashboard Login";
    const htmlContent = `
      <div style="font-family:sans-serif;max-width:500px;margin:auto;padding:20px;border:1px solid #e2e8f0;border-radius:12px;">
        <h2 style="color:#0f172a;margin-bottom:6px;">CNTS Login Request</h2>
        <p style="color:#475569;font-size:14px;line-height:1.5;">Click the button below to securely access your Courage National Talent Search dashboard.</p>
        <div style="margin:24px 0;">
          <a href="${link}" style="display:inline-block;background-color:#1e293b;color:#ffffff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:14px;">Secure Login Button</a>
        </div>
        <p style="color:#64748b;font-size:11px;line-height:1.5;">If you did not request this login link, you can safely ignore this email. This link expires in 15 minutes.</p>
      </div>
    `;

    const emailRes = await emailService.sendEmail(cleanEmail, subject, htmlContent);

    if (!emailRes.success) {
      return NextResponse.json({ success: false, message: emailRes.error || "Failed to send login email. Please try again." }, { status: 500 });
    }

    if (emailService.isSandbox()) {
      // Print link to server terminal console for testing
      console.log(`\n=================================================`);
      console.log(`[MAGIC LINK SIGN-IN]`);
      console.log(`To: ${cleanEmail}`);
      console.log(`Link: ${link}`);
      console.log(`=================================================\n`);
      return NextResponse.json({
        success: true,
        message: `Magic link generated! Please check the server console logs to retrieve it.`
      });
    }

    return NextResponse.json({ success: true, message: "Login link sent! Please check your email inbox." });
  } catch (e: any) {
    console.error("Send-link route error:", e);
    return NextResponse.json({ success: false, message: e.message || "Internal Server Error" }, { status: 500 });
  }
}
