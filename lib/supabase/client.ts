import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client for use in Client Components and client-side hooks.
 *
 * Uses the anon key (safe to expose) and the @supabase/ssr cookie adapter
 * so the browser session is shared with server-rendered routes. Auth state
 * is stored in cookies, never localStorage.
 *
 * RLS governs all access — this client cannot perform privileged operations.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder";

  return createBrowserClient(url, key);
}
