import { NavLink } from "react-router-dom";
import { useGetAllMangasQuery } from "../api/manga";
import LoadingSpinner from "./UI/LoadingSpinner";
import { BookOpen } from "lucide-react";
import { Sort } from "..";
import { capitalizeFirstLetter } from "..";

export default function FeaturedMangaCard() {
  const {
    data: mangas,
    isLoading,
    error,
  } = useGetAllMangasQuery({
    paginationInput: { limit: 10 },
    sort: { sortBy: Sort.DESC },
  });

  return (
    <>
      <div className="flex flex-row justify-between items-center mb-5 mt-10">
        <h1 className="text-black font-bold text-2xl">Featured Manga</h1>
        <NavLink className="text-black font-medium" to="/browse">
          View All
        </NavLink>
      </div>

      <section className="flex flex-row gap-2">
        {isLoading && <LoadingSpinner />}
        {error && <div>Error</div>}
        {!isLoading &&
          !error &&
          mangas &&
          mangas.map((manga) => (
            <div
              key={manga._id}
              className="w-[240px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
            >
              <NavLink to={`/manga/${manga._id}`} className="block p-3 pb-0">
                <div className="relative overflow-hidden rounded-2xl">
                  <img
                    src={manga.previewUrl}
                    alt={manga.title}
                    className="h-[290px] w-full rounded-2xl object-cover cursor-pointer transition-transform duration-300 ease-out hover:scale-110"
                  />

                  <span className="absolute right-3 top-3 rounded-md bg-slate-950 p-2 py-1 text-xs font-light text-white shadow">
                    {capitalizeFirstLetter(manga.status)}
                  </span>
                </div>
              </NavLink>
              <div className="p-4 flex flex-col gap-2">
                <h3 className="truncate text-[18px] font-semibold text-slate-950">
                  {manga.title}
                </h3>
                <p className="text-[15px] text-slate-500">{manga.author}</p>

                <div className="flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4" />
                  <span>{manga.chaptersCount} Ch</span>
                </div>
              </div>
            </div>
          ))}
      </section>
    </>
  );
}
