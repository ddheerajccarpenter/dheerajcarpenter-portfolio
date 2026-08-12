import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Refresh the Supabase auth session on every request and persist the updated
 * cookies onto the response. Used by the root middleware so that:
 *  - Server Components always see a fresh session, and
 *  - Expired access tokens are silently refreshed via the refresh token cookie.
 *
 * Returns the mutated response so the caller can chain further logic
 * (e.g. route protection).
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANT: calling getUser() refreshes the session cookie on the response.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { user, response };
}
