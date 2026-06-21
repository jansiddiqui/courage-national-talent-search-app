import { supabaseAdmin, hasSupabaseAdminConfig } from "./supabaseAdmin";
import crypto from "crypto";

/**
 * Checks if a given IP address has exceeded the rate limit threshold for an endpoint.
 * Performs automatic sliding window cleanup in Supabase rate_limit_attempts table.
 */
export async function isRateLimited(
  ip: string,
  endpoint: string,
  limit: number, // Max attempts allowed in window
  windowSeconds: number = 60 // Sliding window size in seconds
): Promise<{ limited: boolean; remaining: number }> {
  if (!hasSupabaseAdminConfig) {
    // Sandbox: Bypass rate limits locally
    return { limited: false, remaining: limit };
  }

  try {
    // Hash IP address to protect PII privacy compliance
    const ipHash = crypto.createHash("sha256").update(ip).digest("hex");
    const now = new Date();
    const cutoff = new Date(now.getTime() - windowSeconds * 1000).toISOString();

    // 1. Prune expired log attempts
    await (supabaseAdmin as any)
      .from("rate_limit_attempts")
      .delete()
      .eq("ip_hash", ipHash)
      .eq("endpoint", endpoint)
      .lt("attempted_at", cutoff);

    // 2. Query attempts in the active window
    const { count, error: countError } = await (supabaseAdmin as any)
      .from("rate_limit_attempts")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .eq("endpoint", endpoint);

    if (countError) {
      console.error("[Rate Limiter] Query error:", countError);
      return { limited: false, remaining: limit };
    }

    const currentAttempts = count || 0;

    if (currentAttempts >= limit) {
      return { limited: true, remaining: 0 };
    }

    // 3. Log the current attempt
    const { error: insertError } = await (supabaseAdmin as any)
      .from("rate_limit_attempts")
      .insert({
        ip_hash: ipHash,
        endpoint: endpoint,
        attempted_at: now.toISOString()
      });

    if (insertError) {
      console.error("[Rate Limiter] Insert attempt error:", insertError);
    }

    return { limited: false, remaining: limit - currentAttempts - 1 };
  } catch (err) {
    console.error("[Rate Limiter] System failure:", err);
    return { limited: false, remaining: limit };
  }
}
