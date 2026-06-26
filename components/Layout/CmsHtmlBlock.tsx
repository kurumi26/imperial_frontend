import React, { useEffect, useState } from "react";

type CmsHtmlBlockProps = {
  html: string;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
};

/**
 * Renders GrapesJS HTML only after mount to avoid SSR/client DOM normalization mismatches.
 */
export default function CmsHtmlBlock({
  html,
  className,
  as: Tag = "div",
}: CmsHtmlBlockProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!html?.trim()) return null;
  if (!mounted) return null;

  return (
    <Tag
      className={className}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
