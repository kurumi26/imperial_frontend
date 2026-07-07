import LandingTopbar from "./_Topbar";
import CmsFooter from "./_Footer";
import Banner from "./_Banner";
import { PublicAlbum } from "@/services/publicPageService";
import ToastHost from "@/components/UI/ToastHost";
import Header from "@/components/Layout/_Header";

interface LandingPageLayoutProps {
  children: React.ReactNode;
  pageData?: {
    title?: string;
    album?: PublicAlbum | null;
  };
  layout?: {
    fullWidth?: boolean;
    hideFooter?: boolean;
  };
}

export default function LandingPageLayout({
  children,
  pageData,
  layout,
}: LandingPageLayoutProps) {
  const contentWrapperClassName = layout?.fullWidth
    ? "container-fluid px-0"
    : "";

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* <LandingTopbar />**/}
      <Header/>
      <Banner
        title={pageData?.title}
        album={pageData?.album}
      />

      <main className="flex-grow-1 py-5">
        <div className={contentWrapperClassName}>{children}</div>
      </main>

      {!layout?.hideFooter && <CmsFooter />}

      <ToastHost />
    </div>
  );
}
