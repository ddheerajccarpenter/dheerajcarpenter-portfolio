import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes safely — later classes win, conditionals supported.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format an ISO date string as "Month Year" (e.g. "March 2023").
 * Returns an empty string for falsy input so UI never renders "Invalid Date".
 */
export function formatMonthYear(date: string | Date | null | undefined): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

/**
 * Convert a title to a URL-safe slug.
 * Lowercase, hyphen-separated, ASCII-friendly.
 */
export function slugify(input: string): string {
  return input
    .toString()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // strip diacritics
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Truncate text to a max length, appending an ellipsis when cut.
 */
export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max - 1).trimEnd() + "…";
}

/**
 * Normalizes a URL input string.
 * Automatically prepends 'https://' if protocol is omitted (e.g. "google.com" -> "https://google.com").
 * Corrects backslashes in protocol or path (e.g. "https:\google.com" -> "https://google.com").
 * Preserves relative URLs (e.g. "/projects"), anchors, and special schemes like mailto: or tel:.
 */
export function normalizeUrl(input: string | null | undefined): string {
  if (!input) return "";
  let trimmed = input.trim();
  if (!trimmed) return "";

  // Replace backslashes in protocol (e.g. https:\ or http:\ or https:\\)
  trimmed = trimmed.replace(/^(https?|ftp):[\\/]+/i, (match, proto) => `${proto.toLowerCase()}://`);

  // Replace remaining backslashes with forward slashes
  trimmed = trimmed.replace(/\\/g, "/");

  // If it's a relative URL (/path or #anchor) or already starts with a protocol, return as-is
  if (
    trimmed.startsWith("/") ||
    trimmed.startsWith("#") ||
    /^(https?|ftp|mailto|tel):/i.test(trimmed)
  ) {
    return trimmed;
  }

  // Otherwise, prepend https://
  return `https://${trimmed}`;
}

/**
 * Normalizes a URL string, returning null if empty.
 */
export function normalizeUrlOrNull(input: string | null | undefined): string | null {
  if (!input) return null;
  const normalized = normalizeUrl(input);
  return normalized === "" ? null : normalized;
}

/**
 * Build an absolute URL from a path, using the configured site URL.
 * Falls back to a sensible default when the env var is absent.
 */
export function absoluteUrl(path: string = "/"): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

