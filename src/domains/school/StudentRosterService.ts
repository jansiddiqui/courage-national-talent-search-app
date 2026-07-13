import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";

export interface RosterFilter {
  search?: string;
  studentClass?: string;
  photoStatus?: "ALL" | "UPLOADED" | "MISSING";
  page?: number;
  pageSize?: number;
}

export interface Student360Profile {
  student: any;
  allocation: any;
  result: any;
  certificate: any;
  admitCardDownloaded: boolean;
  certificateDownloaded: boolean;
}

export class StudentRosterService {
  /**
   * Retrieves a paginated list of students belonging strictly to the school and academic session context.
   */
  static async getRoster(
    schoolId: string,
    sessionId: string,
    filters: RosterFilter
  ) {
    if (!hasSupabaseAdminConfig) {
      return { students: [], total: 0 };
    }

    const page = filters.page || 1;
    const pageSize = filters.pageSize || 50;
    const startOffset = (page - 1) * pageSize;
    const endOffset = startOffset + pageSize - 1;

    let query = supabaseAdmin
      .from("registrations")
      .select("*", { count: "exact" })
      .eq("school_id", schoolId)
      .eq("academic_session_id", sessionId);

    // Apply class filter
    if (filters.studentClass) {
      query = query.eq("student_class", filters.studentClass);
    }

    // Apply search filter (matching name or registration_id)
    if (filters.search && filters.search.trim()) {
      const searchTerm = filters.search.trim();
      query = query.or(`student_name.ilike.%${searchTerm}%,registration_id.ilike.%${searchTerm}%`);
    }

    // Apply photo status filter
    if (filters.photoStatus === "UPLOADED") {
      query = query.not("photo_url", "is", null);
    } else if (filters.photoStatus === "MISSING") {
      query = query.is("photo_url", null);
    }

    const { data, count, error } = await query
      .order("created_at", { ascending: false })
      .range(startOffset, endOffset);

    if (error) {
      throw new Error(`Roster fetch failed: ${error.message}`);
    }

    return {
      students: data || [],
      total: count || 0,
    };
  }

  /**
   * Aggregates a comprehensive 360° view of all parameters matching a student.
   * Ensures student belongs strictly to the requested school.
   */
  static async getStudent360(schoolId: string, studentId: string): Promise<Student360Profile | null> {
    if (!hasSupabaseAdminConfig) return null;

    // 1. Fetch registration profile and check cross-school ownership
    const { data: student, error: studentErr } = await supabaseAdmin
      .from("registrations")
      .select("*")
      .eq("registration_id", studentId)
      .eq("school_id", schoolId)
      .maybeSingle();

    if (studentErr || !student) {
      return null;
    }

    // 2. Fetch Active Quota Allocation details (if sponsored)
    const { data: allocation } = await supabaseAdmin
      .from("school_quota_allocations")
      .select("*")
      .eq("student_id", studentId)
      .eq("status", "ACTIVE")
      .maybeSingle();

    // 3. Fetch Assessment Result parameters
    const { data: result } = await supabaseAdmin
      .from("assessment_results")
      .select("*")
      .eq("verification_token", studentId)
      .maybeSingle();

    // 4. Fetch Issued Certificates
    const { data: certificate } = await supabaseAdmin
      .from("certificates")
      .select("*")
      .eq("candidate_id", studentId)
      .eq("status", "ISSUED")
      .maybeSingle();

    // 5. Query event logs for Admit Card downloads and Certificate downloads
    const { data: events } = await supabaseAdmin
      .from("registration_events")
      .select("event_type")
      .eq("registration_id", studentId);

    const admitCardDownloaded = !!events?.some((e: any) => e.event_type === "ADMIT_CARD_DOWNLOADED");
    const certificateDownloaded = !!events?.some((e: any) => e.event_type === "CERTIFICATE_DOWNLOADED");

    return {
      student,
      allocation,
      result,
      certificate,
      admitCardDownloaded,
      certificateDownloaded,
    };
  }
}
