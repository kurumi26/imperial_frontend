import { useEffect, useState } from "react";
import { getPublicPageBySlug } from "@/services/publicPageService";
import { resolvePageContent, resolvePageStyles } from "@/lib/cmsPageContent";

export default function CmsFooter() {
  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");
  const [bgUrl, setBgUrl] = useState<string>("");

  useEffect(() => {
    getPublicPageBySlug("footer")
      .then((res) => {
        const pageData = res.data;
        if (!pageData) return;

        setHtml(resolvePageContent(pageData));
        const resolvedCss = resolvePageStyles(pageData);
        setCss(resolvedCss);

        const bgMatch = resolvedCss.match(/background-image\s*:\s*url\(([^)]+)\)/i);
        if (bgMatch?.[1]) {
          const raw = bgMatch[1].trim().replace(/^['"]|['"]$/g, "");
          setBgUrl(raw);
        } else {
          setBgUrl("");
        }
      })
      .catch(() => {
        setHtml("");
        setCss("");
        setBgUrl("");
      });
  }, []);

  if (!html) return null;

  return (
    <>
      {css ? <style id="cms-footer-styles" dangerouslySetInnerHTML={{ __html: css }} /> : null}
      {bgUrl ? (
        <style
          id="cms-footer-bg-fallback"
          dangerouslySetInnerHTML={{
            __html: `
              .cms-footer-content .footer{
                background-image: url("${bgUrl}") !important;
                background-repeat: repeat !important;
                background-position: center center !important;
              }
            `,
          }}
        />
      ) : null}
      <div className="cms-footer-content" dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
