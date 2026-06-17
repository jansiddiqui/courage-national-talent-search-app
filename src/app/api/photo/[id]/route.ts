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

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    const { base64Data } = await request.json();

    if (!id || !base64Data) {
      return NextResponse.json({ success: false, error: "Missing ID or base64Data" }, { status: 400 });
    }

    if (!hasSupabaseAdminConfig) {
      return NextResponse.json({ success: true, filePath: `candidate_photos/${id}/photo.jpg` });
    }

    // Strip data URI prefix if present
    const base64String = base64Data.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64String, 'base64');
    
    const filePath = `${id}/photo.jpg`;

    const { error } = await (supabaseAdmin as any).storage
      .from('candidate_photos')
      .upload(filePath, buffer, {
        contentType: 'image/jpeg',
        upsert: true
      });

    if (error) {
      console.error("Supabase admin photo upload error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // Note: photo_url is stored with the bucket prefix by convention in the client
    return NextResponse.json({ success: true, filePath: `candidate_photos/${filePath}` });
  } catch (error) {
    console.error("Error uploading photo via admin:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
