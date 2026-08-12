import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client — bypasses Row Level Security.
 *
 * SERVER-ONLY. This module must never be imported from Client Components
 * or shipped to the browser. Import it only in Server Actions, Route
 * Handlers, or Server Components for operations that legitimately require
 * privileged access (e.g. bootstrapping content on first run, reading data
 * for cache revalidation).
 *
 * Never use it to bypass authorisation for a user request — prefer the
 * cookie-scoped `createClient()` from ./server.ts and let RLS enforce the
 * rules. The service key reads from SUPABASE_SERVICE_ROLE_KEY, which is not
 * prefixed with NEXT_PUBLIC_ and therefore never inlined into the client bundle.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Service-role client requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY. " +
        "Add them to your environment (server-side only).",
    );
  }

  return createSupabaseClient(url, serviceKey, {
    auth: {
      // No persistent session needed for service-role operations.
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
