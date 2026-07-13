/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Registration360Service
 * Aggregates a complete candidate profile from registrations, results, and payments.
 */

export async function getRegistration360(
  supabaseAdmin: any,
  cntsId: string
): Promise<any | null> {
  const { data: reg, error } = await supabaseAdmin
    .from('registrations')
    .select('*')
    .eq('cnts_id', cntsId)
    .maybeSingle();

  if (error || !reg) return null;

  const { data: result } = await supabaseAdmin
    .from('results')
    .select('*')
    .eq('cnts_id', cntsId)
    .maybeSingle();

  return { registration: reg, result: result || null };
}
