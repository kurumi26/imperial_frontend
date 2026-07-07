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
