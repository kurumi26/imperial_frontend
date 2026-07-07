import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Public/front-end template styles */}
        <link rel="stylesheet" href="/css/public-css.css" />
        <link rel="stylesheet" href="/css/product.css" />
        <link rel="stylesheet" href="/css/banner.css" />
        <link rel="stylesheet" href="/css/navigation.css" />
        <link rel="stylesheet" href="/css/public-overrides.css" />
        <link rel="stylesheet" href="/css/custom.css" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
