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
    school_code: data.schoolCode || null,
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
    mobile_verified: data.mobile_verified || false,
    admin_notes: data.admin_notes || null,
    user_id: data.user_id || null,
    created_at: timestamp,
  };

  if (hasSupabaseConfig) {
    // 1. Insert into registrations table
    const { error: regError } = await db
      .from("registrations")
      .insert(recordToInsert);

    if (regError) {
      console.error("Supabase registration insert failed:", regError);
      throw new Error(`Failed to save registration: ${regError.message}`);
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
