import Header from "../Components/Header";
import DiscoverMangaCard from "../Components/DiscoverMangaCard";
import TrendingGenres from "../Components/UI/TrendingGenres";
import FeaturedMangaCard from "../Components/FeaturedMangaCard";
import LatestMangaUpdates from "../Components/LatestMangaUpdates";

export default function DiscoverPage() {
  return (
    <>
      <Header />
      <div className="px-4 sm:px-10 md:px-20 lg:px-40 xl:px-80 mb-20">
        <DiscoverMangaCard />

        <TrendingGenres />

        <FeaturedMangaCard />

        <LatestMangaUpdates />
      </div>
    </>
  );
}
