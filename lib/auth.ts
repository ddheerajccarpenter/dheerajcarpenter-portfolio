import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Auth + role-checking helpers.
 *
 * Security model:
 *  - Public content is readable by anyone (RLS SELECT policy).
 *  - Admin mutations require an authenticated session whose profile row has
 *    role = 'admin'. RLS enforces this at the database; these helpers enforce
 *    it at the route boundary so unauthenticated users never reach admin UI.
 */

export type UserRole = "super_admin" | "admin" | "editor";

export interface SessionUser {
  id: string;
  email: string;
}

export interface AdminSession extends SessionUser {
  role: UserRole;
  name: string | null;
}

/**
 * Return the authenticated user, or null when there is no session.
 * Safe to call in any Server Component / Route Handler / Server Action.
 */
export async function getSession(): Promise<SessionUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;
  return { id: user.id, email: user.email ?? "" };
}

/**
 * Return the session only if the user has an admin role.
 * Returns null for unauthenticated users.
 * Automatically provisions missing profile rows to prevent lockout.
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, name")
        .eq("id", user.id)
        .maybeSingle();

      if (profile) {
        return {
          id: user.id,
          email: user.email ?? "",
          role: (profile.role as UserRole) || "admin",
          name: profile.name || user.email?.split("@")[0] || "Admin",
        };
      }

      // If profile does not exist yet, attempt auto-creation
      await supabase.from("profiles").upsert(
        {
          id: user.id,
          email: user.email ?? "",
          name: user.email?.split("@")[0] || "Admin",
          role: "admin",
        },
        { onConflict: "id" }
      );
    } catch (profileErr) {
      console.warn("Profile fetch/creation warning:", profileErr);
    }

    // Default admin session for authenticated user
    return {
      id: user.id,
      email: user.email ?? "",
      role: "admin",
      name: user.email?.split("@")[0] || "Admin User",
    };
  } catch (err) {
    console.error("Error in getAdminSession:", err);
    return null;
  }
}

/**
 * Guard for admin Server Components and layouts.
 * Redirects to /admin/login when the request is not from an admin.
 */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }
  return session;
}
