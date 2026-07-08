import type { PublicPage } from "@/services/publicPageService";
import { getPublicPageBySlug } from "@/services/publicPageService";
import type { AxiosError } from "axios";

export function unwrapPublicPage(data: unknown): PublicPage | null {
  if (!data || typeof data !== "object") return null;

  const wrapped = data as { data?: PublicPage };
  if (wrapped.data && typeof wrapped.data === "object" && "slug" in wrapped.data) {
    return wrapped.data;
  }

  if ("slug" in (data as PublicPage) || "id" in (data as PublicPage)) {
    return data as PublicPage;
  }

  return null;
}

export function setPublicPageCacheHeaders(res: {
  setHeader: (name: string, value: string) => void;
}) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
}

export async function loadPublicPageBySlug(slug: string): Promise<{
  pageData: PublicPage | null;
  notFound: boolean;
}> {
  try {
    const res = await getPublicPageBySlug(slug);
    const pageData = unwrapPublicPage(res.data);
    return { pageData, notFound: !pageData };
  } catch (error) {
    const status = (error as AxiosError)?.response?.status;
    if (status === 404) {
      return { pageData: null, notFound: true };
    }
    console.error(`Failed to load public page "${slug}":`, error);
    return { pageData: null, notFound: false };
  }
}

/** Vercel / frontend base URL for public page links (no trailing slash). */
export function getPublicFrontendBaseUrl(): string {
  const configured = (process.env.NEXT_PUBLIC_FRONTEND_URL ?? "").replace(/\/$/, "");
  if (configured) return configured;

  const vercel = (process.env.VERCEL_URL ?? "").replace(/\/$/, "");
  if (vercel) return vercel.startsWith("http") ? vercel : `https://${vercel}`;

  return "";
}

export function buildPublicPageUrl(slug: string): string {
  const base = getPublicFrontendBaseUrl();
  const normalized = slug.replace(/^\/+/, "");
  const path = !normalized || normalized === "home" ? "/" : `/${normalized}`;
  return base ? `${base}${path}` : path;
}
