import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Edge middleware — runs on every request.
 *
 * Responsibilities:
 *  1. Refresh the Supabase auth session (tokens) and persist updated cookies.
 *  2. Protect /admin routes: unauthenticated visitors are redirected to the
 *     login page. The database (RLS) and Server Components (requireAdmin)
 *     provide defense-in-depth; this middleware is the first line.
 *
 * Role checks are intentionally deferred to Server Components because the
 * middleware runs at the edge and cannot query the profiles table cheaply.
 *
 * NOTE: Next.js 16 renames this convention to `proxy.ts`. We keep
 * `middleware.ts` to match the documented project architecture; it remains
 * fully supported and is the canonical name in the Phase 1 spec. If you later
 * want to silence the build deprecation notice, renaming this file to
 * `proxy.ts` (and the exported `middleware` function to `proxy`) is the only
 * change required.
 */
export async function proxy(request: NextRequest) {
  const { user, response } = await updateSession(request);

  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname === "/admin/login";

  if (isAdminRoute && !isLoginRoute && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated users visiting login are sent to the dashboard.
  if (isLoginRoute && user) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/admin";
    dashboardUrl.search = "";
    return NextResponse.redirect(dashboardUrl);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static, _next/image, favicon (static assets)
     * - Public files: images, fonts, icons, PDFs, favicons
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|pdf|woff2?|ttf|otf|eot)$).*)",
  ],
};
