import { PublicAlbum } from "@/services/publicPageService";
import MainBanner from "./MainBanner";
import PageBanner from "./PageBanner";

interface BannerProps {
  title?: string;
  subtitle?: string;
  album?: PublicAlbum | null;
}

export default function Banner({
  title,
  subtitle,
  album,
}: BannerProps) {
  if (!album || title == "News" || title == "Products") {
    return (
      <section
        className="text-white bg-black"
      >
        <div
          className="container"
          style={{
            minHeight: 100,
          }}
        />
      </section>
    );
  }

  if (album.type === "main_banner") {
    return <MainBanner album={album} />;
  }
  console.log(title);
  return (
    <PageBanner
      title={title}
      subtitle={subtitle}
      album={album}
    />
  );

}
