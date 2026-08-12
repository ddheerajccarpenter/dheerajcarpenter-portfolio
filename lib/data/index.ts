/**
 * Server-side data-access layer.
 *
 * Populated in Phase 3. Each function reads from Supabase using the
 * cookie-scoped server client, wraps the result in Next.js cache tags, and
 * returns typed domain objects. Admin mutations call `revalidateTag` on the
 * matching tag so the public site updates on-demand.
 *
 *   export async function getProjects(): Promise<Project[]> { ... }
 *
 * Keep all Supabase queries here (not in components) so caching, typing, and
 * error handling stay centralised.
 */

export type {} // placeholder until Phase 3 data functions are added
