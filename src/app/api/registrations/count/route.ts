/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    if (hasSupabaseAdminConfig) {
      const { count, error } = await (supabaseAdmin as any)
        .from("registrations")
        .select("id", { count: "exact", head: true });
        
      if (error) {
        console.error("Error fetching total registration count:", error);
        return NextResponse.json({ count: 0 });
      }
      return NextResponse.json({ count: count || 0 });
    }
    // Sandbox fallback
    return NextResponse.json({ count: 48 });
  } catch (e) {
    return NextResponse.json({ count: 0 });
  }
}
