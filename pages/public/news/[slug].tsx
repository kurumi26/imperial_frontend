import Head from "next/head";
import LandingPageLayout from "@/components/Layout/GuestLayout";
import { fetchPublicArticleBySlug } from "@/services/articleService";
import { articleToAlbum } from "@/schemas/articleToAlbum";

type Props = {
  pageData: any;
  article: any;
  isPreview?: boolean;
};

export default function NewsDetailPage({ article, isPreview }: Props) {
  // Parse the grapesjs json to extract css and js if needed
  let gjsCSS = "";
  let gjsJS = "";

  try {
    if (article.json) {
      const parsed = typeof article.json === "string" ? JSON.parse(article.json) : article.json;
      gjsCSS = parsed["gjs-css"] || "";
      gjsJS = parsed["gjs-js"] || "";
    }
  } catch (e) {
    console.warn("Failed to parse article.json", e);
  }

  // Merge styles: prefer article.styles, fallback to parsed gjs-css
  const finalCSS = article.styles || gjsCSS || "";

  return (
    <>
      <Head>
        <title>{article.meta_title || article.name}</title>
        <meta
          name="description"
          content={article.meta_description || article.teaser}
        />
        {/* Inject GrapesJS styles in <head> */}
        {finalCSS && (
          <style
            dangerouslySetInnerHTML={{ __html: finalCSS }}
          />
        )}
      </Head>

      <div className="container">
        {isPreview && (
          <div className="alert alert-warning py-2 small mb-3" role="status">
            Preview mode — this article is not published yet.
          </div>
        )}
        {/* TITLE */}
        <h1 className="fw-bold text-primary mb-2">
          {article.name}
        </h1>

        {/* META */}
        <div className="text-muted small mb-4">
          Posted on {article.date}
          {article.user?.firstname && (
            <> &nbsp;|&nbsp; By {article.user.firstname} {article.user.lastname}</>
          )}
          {article.category?.name && <> &nbsp;|&nbsp; {article.category.name}</>}
        </div>

        {/* FEATURED IMAGE */}
        {(article.image_url || article.thumbnail_url) && (
          <div className="mb-5 text-center">
            <img
              src={article.image_url || article.thumbnail_url}
              alt={article.name}
              className="img-fluid rounded"
              style={{ width: "100%", maxWidth: "900px" }}
            />
          </div>
        )}

        {/* GRAPESJS CONTENT with styles scoped via wrapper */}
        <div
          id="gjs-content-wrapper"
          className="article-content"
          dangerouslySetInnerHTML={{ __html: article.contents }}
        />

        {/* Inject GrapesJS JS at bottom if present */}
        {gjsJS && (
          <script
            dangerouslySetInnerHTML={{ __html: gjsJS }}
          />
        )}
      </div>
    </>
  );
}

export async function getServerSideProps({ params, query, res }: any) {
  if (res) {
    res.setHeader("Cache-Control", "no-store, must-revalidate");
  }

  try {
    const previewQuery =
      query?.preview === "1" && query?.expires && query?.signature
        ? {
            preview: String(query.preview),
            expires: String(query.expires),
            signature: String(query.signature),
          }
        : undefined;

    const article = await fetchPublicArticleBySlug(params.slug, previewQuery);

    return {
      props: {
        pageData: {
          title: article.name,
          album: articleToAlbum(article),
        },
        article,
        isPreview: Boolean(article?.is_preview),
      },
    };
  } catch (error) {
    console.error("NewsDetailPage error:", error);
    return { notFound: true };
  }
}

NewsDetailPage.Layout = LandingPageLayout;