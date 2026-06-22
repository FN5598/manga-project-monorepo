import Header from "@shared/Header";
import DiscoverMangaCard from "./DiscoverMangaCard";
import TrendingGenres from "@shared/TrendingGenres";
import FeaturedMangaCard from "./FeaturedMangaCard";
import LatestMangaUpdates from "./LatestMangaUpdates";

export default function DiscoverPage() {
  return (
    <>
      <Header sticky={true} />
      <div className="px-4 sm:px-10 md:px-20 lg:px-40 xl:px-80 mb-20">
        <DiscoverMangaCard />

        <TrendingGenres />

        <FeaturedMangaCard />

        <LatestMangaUpdates />
      </div>
    </>
  );
}
