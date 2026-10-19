import { createClient } from "@supabase/supabase-js";

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://yefbfstqxxqpbqzloeod.supabase.co";
export const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_jjdqDrl_GbANQURn7bfWZw_uhgevVOz";
export const ADMIN_UID = "3c6a4096-d6e2-4c45-bada-45f0cbf01510";

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error("Missing Supabase environment variables: VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY");
}

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

/**
 * Checks if a string is a valid UUID (v4/v1).
 */
export function isValidUuid(id: string | null | undefined): boolean {
  if (!id) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

/**
 * Normalizes an ID to null if it's not a valid UUID (preventing PostgreSQL uuid syntax errors).
 */
export function sanitizeUuid(id: string | null | undefined): string | null {
  return isValidUuid(id) ? (id as string) : null;
}
