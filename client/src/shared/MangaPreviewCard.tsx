import type { SerializedError } from "@reduxjs/toolkit";
import { capitalizeFirstLetter } from "../lib";
import type { Manga } from "../../features/manga";
import LoadingSpinner from "./LoadingSpinner";
import { BookOpen } from "lucide-react";
import { NavLink } from "react-router-dom";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

type MangaPreviewCardProps = {
  isLoading: boolean;
  error: FetchBaseQueryError | SerializedError | undefined;
  mangas: Manga[] | undefined;
  visitedMangas?: { id: string; chapter: string }[];
};

export default function MangaPreviewCard({
  isLoading,
  error,
  mangas,
  visitedMangas,
}: MangaPreviewCardProps) {
  function mapChapterIdsToMangaIds(mangaId: string): string {
    const match = visitedMangas?.find((manga) => manga.id === mangaId);

    if (!match) return `/manga/${mangaId}`;

    return `/manga/${mangaId}/chapter/${match.chapter}`;
  }

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fill,240px)]">
      {isLoading && <LoadingSpinner />}
      {error && <div>Error</div>}

      {!isLoading &&
        !error &&
        mangas?.map((manga) => (
          <div
            key={manga._id}
            className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md lg:w-[240px]"
          >
            <NavLink
              to={
                visitedMangas
                  ? mapChapterIdsToMangaIds(manga._id)
                  : `/manga/${manga._id}`
              }
              className="block p-3 pb-0"
            >
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src={manga.previewUrl}
                  alt={manga.title}
                  className="h-[320px] w-full cursor-pointer rounded-2xl object-cover transition-transform duration-300 ease-out hover:scale-110 sm:h-[300px] lg:h-[290px]"
                />

                <span className="absolute right-3 top-3 rounded-md bg-slate-950 p-2 py-1 text-xs font-light text-white shadow">
                  {capitalizeFirstLetter(manga.status)}
                </span>
              </div>
            </NavLink>

            <div className="flex flex-col gap-2 p-4">
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
  );
}
