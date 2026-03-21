import { Clock } from "lucide-react";
import { useGetAllMangasQuery } from "../api/manga";
import { Sort, timeAgo } from "..";
import LoadingSpinner from "./UI/LoadingSpinner";
import { NavLink } from "react-router-dom";

export default function LatestMangaUpdates() {
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
      <div className="flex flex-row gap-2 items-center mb-5 mt-10">
        <Clock className="h-7 w-7" />
        <h1 className="text-2xl font-bold text-black">Latest Updates</h1>
      </div>
      <div className="border border-slate-400 rounded-xl">
        {isLoading && <LoadingSpinner />}
        {error && <div>Error</div>}
        {!isLoading &&
          !error &&
          mangas?.map((manga, index) => (
            <NavLink
              key={manga._id}
              to={`/manga/${manga._id}`}
              className={`flex items-center justify-between px-6 py-4 transition hover:bg-slate-100 rounded-xl${
                index !== mangas.length - 1 ? "border-b border-slate-200" : ""
              }`}
            >
              <div className="min-w-0">
                <p className="truncate text-lg font-semibold text-slate-900">
                  {manga.title}
                </p>
              </div>

              <span className="ml-4 shrink-0 text-sm text-slate-500">
                {timeAgo(manga.updatedAt)}
              </span>
            </NavLink>
          ))}
      </div>
    </>
  );
}
