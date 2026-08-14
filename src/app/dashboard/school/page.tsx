import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";
import SchoolDashboardClient from "./SchoolDashboardClient";

const JWT_SECRET = new TextEncoder().encode(process.env.SUPABASE_SERVICE_ROLE_KEY || "fallback_secret_key");

export default async function SchoolDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("cnts_school_session")?.value;

  if (!token) {
    redirect("/dashboard/school/login");
  }

  let schoolCode = "";
  let schoolId = "";
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    schoolCode = (payload.schoolCode as string) || "";
    schoolId = (payload.schoolId as string) || "";
  } catch {
    redirect("/dashboard/school/login");
  }

  // Fetch school details
  let school: any = null;
  let registrations: any[] = [];

  if (hasSupabaseAdminConfig) {
    let query = (supabaseAdmin as any).from("schools").select("*");
    if (schoolId) {
      query = query.eq("id", schoolId);
    } else {
      query = query.ilike("school_code", schoolCode.trim());
    }

    const { data: sData } = await query.maybeSingle();
    
    if (sData) {
      school = sData;
      
      const { data: rData } = await (supabaseAdmin as any)
        .from("registrations")
        .select("student_name, student_class, registration_status, created_at, registration_id, photo_url")
        .eq("school_id", school.id)
        .order("created_at", { ascending: false });
        
      if (rData) {
        registrations = rData;
      }
    }
  } else {
    // Mock data for development
    school = {
      id: "demo-school-id",
      name: "Demo International School",
      school_code: "DEMO-123",
      city: "New Delhi",
      quota: 100,
      used_quota: 24,
      sponsorship_mode: "FULL",
      slug: "courage-public-school-jaipur-rajasthan",
      profile_status: "PUBLISHED"
    };
    registrations = Array(24).fill(null).map((_, i) => ({
      registration_id: `REG-${i}`,
      student_name: `Demo Student ${i+1}`,
      student_class: `Class ${Math.floor(Math.random() * 5) + 6}`,
      registration_status: "REGISTERED",
      created_at: new Date().toISOString()
    }));
  }

  if (!school) {
    redirect("/dashboard/school/login");
  }

  return <SchoolDashboardClient school={school} registrations={registrations} />;
}
