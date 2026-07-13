import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";
import { verifySession } from "@/lib/sessionHelper";

const JWT_SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.JWT_SECRET || "";
const INTERNAL_API_SECRET = process.env.INTERNAL_API_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// Simple in-memory rate-limiter for ANONYMOUS_PUBLIC requests
const ipRateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 60; // 60 requests per minute per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const limitInfo = ipRateLimitMap.get(ip);
  if (!limitInfo || now > limitInfo.resetAt) {
    ipRateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }
  limitInfo.count++;
  if (limitInfo.count > MAX_REQUESTS) {
    return true;
  }
  return false;
}

// Approved public events that do not require auth session
const PUBLIC_EVENTS = new Set([
  "REGISTRATION_STARTED",
  "SUPPORT_TICKET_CREATED",
  "NOTIFICATION_OPENED"
]);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventType, eventId, metadata = {}, correlationId, sessionIdentity } = body;

    if (!eventType) {
      return NextResponse.json({ success: false, message: "eventType is required" }, { status: 400 });
    }

    // Derive network metadata server-side (do not trust client-supplied headers)
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || 
               request.headers.get("x-real-ip") || 
               "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    let actorId: string | null = null;
    let trustClass = "ANONYMOUS_PUBLIC";
    let privacyClassification = "PUBLIC";

    // Authenticated checks
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("cnts_session");

    let session: any = null;
    if (sessionCookie?.value && JWT_SECRET) {
      session = await verifySession(sessionCookie.value, JWT_SECRET);
    }

    // Resolve Trust Classes
    if (session) {
      trustClass = "AUTHENTICATED_USER";
      // Derive actor identity from verified session context
      actorId = session.cntsId || session.id || session.email || "authenticated_user";
      privacyClassification = "PII_RESTRICTED";
    } else if (request.headers.get("x-internal-secret") === INTERNAL_API_SECRET) {
      trustClass = "TRUSTED_SERVER";
      actorId = body.actorId || "trusted_server";
      privacyClassification = "INTERNAL";
    } else if (body.providerSignature && request.headers.get("x-provider-signature")) {
      trustClass = "SIGNED_PROVIDER_CALLBACK";
      actorId = body.actorId || "provider_callback";
      privacyClassification = "INTERNAL";
    } else {
      // Anonymous / Public
      if (!PUBLIC_EVENTS.has(eventType)) {
        return NextResponse.json({ success: false, message: `Unauthorized event type '${eventType}' for guest session` }, { status: 401 });
      }
      if (isRateLimited(ip)) {
        return NextResponse.json({ success: false, message: "Too Many Requests" }, { status: 429 });
      }
      trustClass = "ANONYMOUS_PUBLIC";
      actorId = sessionIdentity || "anonymous_guest";
      privacyClassification = "ANONYMOUS";
    }

    // Generate unique event ID for idempotency/deduplication key
    const finalEventId = eventId || crypto.randomUUID();

    if (!hasSupabaseAdminConfig) {
      return NextResponse.json({
        success: true,
        message: "Event logged (Sandbox)",
        eventId: finalEventId,
        derived: { actorId, trustClass, privacyClassification }
      });
    }

    // Insert payload to DB
    const { error } = await (supabaseAdmin as any).from("analytics_telemetry_events").insert({
      id: finalEventId,
      event_type: eventType,
      actor_id: actorId,
      metadata: {
        ...metadata,
        trustClass,
        privacyClassification,
        correlationId: correlationId || null,
        sessionIdentity: sessionIdentity || null,
        clientIp: ip,
        userAgent
      },
      ip_address: ip,
      user_agent: userAgent
    });

    if (error) {
      // Idempotency: Ignore duplicate key error, return success
      if (error.code === "23505") {
        return NextResponse.json({ success: true, message: "Duplicate event ignored", eventId: finalEventId });
      }
      console.error("[Telemetry Ingest] DB Error:", error);
      return NextResponse.json({ success: false, message: "Database insert error" }, { status: 500 });
    }

    return NextResponse.json({ success: true, eventId: finalEventId });
  } catch (err: any) {
    console.error("[Telemetry Ingest] Exception:", err);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
