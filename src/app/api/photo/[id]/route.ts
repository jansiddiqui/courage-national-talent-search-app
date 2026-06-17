import { NextResponse } from "next/server";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    
    if (!id) {
      return new NextResponse("Missing ID", { status: 400 });
    }

    const { data: reg, error } = await (supabaseAdmin as any)
      .from("registrations")
      .select("photo_url")
      .or(`registration_id.eq.${id},cnts_id.eq.${id}`)
      .maybeSingle();

    if (error || !reg || !reg.photo_url) {
      return new NextResponse("Not Found", { status: 404 });
    }

    if (!hasSupabaseAdminConfig) {
      return NextResponse.redirect(reg.photo_url); // Fallback for local
    }

    const { data: signedData, error: signError } = await (supabaseAdmin as any).storage
      .from('candidate_photos')
      .createSignedUrl(reg.photo_url.replace('candidate_photos/', ''), 60 * 60);

    if (signError || !signedData?.signedUrl) {
      return new NextResponse("Failed to generate signed URL", { status: 500 });
    }

    return NextResponse.redirect(signedData.signedUrl);
  } catch (error) {
    console.error("Error generating photo signed url:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
