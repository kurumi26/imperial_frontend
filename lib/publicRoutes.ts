/**
 * Normalize CMS menu/page targets to internal Next.js public routes.
 * CMS may store "/home", "home", or "https://domain.com/public/home".
 */
export function resolvePublicPageHref(target: string): string {
  const raw = (target ?? "").trim();
  if (!raw) return "/";

  if (raw.startsWith("mailto:") || raw.startsWith("tel:")) return raw;

  let path = raw;
  if (/^https?:\/\//i.test(raw)) {
    try {
      path = new URL(raw).pathname;
    } catch {
      return raw;
    }
  }

  path = path.split(/[?#]/)[0].replace(/\/+$/, "") || "/";
  if (path === "/" || path === "/home") return "/";

  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized.startsWith("/public/")) {
    return normalized.slice("/public".length) || "/";
  }
  if (normalized === "/public") {
    return "/";
  }

  return normalized;
}
