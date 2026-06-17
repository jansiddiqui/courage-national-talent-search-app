import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/types/database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Check if environment variables are configured
export const hasSupabaseConfig = !!supabaseUrl && !!supabaseAnonKey;

// We provide placeholder values to prevent initialization crashes during static export builds
const resolvedUrl = supabaseUrl || "https://placeholder.supabase.co";
const resolvedKey = supabaseAnonKey || "placeholder-key";

export const supabase = createBrowserClient<Database>(resolvedUrl, resolvedKey);
