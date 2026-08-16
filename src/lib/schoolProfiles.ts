import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";

export interface SchoolPublicSnapshot {
  academic_session_name: string;
  student_count: number;
  average_score: number;
  school_rank: number | null;
  scholarship_count: number;
}

export interface SchoolPublicProfile {
  id: string;
  name: string;
  slug: string;
  city: string;
  state: string | null;
  board: string;
  school_type: string;
  profile_status: string;
  is_founding_school: boolean;
  public_description: string | null;
  logo_url: string | null;
  website: string | null;
  joined_at: string;
  is_featured: boolean;
  snapshots: SchoolPublicSnapshot[];
}

// Sandbox mock for local dev or when database credentials are not active
const MOCK_PUBLISHED_SCHOOL: SchoolPublicProfile = {
  id: "demo-school-id",
  name: "Courage Public School",
  slug: "courage-public-school-jaipur-rajasthan",
  city: "Jaipur",
  state: "Rajasthan",
  board: "CBSE",
  school_type: "PRIVATE",
  profile_status: "PUBLISHED",
  is_founding_school: true,
  public_description: "Courage Public School is a premier educational institution in Jaipur, dedicated to academic excellence, holistic character development, and empowering students to excel in national talent evaluations.",
  logo_url: null,
  website: "https://www.couragepublicschool.edu.in",
  joined_at: "2026-01-15T00:00:00.000Z",
  is_featured: true,
  snapshots: [
    {
      academic_session_name: "2026-27",
      student_count: 87,
      average_score: 74.5,
      school_rank: 12,
      scholarship_count: 5,
    },
  ],
};

/**
 * Fetches a public school profile by slug.
 * STRICT PRIVACY RULE: Only selects whitelisted public-safe columns.
 * Never selects coordinator details, PIN, pricing, or internal notes.
 */
export async function getPublishedSchoolProfile(
  slug: string
): Promise<SchoolPublicProfile | null> {
  if (!slug) return null;

  const normalizedSlug = slug.trim().toLowerCase();

  // Sandbox fallback
  if (!hasSupabaseAdminConfig) {
    if (normalizedSlug === MOCK_PUBLISHED_SCHOOL.slug) {
      return MOCK_PUBLISHED_SCHOOL;
    }
    return null;
  }

  try {
    // 1. Fetch school details (Explicit public column selection only)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: school, error: schoolErr } = await (supabaseAdmin as any)
      .from("schools")
      .select("id, name, slug, city, state, board, school_type, profile_status, is_founding_school, public_description, logo_url, website, joined_at, is_featured")
      .eq("slug", normalizedSlug)
      .eq("profile_status", "PUBLISHED")
      .maybeSingle();

    if (schoolErr || !school) {
      return null;
    }

    // 2. Fetch participation history snapshots
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: rawSnapshots } = await (supabaseAdmin as any)
      .from("school_performance_snapshots")
      .select(`
        student_count,
        average_score,
        school_rank,
        scholarship_count,
        generated_at,
        academic_sessions ( session_name )
      `)
      .eq("school_id", school.id)
      .order("generated_at", { ascending: true });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const snapshots: SchoolPublicSnapshot[] = (rawSnapshots || []).map((snap: any) => ({
      academic_session_name: snap.academic_sessions?.session_name || "CNTS 2026",
      student_count: snap.student_count || 0,
      average_score: typeof snap.average_score === "number" ? snap.average_score : 0,
      school_rank: snap.school_rank || null,
      scholarship_count: snap.scholarship_count || 0,
    }));

    return {
      ...school,
      snapshots,
    };
  } catch (err) {
    console.error("[schoolProfiles] Fetch error:", err);
    return null;
  }
}

/**
 * Returns all published school slugs for sitemap generation.
 */
export async function getAllPublishedSchoolSlugs(): Promise<{ slug: string; updated_at?: string }[]> {
  if (!hasSupabaseAdminConfig) {
    return [{ slug: MOCK_PUBLISHED_SCHOOL.slug }];
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: schools } = await (supabaseAdmin as any)
      .from("schools")
      .select("slug")
      .eq("profile_status", "PUBLISHED")
      .not("slug", "is", null);

    return (schools || []).filter((s: { slug?: string }) => Boolean(s.slug));
  } catch {
    return [];
  }
}
