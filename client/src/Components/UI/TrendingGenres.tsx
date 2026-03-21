import { useGetAllGenresQuery } from "../../api/genres";
import LoadingSpinner from "./LoadingSpinner";
import { TrendingUp } from "lucide-react";

export default function TrendingGenres() {
  const { data: genres, isLoading, error } = useGetAllGenresQuery();
  // TODO add real logic
  const trendingGenres = genres ? genres?.slice(0, 10) : [];
  if (error) return <div>Error loading genres</div>;
  if (isLoading) return <LoadingSpinner />;
  return (
    <>
      <div className="text-black flex flex-row items-center gap-2 mb-5 mt-10">
        <TrendingUp className="w-7 h-7" />
        <label className="text-3xl font-semibold">Trending Genres</label>
      </div>

      {trendingGenres.map((genre) => (
        <div className="flex flex-row genres-bg-unchecked" key={genre._id}>
          {genre.name}
        </div>
      ))}
    </>
  );
}
