import React, { useEffect, useState } from "react";
import LandingTopbar from "./_Topbar";
import GlobalFooter from "./GlobalFooter";
import Banner from "./_Banner";
import ToastHost from "@/components/UI/ToastHost";
import Head from "next/head";
import Base from "@/pages/base";
import Header from "@/components/Layout/_Header";
import { getPublicPageBySlug, PublicAlbum } from "@/services/publicPageService";
import { getPublicArticles } from "@/services/articleService";

// interface LandingPageLayoutProps {
//   children: React.ReactNode;
//   pageData?: {
//     title?: string;
//     album?: PublicAlbum | null;
//   };
//   layout?: {
//     fullWidth?: boolean;
//   };
// }

// Page-level banner control. Change this value to control the banner title shown on this page.
export const BANNER_TITLE = "Imperial PVC";

export async function getServerSideProps() {
    try {
        const [pageRes, articlesRes] = await Promise.all([
            getPublicPageBySlug("home"),
            getPublicArticles({ per_page: 3 }),
        ]);

        return {
            props: {
                pageData: pageRes.data,
                news: articlesRes.data?.data ?? [],
            },
        };
    } catch (error) {
        console.error("Error fetching page data:", error);
        return { notFound: true };
    }
}

interface LandingPageLayoutProps {
  children: React.ReactNode;
  pageData?: {
    title?: string;
    album?: PublicAlbum | null;
  };
  layout?: {
    fullWidth?: boolean;
  };
    news?: any[];
}

type Slide = {
    image: string;
    title: string;
    desc: string;
};

function Slider({ slides }: { slides: Slide[] }) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const id = setInterval(() => setIndex(i => (i + 1) % slides.length), 4000);
        return () => clearInterval(id);
    }, [slides.length]);

    const prev = () => setIndex(i => (i - 1 + slides.length) % slides.length);
    const next = () => setIndex(i => (i + 1) % slides.length);

    return (
        <div className="slider-root">
            <div className="slide d-flex align-items-center">
                <div className="slide-image" style={{ width: '60%' }}>
                    <img src={slides[index].image} alt={slides[index].title} className="img-fluid" />
                </div>
                <div className="slide-info p-4" style={{ width: '40%' }}>
                    <h3 className="fs-3 fw-bold">{slides[index].title}</h3>
                    <p className="fs-6 text-secondary">{slides[index].desc}</p>
                    <div>
                        <button className="btn btn-danger mt-4 w-20">Learn More</button>
                    </div>
                </div>
            </div>

            <button aria-label="Previous" onClick={prev} className="nav-button prev">‹</button>
            <button aria-label="Next" onClick={next} className="nav-button next">›</button>

            <div className="indicators mt-3 text-center">
                {slides.map((_, i) => (
                    <span key={i} onClick={() => setIndex(i)} className={`indicator ${i === index ? 'active' : ''}`}></span>
                ))}
            </div>

            <style jsx>{`
                .slider-root { position: relative; max-width: 1280px; margin: 0 auto; }
                .slide { gap: 20px; }
                .slide-image img { width: 100%; height: 360px; object-fit: cover; border-radius: 8px; }
                .slide-info { display: flex; flex-direction: column; justify-content: center; }
                .nav-button { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.45); color: #fff; border: none; padding: 8px 12px; font-size: 20px; border-radius: 6px; cursor: pointer;  padding-top: 4px; }
                .nav-button.prev { left: 8px; }
                .nav-button.next { right: 8px; }
                .indicators { display:flex; justify-content:center; gap:8px; }
                .indicator { width:10px; height:10px; border-radius:50%; background:#ddd; display:inline-block; cursor:pointer; }
                .indicator.active { background:#ff7b00; }
                @media(max-width: 768px) {
                    .slide { flex-direction: column; }
                    .slide-image img { height: 220px; }
                    .slide-image, .slide-info { width: 100% !important; }
                }
            `}</style>
        </div>
    );
}

export default function LandingPageLayout({
  children,
  pageData,
  layout,
  news,
}: LandingPageLayoutProps) {
  const contentWrapperClassName = layout?.fullWidth
    ? "container-fluid px-0"
    : "container";
console.log(children);
  return (
    <div className="d-flex flex-column min-vh-100">
      <Head>
        {/* Public/front-end template styles only (kept out of admin pages) */}
        {/* <link rel="stylesheet" href="/css/public-css.css" /> */}
        <link rel="stylesheet" href="/css/custom.css" />
        {/* <link rel="stylesheet" href="/css/product.css" /> */}
        {/* <link rel="stylesheet" href="/css/banner.css" />
        <link rel="stylesheet" href="/css/navigation.css" />
        <link rel="stylesheet" href="/css/public-overrides.css" /> */}
      </Head>

      {/* <LandingTopbar /> */}

      <Header />

      <Banner
        title={pageData?.title}
        album={pageData?.album}
      />

      <main className="flex-grow-1 py-5 base-content">
        {pageData?.title !== 'Home' ? children : <Base pageData={pageData} news={news || []} children={children} />}
      </main>

      <GlobalFooter />

      <ToastHost />
    </div>
  );
}
