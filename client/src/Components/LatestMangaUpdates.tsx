import { Clock } from "lucide-react";
import { Sort, timeAgo } from "..";
import LoadingSpinner from "./UI/LoadingSpinner";
import { NavLink } from "react-router-dom";
import { useFindAllChaptersQuery } from "../api/chapter";

export default function LatestchapterUpdates() {
  const {
    data: chapters,
    isLoading,
    error,
  } = useFindAllChaptersQuery({
    paginationInput: { limit: 10 },
    sort: { sortBy: Sort.ASC },
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
          chapters &&
          chapters.map((chapter, index) => (
            <NavLink
              key={chapter?._id}
              to={`/manga/${chapter?.mangaId}/chapter/${chapter?._id}`}
              className={`flex items-center justify-between px-6 py-4 transition hover:bg-slate-100 ${
                index !== chapters.length - 1
                  ? "border-b border-slate-200 rounded-t-xl"
                  : "rounded-b-xl"
              }`}
            >
              <div className="min-w-0">
                <p className="truncate text-lg font-semibold text-slate-900">
                  {chapter?.title}
                </p>
                <p>Chapter {chapter?.chapterNumber}</p>
              </div>

              <span className="ml-4 shrink-0 text-sm text-slate-500">
                {chapter?.updatedAt && timeAgo(chapter.updatedAt)}
              </span>
            </NavLink>
          ))}
      </div>
    </>
  );
}
