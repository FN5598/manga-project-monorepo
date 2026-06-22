import type { Genre } from "@appTypes/Genres";
import LoadingSpinner from "@shared/LoadingSpinner";
import { Funnel } from "lucide-react";
import type { SetStateAction } from "react";

type GenresSortCardProps = {
  genres: Genre[] | [];
  isSuccess: boolean;
  isLoading: boolean;
  isError: boolean;
  activeGenres: string[] | null;
  setActiveGenres: React.Dispatch<SetStateAction<string[] | null>>;
};

export default function GenresSortCard({
  genres,
  isSuccess,
  isLoading,
  isError,
  activeGenres,
  setActiveGenres,
}: GenresSortCardProps) {
  function handleGenreClick(genre: Genre) {
    if (activeGenres && activeGenres.some((g) => g === genre._id)) {
      const updatedGenres = activeGenres.filter((g) => g !== genre._id); // delete it from array
      return setActiveGenres(updatedGenres);
    }

    return setActiveGenres((prev) => [...prev, genre._id]);
  }

  if (isError) return <div>Something went wrong</div>;
  if (isLoading) return <LoadingSpinner />;

  if (isSuccess && genres && genres.length >= 1) {
    return (
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <section className="flex flex-row items-center gap-2">
          <Funnel className="h-5 w-5 shrink-0" />
          <span className="text-lg font-semibold">Filter by genre</span>
        </section>

        <section className="flex flex-wrap gap-2">
          {genres.map((genre) => (
            <button
              type="button"
              className={`${activeGenres ? (activeGenres.some((g) => g === genre._id) ? "genres-bg-checked" : "genres-bg-unchecked") : "genres-bg-unchecked"}`}
              onClick={() => handleGenreClick(genre)}
              key={genre._id}
            >
              {genre.name}
            </button>
          ))}
        </section>
      </div>
    );
  }

  return <div>No Genres to show</div>;
}
