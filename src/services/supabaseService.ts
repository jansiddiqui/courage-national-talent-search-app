import { supabase, hasSupabaseConfig } from "@/lib/supabaseClient";
import { RegistrationData } from "@/types/registration";

// Cast to any to bypass postgrest typescript mapping conflicts across version differences
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

const SAFE_CHARS = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

const DEFAULT_SETTINGS: Record<string, string> = {
  registration_status: "OPEN",
  payment_status: "ENABLED",
  admit_card_status: "PENDING",
  result_status: "HIDDEN",
  certificate_status: "PENDING",
  announcement_status: "ACTIVE"
};

/**
 * Generates a random 5-character uppercase alphanumeric code using a safe alphabet
 */
function generateCode(): string {
  let code = "";
  for (let i = 0; i < 5; i++) {
    code += SAFE_CHARS.charAt(Math.floor(Math.random() * SAFE_CHARS.length));
  }
  return `CNTS26-${code}`;
}

/**
 * Generates a unique Registration ID, checking for collision in Supabase if online.
 */
async function getUniqueId(): Promise<string> {
  const registrationId = generateCode();
  
  if (!hasSupabaseConfig) {
    return registrationId;
  }

  try {
    const { data } = await db
      .from("registrations")
      .select("registration_id")
      .eq("registration_id", registrationId)
      .maybeSingle();

    if (data) {
      // If code already exists, generate a new one recursively
      return getUniqueId();
    }
  } catch (err) {
    console.warn("Supabase collision check failed. Proceeding with generated ID.", err);
  }

  return registrationId;
}

/**
 * Persists registration data to Supabase and logs a 'REGISTERED' milestone event.
 */
export async function saveRegistration(
  data: Omit<RegistrationData, "registrationId">
): Promise<RegistrationData & { registrationId: string; created_at: string }> {
  const regId = await getUniqueId();
  const timestamp = new Date().toISOString();

  const recordToInsert = {
    registration_id: regId,
    student_name: data.studentName,
    dob: data.dob,
    student_class: data.studentClass,
    school_name: data.schoolName,
    school_city: data.schoolCity,
    school_code: data.schoolCode ? data.schoolCode.trim().toUpperCase() : null,
    school_id: data.school_id || null,
    parent_name: data.parentName,
    mobile_number: data.mobile_number,
    whatsapp_number: data.whatsapp_number,
    parent_email: data.parentEmail,
    state: data.state,
    district: data.district,
    language: data.language,
    why_participating: data.whyParticipating,
    how_heard: data.howHeard,
    utm_source: data.utm_source || null,
    utm_medium: data.utm_medium || null,
    utm_campaign: data.utm_campaign || null,
    referral_code: data.referral_code || null,
    payment_id: data.payment_id || null,
    payment_status: data.payment_status || "PENDING",
    registration_status: data.registration_status || "DRAFT",
    registration_source: data.schoolCode ? "SCHOOL" : (data.referral_code ? "REFERRAL" : "DIRECT"),
    mobile_verified: data.mobile_verified || false,
    admin_notes: data.admin_notes || null,
    user_id: data.user_id || null,
    photo_url: data.photo_url || null,
    created_at: timestamp,
  };

  if (hasSupabaseConfig) {
    if (recordToInsert.payment_status === "SPONSORED" && recordToInsert.school_id) {
      // 1a. Call the RPC to atomic consume quota and register
      const { error: rpcError } = await db.rpc('consume_school_quota_and_register', {
        p_registration_id: recordToInsert.registration_id,
        p_student_name: recordToInsert.student_name,
        p_dob: recordToInsert.dob,
        p_student_class: recordToInsert.student_class,
        p_school_name: recordToInsert.school_name,
        p_school_city: recordToInsert.school_city,
        p_school_code: recordToInsert.school_code,
        p_school_id: recordToInsert.school_id,
        p_parent_name: recordToInsert.parent_name,
        p_mobile_number: recordToInsert.mobile_number,
        p_whatsapp_number: recordToInsert.whatsapp_number,
        p_parent_email: recordToInsert.parent_email,
        p_state: recordToInsert.state,
        p_district: recordToInsert.district,
        p_language: recordToInsert.language,
        p_why_participating: recordToInsert.why_participating,
        p_how_heard: recordToInsert.how_heard,
        p_payment_status: recordToInsert.payment_status,
        p_registration_source: recordToInsert.registration_source
      });

      if (rpcError) {
        console.error("Supabase RPC registration failed:", rpcError);
        throw new Error(`Failed to process sponsored registration: ${rpcError.message}`);
      }
    } else {
      // 1b. Standard Insert into registrations table
      const { error: regError } = await db
        .from("registrations")
        .insert(recordToInsert);

      if (regError) {
        console.error("Supabase registration insert failed:", regError);
        throw new Error(`Failed to save registration: ${regError.message}`);
      }
    }

    // 2. Log REGISTERED milestone audit event
    const { error: eventError } = await db
      .from("registration_events")
      .insert({
        registration_id: regId,
        event_type: data.registration_status || "DRAFT",
        metadata: {
          browser: typeof window !== "undefined" ? window.navigator.userAgent : "SSR",
          timestamp,
          payment_id: data.payment_id || null,
          payment_status: data.payment_status || "PENDING"
        },
      });

    if (eventError) {
      console.error("Supabase registration event log failed:", eventError);
    }

    return {
      ...data,
      registrationId: regId,
      created_at: timestamp,
    };
  } else {
    console.warn("Supabase not configured. Simulating successful local registration.");
    return {
      ...data,
      registrationId: regId,
      created_at: timestamp,
    };
  }
}

/**
 * Updates status, payments, or verification flags on an existing registration record
 */
export async function updateRegistrationStatus(
  registrationId: string,
  updates: {
    payment_id?: string | null;
    payment_status?: string;
    registration_status?: string;
    mobile_verified?: boolean;
    admin_notes?: string;
  }
): Promise<boolean> {
  try {
    const res = await fetch("/api/registrations", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ registrationId, updates })
    });
    if (!res.ok) {
      console.error("Failed to update registration status via API:", res.status);
      return false;
    }
    const data = await res.json();
    return data.success;
  } catch (e) {
    console.error("Update registration status failed:", e);
    return false;
  }
}

/**
 * Updates an existing draft registration with full form details and payment status
 */
export async function updateRegistrationData(
  registrationId: string,
  data: Partial<RegistrationData>
): Promise<boolean> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recordToUpdate: any = {};
    if (data.studentName !== undefined) recordToUpdate.student_name = data.studentName;
    if (data.dob !== undefined) recordToUpdate.dob = data.dob;
    if (data.studentClass !== undefined) recordToUpdate.student_class = data.studentClass;
    if (data.schoolName !== undefined) recordToUpdate.school_name = data.schoolName;
    if (data.schoolCity !== undefined) recordToUpdate.school_city = data.schoolCity;
    if (data.schoolCode !== undefined) recordToUpdate.school_code = data.schoolCode || null;
    if (data.school_id !== undefined) recordToUpdate.school_id = data.school_id || null;
    if (data.parentName !== undefined) recordToUpdate.parent_name = data.parentName;
    if (data.mobile_number !== undefined) recordToUpdate.mobile_number = data.mobile_number;
    if (data.whatsapp_number !== undefined) recordToUpdate.whatsapp_number = data.whatsapp_number;
    if (data.parentEmail !== undefined) recordToUpdate.parent_email = data.parentEmail;
    if (data.state !== undefined) recordToUpdate.state = data.state;
    if (data.district !== undefined) recordToUpdate.district = data.district;
    if (data.language !== undefined) recordToUpdate.language = data.language;
    if (data.whyParticipating !== undefined) recordToUpdate.why_participating = data.whyParticipating;
    if (data.howHeard !== undefined) recordToUpdate.how_heard = data.howHeard;
    
    if (data.payment_id !== undefined) recordToUpdate.payment_id = data.payment_id;
    if (data.payment_status !== undefined) recordToUpdate.payment_status = data.payment_status;
    if (data.registration_status !== undefined) recordToUpdate.registration_status = data.registration_status;
    if (data.mobile_verified !== undefined) recordToUpdate.mobile_verified = data.mobile_verified;
    if (data.admin_notes !== undefined) recordToUpdate.admin_notes = data.admin_notes;
    if (data.user_id !== undefined) recordToUpdate.user_id = data.user_id;
    if (data.photo_url !== undefined) recordToUpdate.photo_url = data.photo_url;

    const res = await fetch("/api/registrations", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ registrationId, updates: recordToUpdate })
    });

    if (!res.ok) {
      console.error("Failed to update registration data via API:", res.status);
      return false;
    }
    const resData = await res.json();
    return resData.success;
  } catch (e) {
    console.error("Update registration data failed:", e);
    return false;
  }
}



interface ContactMessageInput {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

/**
 * Persists support / inquiry message to the contact_messages table.
 */
export async function saveContactMessage(data: ContactMessageInput): Promise<boolean> {
  const recordToInsert = {
    name: data.name,
    email: data.email,
    phone: data.phone || null,
    subject: data.subject || null,
    message: data.message,
  };

  if (hasSupabaseConfig) {
    const { error } = await db
      .from("contact_messages")
      .insert(recordToInsert);

    if (error) {
      console.error("Supabase contact message insert failed:", error);
      return false;
    }
    return true;
  } else {
    console.log("Supabase not configured. Simulating contact message submission:", recordToInsert);
    return true;
  }
}

/**
 * Fetches all candidate registrations, ordered by created_at descending.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchRegistrations(): Promise<any[]> {
  try {
    const res = await fetch("/api/registrations");
    if (!res.ok) {
      console.warn("API registrations fetch returned status:", res.status);
      return [];
    }
    const data = await res.json();
    return data.registrations || [];
  } catch (err) {
    console.error("fetchRegistrations error:", err);
    return [];
  }
}

/**
 * Fetches milestone audit events for a specific candidate registration.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchRegistrationEvents(registrationId: string): Promise<any[]> {
  if (hasSupabaseConfig) {
    const { data, error } = await db
      .from("registration_events")
      .select("*")
      .eq("registration_id", registrationId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Supabase fetchRegistrationEvents error:", error);
      throw new Error(`Failed to fetch registration events: ${error.message}`);
    }
    return data || [];
  } else {
    // Return a default milestone event for fallback preview
    return [
      {
        id: "mock-event-id",
        registration_id: registrationId,
        event_type: "REGISTERED",
        metadata: {
          browser: "Chrome/Windows (Simulated Dev Mode)",
          timestamp: new Date().toISOString()
        },
        created_at: new Date().toISOString()
      }
    ];
  }
}

/**
 * Fetches the total number of candidate registrations.
 */
export async function fetchTotalRegistrationCount(): Promise<number> {
  try {
    const res = await fetch("/api/registrations/count");
    if (!res.ok) {
      return 0;
    }
    const data = await res.json();
    return data.count || 0;
  } catch (e) {
    console.error("Count fetch error:", e);
    return 0;
  }
}

/**
 * Fetches the most recent registrations up to a limit.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchRecentRegistrations(limit = 10): Promise<any[]> {
  if (hasSupabaseConfig) {
    try {
      const { data, error } = await db
        .from("registrations")
        .select("student_name, state, district, student_class, created_at")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        console.error("Supabase fetchRecent error:", error);
        return [];
      }
      return data || [];
    } catch (e) {
      console.error("Recent registrations fetch failed:", e);
      return [];
    }
  }
  return [];
}

/**
 * Fetches all system settings toggles via secure server API.
 */
export async function fetchSystemSettings(): Promise<Record<string, string>> {
  try {
    const res = await fetch("/api/settings");
    if (!res.ok) {
      console.warn("API settings fetch returned status:", res.status);
      return DEFAULT_SETTINGS;
    }
    const data = await res.json();
    return data.settings || DEFAULT_SETTINGS;
  } catch (err) {
    console.error("fetchSystemSettings error:", err);
    return DEFAULT_SETTINGS;
  }
}

/**
 * Updates a specific system settings toggle via secure server API.
 */
export async function updateSystemSetting(key: string, value: string): Promise<boolean> {
  try {
    const res = await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value })
    });
    if (!res.ok) {
      console.error("Failed to update system setting:", res.status);
      return false;
    }
    const data = await res.json();
    return data.success;
  } catch (e) {
    console.error("updateSystemSetting error:", e);
    return false;
  }
}

/**
 * Saves administrative notes for a specific registration.
 */
export async function saveRegistrationNote(registrationId: string, notes: string): Promise<boolean> {
  if (hasSupabaseConfig) {
    try {
      const { error } = await db
        .from("registrations")
        .update({ admin_notes: notes })
        .eq("registration_id", registrationId);

      if (error) {
        console.error("Supabase saveRegistrationNote error:", error);
        return false;
      }
      return true;
    } catch (e) {
      console.error("Admin notes save failed:", e);
      return false;
    }
  }
  return true;
}

/**
 * Fetches all contact messages (Admin)
 */
export async function fetchContactMessages(): Promise<any[]> {
  try {
    const res = await fetch("/api/admin/support");
    if (!res.ok) {
      console.warn("API support messages fetch returned status:", res.status);
      return [];
    }
    const data = await res.json();
    return data.messages || [];
  } catch (err) {
    console.error("fetchContactMessages error:", err);
    return [];
  }
}

/**
 * Updates a contact message (Admin)
 */
export async function updateContactMessage(
  id: string,
  updates: { status?: string; admin_notes?: string; priority?: string }
): Promise<boolean> {
  try {
    const res = await fetch("/api/admin/support", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, updates }),
    });
    
    if (!res.ok) return false;
    const data = await res.json();
    return data.success;
  } catch (err) {
    console.error("updateContactMessage error:", err);
    return false;
  }
}


/**
 * Uploads a base64 candidate photo to Supabase storage
 */
export async function uploadCandidatePhoto(registrationId: string, base64Data: string): Promise<string | null> {
  if (!hasSupabaseConfig) return `candidate_photos/${registrationId}/photo.jpg`;

  try {
    const res = await fetch(`/api/photo/${registrationId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ base64Data })
    });

    if (!res.ok) {
      console.error("API photo upload error:", res.statusText);
      return null;
    }

    const data = await res.json();
    if (!data.success) {
      console.error("API photo upload failed:", data.error);
      return null;
    }

    return data.filePath;
  } catch (err) {
    console.error("Failed to upload photo:", err);
    return null;
  }
}

interface FoundingFamilyInput {
  parentName: string;
  mobileNumber: string;
  parentEmail: string;
}

export async function saveFoundingFamily(data: FoundingFamilyInput): Promise<{ success: boolean; familyId: string; error?: string }> {
  try {
    let nextNum = 342; // Fallback initial counter
    
    if (hasSupabaseConfig) {
      const { count, error: countErr } = await db
        .from("founding_families")
        .select("*", { count: "exact", head: true });
      
      if (!countErr && count !== null) {
        nextNum = 342 + count;
      }
    } else {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("cnts_founding_families_sim_count");
        const currentCount = stored ? parseInt(stored) : 0;
        nextNum = 342 + currentCount;
        localStorage.setItem("cnts_founding_families_sim_count", (currentCount + 1).toString());
      }
    }

    const familyId = `CNTS-FF-${nextNum.toString().padStart(5, "0")}`;
    
    const recordToInsert = {
      family_id: familyId,
      parent_name: data.parentName,
      mobile_number: data.mobileNumber,
      parent_email: data.parentEmail,
    };

    if (hasSupabaseConfig) {
      const { error } = await db
        .from("founding_families")
        .insert([recordToInsert]);
      
      if (error) {
        console.error("Supabase founding_families insert failed:", error);
        return { success: false, familyId: "", error: error.message ?? JSON.stringify(error) };
      }
    } else {
      console.log("Supabase not configured. Simulated founding family save:", recordToInsert);
    }

    return { success: true, familyId };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("saveFoundingFamily error:", err);
    return { success: false, familyId: "", error: msg };
  }
}

export async function fetchFoundingFamiliesCount(): Promise<number> {
  try {
    let count = 0;
    if (hasSupabaseConfig) {
      const { count: dbCount, error } = await db
        .from("founding_families")
        .select("*", { count: "exact", head: true });
      
      if (!error && dbCount !== null) {
        count = dbCount;
      }
    } else {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("cnts_founding_families_sim_count");
        count = stored ? parseInt(stored) : 0;
      }
    }
    return 342 + count;
  } catch (err) {
    console.error("fetchFoundingFamiliesCount error:", err);
    return 342;
  }
}

export async function checkFoundingFamilyDuplicate(
  mobileNumber: string,
  email: string
): Promise<{ exists: boolean; message: string }> {
  if (!hasSupabaseConfig) {
    // In sandbox mode, allow all registrations
    return { exists: false, message: "" };
  }
  try {
    const { data, error } = await db
      .from("founding_families")
      .select("mobile_number, parent_email")
      .or(`mobile_number.eq.${mobileNumber},parent_email.eq.${email}`);

    if (error) {
      console.error("checkFoundingFamilyDuplicate error:", error);
      return { exists: false, message: "" }; // Fail open — don't block on DB error
    }

    if (!data || data.length === 0) return { exists: false, message: "" };

    const mobileMatch = data.some((r: { mobile_number: string; parent_email: string }) => r.mobile_number === mobileNumber);
    const emailMatch  = data.some((r: { mobile_number: string; parent_email: string }) => r.parent_email  === email);

    if (mobileMatch && emailMatch) {
      return {
        exists: true,
        message: "This mobile number and email are already registered as a Founding Family. Each family can register only once.",
      };
    }
    if (mobileMatch) {
      return {
        exists: true,
        message: "This WhatsApp number is already registered as a Founding Family. Each family can register only once.",
      };
    }
    return {
      exists: true,
      message: "This email address is already registered as a Founding Family. Each family can register only once.",
    };
  } catch (err) {
    console.error("checkFoundingFamilyDuplicate exception:", err);
    return { exists: false, message: "" }; // Fail open
  }
}

