/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";
import { signSession } from "@/lib/sessionHelper";

const JWT_SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

function normalizeDate(dobStr: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(dobStr)) return dobStr;
  
  const matchDmy = dobStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (matchDmy) {
    const [, day, month, year] = matchDmy;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  return dobStr;
}

async function handleLoginFailure(cntsId: string) {
  if (!hasSupabaseAdminConfig) return;
  
  try {
    const { data: lock } = await (supabaseAdmin as any)
      .from("otp_locks")
      .select("failed_attempts")
      .eq("phone_number", cntsId)
      .maybeSingle();

    const attempts = (lock?.failed_attempts || 0) + 1;

    if (attempts >= 5) {
      const lockedUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 mins
      await (supabaseAdmin as any)
        .from("otp_locks")
        .upsert({
          phone_number: cntsId,
          failed_attempts: attempts,
          locked_until: lockedUntil,
          updated_at: new Date().toISOString()
        }, { onConflict: "phone_number" });
    } else {
      await (supabaseAdmin as any)
        .from("otp_locks")
        .upsert({
          phone_number: cntsId,
          failed_attempts: attempts,
          updated_at: new Date().toISOString()
        }, { onConflict: "phone_number" });
    }
  } catch (e) {
    console.error("Lockout record update failed:", e);
  }
}

async function resetLoginLockout(cntsId: string) {
  if (!hasSupabaseAdminConfig) return;
  try {
    await (supabaseAdmin as any)
      .from("otp_locks")
      .delete()
      .eq("phone_number", cntsId);
  } catch (e) {
    console.error("Lockout reset failed:", e);
  }
}

export async function POST(request: Request) {
  try {
    if (!JWT_SECRET) {
      throw new Error("CRITICAL CONFIGURATION ERROR: SUPABASE_SERVICE_ROLE_KEY environment variable is required.");
    }
    const { cntsId, dob } = await request.json();

    if (!cntsId || !dob) {
      return NextResponse.json({ success: false, message: "CNTS ID and Date of Birth are required." }, { status: 400 });
    }

    const normalizedDob = normalizeDate(dob);

    // Sandbox check
    if (!hasSupabaseAdminConfig) {
      const upperId = cntsId.toUpperCase();
      const mockIds = ["CNTS260001", "CNTS26-DEMO5", "CNTS26-8XK4P"];
      
      if (mockIds.includes(upperId) && normalizedDob === "2013-05-14") {
        const payload = {
          cntsId: upperId,
          email: "parent@example.com",
          phone: "+919876543210",
          role: upperId === "CNTS260001" ? "PARENT" : "PARENT",
          exp: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
        };
        const token = await signSession(payload, JWT_SECRET);
        const response = NextResponse.json({ success: true, message: "Login successful (Sandbox)" });
        response.cookies.set("cnts_session", token, {
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          maxAge: 30 * 24 * 60 * 60 // 30 days
        });
        return response;
      }
      return NextResponse.json({ success: false, message: "Invalid CNTS ID or Date of Birth. Sandbox values: CNTS260001, DOB: 14/05/2013" }, { status: 401 });
    }

    // 1. Lockout Check
    const { data: lock } = await (supabaseAdmin as any)
      .from("otp_locks")
      .select("failed_attempts, locked_until")
      .eq("phone_number", cntsId)
      .maybeSingle();

    if (lock && lock.locked_until && new Date(lock.locked_until) > new Date()) {
      const remainingMinutes = Math.ceil((new Date(lock.locked_until).getTime() - Date.now()) / 60000);
      return NextResponse.json({ 
        success: false, 
        message: `Too many failed attempts. Locked out. Please retry after ${remainingMinutes} minutes.` 
      }, { status: 423 });
    }

    // 2. Fetch Registration
    const { data: registration, error: queryError } = await (supabaseAdmin as any)
      .from("registrations")
      .select("cnts_id, registration_id, dob, parent_email, mobile_number")
      .or(`cnts_id.eq.${cntsId},registration_id.eq.${cntsId}`)
      .maybeSingle();

    if (queryError || !registration) {
      await handleLoginFailure(cntsId);
      return NextResponse.json({ success: false, message: "Invalid CNTS ID or Date of Birth." }, { status: 401 });
    }

    // 3. Verify DOB
    if (registration.dob !== normalizedDob) {
      await handleLoginFailure(cntsId);
      return NextResponse.json({ success: false, message: "Invalid CNTS ID or Date of Birth." }, { status: 401 });
    }

    // 4. Success -> Reset lockout
    await resetLoginLockout(cntsId);

    // 5. Determine Role
    let role = "PARENT";
    const phone = registration.mobile_number || "";
    const email = registration.parent_email || "";

    const query = (supabaseAdmin as any).from("admin_users").select("role");
    const filters = [];
    if (phone) {
      filters.push(`phone_number.eq.${phone}`);
    }
    if (email) {
      filters.push(`email.eq.${email.toLowerCase()}`);
    }
    if (filters.length > 0) {
      const { data: adminUser } = await query.or(filters.join(",")).maybeSingle();
      if (adminUser) {
        role = adminUser.role;
      }
    }

    const payload = {
      cntsId: registration.cnts_id || registration.registration_id,
      email,
      phone,
      role,
      exp: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
    };

    const token = await signSession(payload, JWT_SECRET);

    const response = NextResponse.json({ success: true, message: "Login successful." });
    response.cookies.set("cnts_session", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 // 30 days
    });
    return response;
  } catch (e: any) {
    console.error("Login route error:", e);
    return NextResponse.json({ success: false, message: e.message || "Internal Server Error" }, { status: 500 });
  }
}
