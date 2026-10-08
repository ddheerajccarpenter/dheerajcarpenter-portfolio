import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Next.js Edge Middleware.
 *
 * Responsibilities:
 *  1. Refresh the Supabase auth session (tokens) and persist updated cookies.
 *  2. Protect /dc admin routes: unauthenticated visitors are redirected to the
 *     login page.
 */
export async function middleware(request: NextRequest) {
  const { user, response } = await updateSession(request);

  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith("/dc");
  const isLoginRoute = pathname === "/dc/login";

  if (isAdminRoute && !isLoginRoute && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/dc/login";
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated users visiting login are sent to the dashboard.
  if (isLoginRoute && user) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/dc";
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
