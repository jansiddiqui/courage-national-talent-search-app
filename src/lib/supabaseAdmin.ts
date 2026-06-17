import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// Verify configuration variables are loaded
export const hasSupabaseAdminConfig = !!supabaseUrl && !!supabaseServiceRoleKey;

const resolvedUrl = supabaseUrl || "https://placeholder.supabase.co";
// Fall back to anon key if service key is missing during build or sandbox testing
const resolvedKey = supabaseServiceRoleKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

export const supabaseAdmin = createClient<Database>(resolvedUrl, resolvedKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});
