import React, { useEffect, useState } from "react";
import TestimonialSection from '@/components/Layout/TestimonialSection';
import { getPublicPageBySlug, PublicAlbum, PublicPage } from "@/services/publicPageService";
import { getPublicArticles } from "@/services/articleService";
import { getProducts } from "@/services/productService";
import LandingPageLayout from "@/components/Layout/GuestLayout";

export const BANNER_TITLE = "Imperial PVC";

export async function getServerSideProps() {
    try {
        // fetch page config and latest news concurrently
        const [pageRes, articlesRes] = await Promise.all([
            getPublicPageBySlug("home"),
            getPublicArticles({ per_page: 3 }),
        ]);

        // fetch latest products (limit 4)
        let products: any[] = [];
        /*
        try {
            const prodRes = await getProducts({ per_page: 4 });
            const data = prodRes?.data ?? prodRes;
            if (Array.isArray(data)) {
                products = data;
            } else {
                products = data?.data ?? data?.items ?? data?.rows ?? [];
            }
        } catch (e) {
            // ignore; leave products empty for now
        }
        */

        console.log("[SSR] landing page products count", products.length);
        console.log("[SSR] pageData keys:", Object.keys(pageRes.data ?? {}));
        console.log("[SSR] content preview:", String(pageRes.data?.content ?? "").slice(0, 200));

        return {
            props: {
                pageData: pageRes.data ?? null,
                news: articlesRes.data?.data ?? [],
                products,
            },
        };
    } catch (error) {
        console.error("Error fetching page data:", error);
        return { notFound: true };
    }
}

interface LandingPageLayoutProps {
  children?: React.ReactNode;
  pageData?: PublicPage;
  news?: any[];
  products?: any[];
  layout?: {
    fullWidth?: boolean;
  };
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
                        <a href="/public/news" className="btn btn-danger mt-4 w-20">Learn More</a>
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
                .nav-button { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.45); color: #fff; border: none; padding: 8px 12px; font-size: 20px; border-radius: 6px; cursor: pointer; padding-top: 4px; }
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

/**
 * Safely resolves pageData.content to a clean HTML string.
 * Handles: string HTML, JSON-encoded string, plain object (TipTap/Slate JSON), null/undefined.
 */
function resolvePageContent(content: any): string {
    if (!content) return "";

    // Already a plain HTML string
    if (typeof content === "string") {
        const trimmed = content.trim();
        if (!trimmed) return "";

        // Try to parse in case it's a JSON-encoded string (e.g. '"<p>hello</p>"')
        try {
            const parsed = JSON.parse(trimmed);
            if (typeof parsed === "string") return parsed;
            // It parsed into an object — fall through to object handling below
            return JSON.stringify(parsed); // last resort
        } catch {
            // Not JSON — treat as raw HTML string
            return trimmed;
        }
    }

    // Object (e.g. TipTap/ProseMirror JSON) — return empty; adapt if your CMS provides a serializer
    if (typeof content === "object") {
        // If your CMS uses a serializer like @tiptap/html, call it here:
        // import { generateHTML } from '@tiptap/html';
        // return generateHTML(content, [...extensions]);

        // Fallback: return nothing rather than showing raw JSON to users
        console.warn("[resolvePageContent] content is an object; provide a serializer for rich-text JSON.", content);
        return "";
    }

    return "";
}

export default function Home({ pageData, news, products = [] }: LandingPageLayoutProps) {
    const [clientProducts, setClientProducts] = useState<any[]>(products);

    // If SSR didn't supply any products, try fetching on the client
    useEffect(() => {
        if (clientProducts && clientProducts.length) return;
        let cancelled = false;

        const extractArray = (payload: any): any[] => {
            if (!payload) return [];
            let data: any = payload?.data ?? payload;
            if (data && typeof data === "object" && !Array.isArray(data) && "data" in data) {
                data = (data as any).data;
                if (data && typeof data === "object" && !Array.isArray(data) && "data" in data) {
                    data = (data as any).data;
                }
            }
            if (Array.isArray(data)) return data;
            const candidates = [
                (data as any)?.items,
                (data as any)?.rows,
                (data as any)?.results,
                (data as any)?.result,
                (data as any)?.products,
                (data as any)?.categories,
                (data as any)?.product_categories,
                (data as any)?.productCategories,
                (data as any)?.productCategory,
            ];
            for (const c of candidates) {
                if (Array.isArray(c)) return c;
                if (c && typeof c === "object" && Array.isArray((c as any).data)) return (c as any).data;
            }
            return [];
        };

        const fetchClient = async () => {
            try {
                const { axiosInstance } = await import("@/services/axios");
                const eps = ["/public-products"];
                for (const ep of eps) {
                    try {
                        const resp = await axiosInstance.get(ep, { params: { per_page: 4 }, headers: { "X-No-Loading": true } });
                        const arr = extractArray(resp.data);
                        if (arr && arr.length) {
                            if (!cancelled) setClientProducts(arr.slice(0, 4));
                            break;
                        }
                    } catch {
                        // continue to next endpoint
                    }
                }
            } catch {
                // ignore
            }
        };

        fetchClient();
        return () => { cancelled = true; };
    }, [clientProducts]);

    const descriptors = ["Modern", "Real Estate", "Business"];
    const [descIndex, setDescIndex] = useState(0);

    useEffect(() => {
        const id = setInterval(() => {
            setDescIndex(i => (i + 1) % descriptors.length);
        }, 2500);
        return () => clearInterval(id);
    }, []);

    // Resolve page content once — handles string HTML, JSON strings, objects, null
    const pageHtmlContent = resolvePageContent(pageData?.content);

    return (
        <div>
            <div className="w-100 base-content">

                {/* ── Products Section ── */}
                <div className="container py-5 text-center cutter-section">

                    <div className="heading-block text-center border-0" data-heading="P">
                        <h2 className="fs-1 fw-bold">Our Products</h2>
                    </div>

                    <div className="w-100 cutter-title">
                        <p className="fs-5 fw-light text-secondary py-3 w-50 text-center mx-auto">
                            Imperial PVC delivers durable, high-quality PVC solutions engineered for strength, style, and long-lasting performance.
                            Designed for{" "}
                            <span id="description-animate" aria-live="polite" style={{ color: '#ff7b00' }}>
                                {descriptors[descIndex]}
                            </span>{" "}
                            construction and everyday reliability.
                        </p>
                    </div>

                    <div className="w-100 products-container-lines">
                        <div className="d-flex flex-column flex-md-row flex-md-wrap flex-lg-nowrap gap-4 justify-content-center">
                            {clientProducts.map((p) => {
                                const img = p.image_url || p.image || "/images/logo.png";
                                const href = `/public/product/${p.slug ?? p.id}`;
                                return (
                                    <div key={p.id ?? p.slug} className="col-6 col-md-3 mx-auto">
                                        <div className="card rounded-2 shadow-sm animate-hov">
                                            <img
                                                src={img}
                                                className="border-bottom"
                                                alt={p.name || p.title || "Product"}
                                                style={{
                                                    minHeight: "150px",
                                                    maxHeight: "150px",
                                                    borderTopLeftRadius: "4px",
                                                    borderTopRightRadius: "4px",
                                                    objectFit: "cover",
                                                    width: "100%",
                                                }}
                                            />
                                            <div className="py-4 px-3 text-start">
                                                <h3
                                                    className="fs-6 fw-bold"
                                                    style={{
                                                        display: "-webkit-box",
                                                        WebkitLineClamp: 1,
                                                        WebkitBoxOrient: "vertical",
                                                        overflow: "hidden",
                                                    }}
                                                >
                                                    {p.name || p.title || p.slug}
                                                </h3>
                                                <p
                                                    className="fs-6 fw-light text-secondary"
                                                    style={{
                                                        display: "-webkit-box",
                                                        WebkitLineClamp: 1,
                                                        WebkitBoxOrient: "vertical",
                                                        overflow: "hidden",
                                                    }}
                                                >
                                                    {(p.description ?? p.teaser ?? p.summary ?? "").toString()}
                                                </p>
                                                <a href={href} className="fw-bold text-orange text-decoration-none">Read More</a>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            {clientProducts.length === 0 && (
                                <p className="txt14">No featured products available.</p>
                            )}
                        </div>
                        <a href="/public/products" className="btn btn-danger text-white fw-light fs-6 mt-5">See More..</a>
                    </div>

                </div>

                {/* ── CMS Page Content from Dashboard Editor ──
                    Only rendered when content is a non-empty string.
                    resolvePageContent() handles: raw HTML strings, JSON-encoded strings,
                    and rich-text objects (add a serializer for the last case).
                ── */}
                {pageHtmlContent ? (
                    <div
                        className="w-100 page-content cms-content"
                        dangerouslySetInnerHTML={{ __html: pageHtmlContent }}
                    />
                ) : null}

                {/* ── What's New Section ── */}
                <div className="w-100 cutter-section">

                    <div className="heading-block text-center border-0 mt-5 cutter-title" data-heading="W">
                        <h2 className="fs-1 fw-bold">What's New</h2>
                    </div>

                    <div className="work-slider mt-5">
                        {(() => {
                            const articles = news ?? [];

                            const slides: Slide[] = articles.length > 0
                                ? articles.map((a: any) => ({
                                    image: a.thumbnail_url
                                        ? a.thumbnail_url
                                        : (a.image_url ?? '/images/highlights/diamond_pvc.jpg'),
                                    title: a.name || a.title || '',
                                    desc: a.teaser || a.excerpt || '',
                                }))
                                : [
                                    {
                                        image: '/images/highlights/diamond_pvc.jpg',
                                        title: 'Quality PVC Products',
                                        desc: 'Durable, attractive PVC solutions for modern builds.'
                                    },
                                    {
                                        image: '/images/highlights/armstrong_pvc.jpg',
                                        title: 'Precision Manufacturing',
                                        desc: 'Engineered for strength and consistent performance.'
                                    },
                                    {
                                        image: '/images/highlights/blue_pvc.jpg',
                                        title: 'Trusted by Professionals',
                                        desc: 'Proven in large-scale and residential projects.'
                                    }
                                ];

                            return <Slider slides={slides} />;
                        })()}
                    </div>

                </div>

                {/* ── CTA Banner ── */}
                <div
                    className="w-100 my-5 py-5 cutter-section"
                    style={{ background: "linear-gradient(90deg, #FF0000, #FF4500, #FFA500)" }}
                >
                    <h5 className="text-white text-center fs-2">
                        We offer the best PVC solutions in the market. See our{" "}
                        <b>
                            <a href="/public/products" className="text-white fw-bold fs-3">Product List</a>
                        </b>
                    </h5>
                </div>

                {/* ── Testimonials ── */}
                <div className="w-100 testimonial-section cutter-section">
                    <TestimonialSection />
                </div>

            </div>

            {/* Scoped styles for CMS-injected content */}
            <style jsx global>{`
                .cms-content img { max-width: 100%; height: auto; }
                .cms-content h1,
                .cms-content h2,
                .cms-content h3 { font-weight: bold; margin-bottom: 0.5rem; }
                .cms-content p { margin-bottom: 1rem; line-height: 1.7; }
                .cms-content a { color: #ff7b00; text-decoration: underline; }
                .cms-content ul,
                .cms-content ol { padding-left: 1.5rem; margin-bottom: 1rem; }
                .cms-content table { width: 100%; border-collapse: collapse; margin-bottom: 1rem; }
                .cms-content table td,
                .cms-content table th { border: 1px solid #dee2e6; padding: 0.5rem 0.75rem; }
            `}</style>
        </div>
    );
}

Home.Layout = LandingPageLayout;