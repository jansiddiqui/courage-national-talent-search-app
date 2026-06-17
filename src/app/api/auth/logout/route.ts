import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true, message: "Logged out successfully" });
  
  // Set expired cookie to delete it
  response.cookies.set("cnts_session", "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    expires: new Date(0), // past date deletes cookie
    path: "/"
  });

  return response;
}
