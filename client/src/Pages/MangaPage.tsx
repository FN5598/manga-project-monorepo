import { useParams, NavLink } from "react-router-dom";
import { BookOpen, Bookmark, ChevronRight } from "lucide-react";
import { useGetMangaByIdQuery } from "../api/manga";
import { useFindChapterByMangaIdQuery } from "../api/chapter";
import LoadingSpinner from "../Components/UI/LoadingSpinner";
import Header from "../Components/Header";
import { timeAgo } from "..";

export default function MangaPage() {
  const { mangaId } = useParams();

  const {
    data: manga,
    isLoading: isLoadingManga,
    error: errorManga,
  } = useGetMangaByIdQuery({ mangaId: mangaId! });

  const {
    data: chapters,
    isLoading: isLoadingChapters,
    error: errorChapters,
  } = useFindChapterByMangaIdQuery({ mangaId: mangaId! });

  const isLoading = isLoadingManga || isLoadingChapters;
  const error = errorManga || errorChapters;

  return (
    <div className="min-h-screen bg-milkyWhite">
      <Header sticky={true} />

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 md:px-8 lg:px-10">
        {isLoading ? (
          <div className="flex min-h-[50vh] items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-600 shadow-sm">
            Failed to load manga details.
          </div>
        ) : manga ? (
          <div className="space-y-8">
            <section className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
              <div className="h-28 bg-midnight sm:h-36" />

              <div className="relative px-4 pb-6 sm:px-6 md:px-8">
                <div className="flex flex-col gap-6 md:flex-row md:items-start">
                  <div className="-mt-14 shrink-0 sm:-mt-20">
                    <img
                      src={manga.previewUrl}
                      alt={manga.title}
                      className="h-[220px] w-[160px] rounded-2xl object-cover shadow-xl ring-4 ring-white transition duration-300 md:h-[280px] md:w-[200px] hover:scale-[1.02]"
                    />
                  </div>

                  <div className="flex-1 pt-1 md:pt-6">
                    <div className="space-y-3">
                      <div>
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                          {manga.title}
                        </h1>
                        <p className="mt-1 text-sm font-medium text-cyan-700 sm:text-base">
                          by {manga.author}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {manga.genres?.map((genre) => (
                          <span
                            key={genre.name}
                            className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 sm:text-sm"
                          >
                            {genre.name}
                          </span>
                        ))}
                      </div>

                      <p className="max-w-4xl text-sm leading-7 text-zinc-600 sm:text-base">
                        {manga.description ||
                          "No description available for this manga yet."}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 pt-2">
                        {chapters && chapters[0] && chapters[0]._id && (
                          <NavLink
                            to={`/manga/${mangaId}/chapter/${chapters[0]._id}`}
                            className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 active:scale-[0.98]"
                          >
                            <BookOpen className="h-5 w-5" />
                            <span>Start Reading</span>
                          </NavLink>
                        )}

                        <button
                          type="button"
                          className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50 active:scale-[0.98]"
                        >
                          <Bookmark className="h-5 w-5" />
                          <span>Add to Library</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-zinc-200 bg-white shadow-sm">
              <div className="border-b border-zinc-200 px-4 py-4 sm:px-6">
                <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl">
                  Chapters
                </h2>
                <p className="mt-1 text-sm text-zinc-500">
                  {chapters?.length || 0} chapter
                  {chapters?.length === 1 ? "" : "s"} available
                </p>
              </div>

              {!chapters || chapters.length === 0 ? (
                <div className="px-4 py-10 text-center text-sm text-zinc-500 sm:px-6">
                  No chapters found for this manga.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[700px] border-collapse text-left">
                    <thead className="bg-zinc-50">
                      <tr className="text-xs uppercase tracking-wide text-zinc-500">
                        <th className="px-4 py-4 font-semibold sm:px-6">#</th>
                        <th className="px-4 py-4 font-semibold sm:px-6">
                          Chapter Name
                        </th>
                        <th className="px-4 py-4 font-semibold sm:px-6">
                          Released
                        </th>
                        <th className="px-4 py-4 font-semibold sm:px-6">
                          Views
                        </th>
                        <th className="px-4 py-4 font-semibold sm:px-6">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {chapters.map((chapter, index) => (
                        <tr
                          key={chapter._id}
                          className="border-t border-zinc-100 transition hover:bg-zinc-50"
                        >
                          <td className="px-4 py-4 text-sm font-medium text-zinc-700 sm:px-6">
                            {chapter.chapterNumber ?? index + 1}
                          </td>

                          <td className="px-4 py-4 sm:px-6">
                            <div className="font-medium text-zinc-900">
                              {chapter.title ||
                                `Chapter ${chapter.chapterNumber ?? index + 1}`}
                            </div>
                          </td>

                          <td className="px-4 py-4 text-sm text-zinc-500 sm:px-6">
                            {timeAgo(chapter.updatedAt)}
                          </td>

                          <td className="px-4 py-4 text-sm text-zinc-500 sm:px-6">
                            —
                          </td>

                          <td className="px-4 py-4 sm:px-6">
                            <NavLink
                              to={`/manga/${mangaId}/chapter/${chapter._id}`}
                              className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-cyan-700 transition hover:bg-cyan-50 hover:text-cyan-800"
                            >
                              Read
                              <ChevronRight className="h-4 w-4" />
                            </NavLink>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        ) : (
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-zinc-600 shadow-sm">
            Manga not found.
          </div>
        )}
      </main>
    </div>
  );
}
