import type { PublicPage } from "@/services/publicPageService";

export function resolvePageStyles(pageData: Pick<PublicPage, "styles" | "json">): string {
  if (pageData.styles && typeof pageData.styles === "string" && pageData.styles.trim()) {
    return pageData.styles.trim();
  }

  if (pageData.json && typeof pageData.json === "string") {
    try {
      const parsed = JSON.parse(pageData.json);
      if (parsed["gjs-css"] && typeof parsed["gjs-css"] === "string") {
        return parsed["gjs-css"].trim();
      }
    } catch {
      // ignore parse errors
    }
  }

  return "";
}

export function resolvePageContent(pageData: Pick<PublicPage, "content" | "json">): string {
  if (pageData.content && typeof pageData.content === "string" && pageData.content.trim()) {
    return pageData.content.trim();
  }

  if (pageData.json && typeof pageData.json === "string") {
    try {
      const parsed = JSON.parse(pageData.json);
      if (parsed["gjs-html"] && typeof parsed["gjs-html"] === "string") {
        return parsed["gjs-html"].trim();
      }
    } catch {
      // ignore
    }
  }

  return "";
}
