import LandingPageLayout from "@/components/Layout/GuestLayout";
import { PublicPage } from "@/services/publicPageService";
import { resolvePageContent, resolvePageStyles } from "@/lib/cmsPageContent";
import { loadPublicPageBySlug, setPublicPageCacheHeaders } from "@/lib/publicPageServer";
import Head from "next/head";

interface PublicPageViewProps {
  pageData: PublicPage | null;
}

export default function PublicPageView({ pageData }: PublicPageViewProps) {
  if (!pageData) {
    return (
      <div className="container py-5 text-center text-secondary">
        <p>Page not found or temporarily unavailable.</p>
      </div>
    );
  }

  const htmlContent = resolvePageContent(pageData);
  const cssStyles = resolvePageStyles(pageData);
  const slugClass = (pageData.slug || "page").toLowerCase().replace(/[^a-z0-9-]/g, "-");

  return (
    <>
      <Head>
        {cssStyles && (
          <style
            id={`page-styles-${pageData.slug ?? pageData.id}`}
            dangerouslySetInnerHTML={{ __html: cssStyles }}
          />
        )}
        {pageData.meta?.title && <title>{pageData.meta.title}</title>}
        {pageData.meta?.description && (
          <meta name="description" content={pageData.meta.description} />
        )}
        {pageData.meta?.keywords && (
          <meta name="keywords" content={pageData.meta.keywords} />
        )}
      </Head>

      {htmlContent ? (
        <>
          <div
            className={`public-page-content page-${slugClass}`}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
          <style jsx global>{`
            /* Prevent clipped content on zoom for CMS About Us layout */
            .public-page-content.page-about-us [style*="overflow: hidden"],
            .public-page-content.page-about-us [style*="overflow-y: hidden"],
            .public-page-content.page-about-us [style*="overflow-x: hidden"] {
              overflow: visible !important;
            }

            .public-page-content.page-about-us [style*="max-height"],
            .public-page-content.page-about-us [style*="height: 600px"] {
              max-height: none !important;
              height: auto !important;
            }

            .public-page-content.page-about-us img {
              max-width: 100%;
              height: auto !important;
            }
          `}</style>
        </>
      ) : (
        <div className="container py-5 text-center text-secondary">
          <p>No content available for this page.</p>
        </div>
      )}
    </>
  );
}

export async function getServerSideProps(context: {
  params: { page: string };
  res: { setHeader: (name: string, value: string) => void };
}) {
  const { page } = context.params;
  setPublicPageCacheHeaders(context.res);

  const { pageData, notFound } = await loadPublicPageBySlug(page);
  if (notFound) return { notFound: true };

  return {
    props: {
      pageData,
      layout: {
        fullWidth: true,
        hideFooter: page === "footer",
      },
    },
  };
}

PublicPageView.Layout = LandingPageLayout;
