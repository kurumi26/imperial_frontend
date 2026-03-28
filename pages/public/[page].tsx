import LandingPageLayout from "@/components/Layout/GuestLayout";
import { getPublicPageBySlug, PublicPage } from "@/services/publicPageService";
import Head from "next/head";

interface PublicPageViewProps {
  pageData: PublicPage;
}

/**
 * Safely extract the CSS string from pageData.
 * Priority: pageData.styles → gjs-css inside pageData.json → ""
 */
function resolvePageStyles(pageData: PublicPage): string {
  // 1. Direct styles field (already extracted by backend)
  if (pageData.styles && typeof pageData.styles === "string" && pageData.styles.trim()) {
    return pageData.styles.trim();
  }

  // 2. Fallback: parse gjs-css from the raw json field
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

/**
 * Safely resolve HTML content.
 * Priority: pageData.content → gjs-html inside pageData.json → ""
 */
function resolvePageContent(pageData: PublicPage): string {
  if (pageData.content && typeof pageData.content === "string" && pageData.content.trim()) {
    return pageData.content.trim();
  }

  // Fallback: extract from GrapesJS json
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

export default function PublicPageView({ pageData }: PublicPageViewProps) {
  if (!pageData) return <div>Page not found</div>;

  const htmlContent = resolvePageContent(pageData);
  const cssStyles  = resolvePageStyles(pageData);

  return (
    <>
      <Head>
        {/* Page-specific scoped styles from the CMS/GrapesJS editor */}
        {cssStyles && (
          <style
            id={`page-styles-${pageData.slug ?? pageData.id}`}
            dangerouslySetInnerHTML={{ __html: cssStyles }}
          />
        )}

        {/* Optional: page-level SEO meta tags */}
        {pageData.meta?.title && <title>{pageData.meta.title}</title>}
        {pageData.meta?.description && (
          <meta name="description" content={pageData.meta.description} />
        )}
        {pageData.meta?.keywords && (
          <meta name="keywords" content={pageData.meta.keywords} />
        )}
      </Head>

      {/* Rendered CMS HTML content */}
      {htmlContent ? (
        <div
          className="public-page-content"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      ) : (
        <div className="container py-5 text-center text-secondary">
          <p>No content available for this page.</p>
        </div>
      )}
    </>
  );
}

export async function getServerSideProps(context: any) {
  const { page } = context.params;

  try {
    const res = await getPublicPageBySlug(page);
    const pageData = res.data ?? null;

    if (!pageData) return { notFound: true };

    return {
      props: {
        pageData,
        layout: { fullWidth: true },
      },
    };
  } catch {
    return { notFound: true };
  }
}

PublicPageView.Layout = LandingPageLayout;