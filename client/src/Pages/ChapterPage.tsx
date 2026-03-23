import { useEffect, useRef, useState } from "react";
import Header from "../Components/Header";
import LoadingSpinner from "../Components/UI/LoadingSpinner";
import ReaderPage from "../Components/UI/PageReader";
import { useFindChapterByIdQuery } from "../api/chapter";
import { useLazyGetPagesByChapterIdQuery } from "../api/page";
import { useParams } from "react-router-dom";

type Page = {
  _id: string;
  pageUrl: string;
};

const LIMIT = 10;

export default function ChapterPage() {
  const { chapterId } = useParams();

  const [apiPage, setApiPage] = useState(1);
  const [allPages, setAllPages] = useState<Page[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const {
    data: chapter,
    error: errorChapter,
    isLoading: isLoadingChapter,
  } = useFindChapterByIdQuery({ chapterId: chapterId! }, { skip: !chapterId });

  const [getPagesTrigger, { error: errorPages }] =
    useLazyGetPagesByChapterIdQuery();

  const error = errorChapter || errorPages;

  // Reset when chapter changes
  useEffect(() => {
    setApiPage(1);
    setAllPages([]);
    setHasMore(true);
  }, [chapterId]);

  // Fetch whenever page changes
  useEffect(() => {
    if (!chapterId || !hasMore) return;

    let cancelled = false;

    async function loadPage() {
      try {
        setIsFetchingMore(true);

        const result = await getPagesTrigger(
          {
            chapterId: chapterId!,
            paginationInput: { page: apiPage, limit: LIMIT },
          },
          true,
        ).unwrap();

        if (cancelled) return;

        const newPages = (result ?? []) as Page[];

        setAllPages((prev) => {
          if (apiPage === 1) return newPages;

          const existingIds = new Set(prev.map((p) => p._id));
          const deduped = newPages.filter((p) => !existingIds.has(p._id));
          return [...prev, ...deduped];
        });

        if (newPages.length < LIMIT) {
          setHasMore(false);
        }
      } catch (err) {
        console.error("Failed to fetch pages:", err);
      } finally {
        if (!cancelled) {
          setIsFetchingMore(false);
        }
      }
    }

    loadPage();

    return () => {
      cancelled = true;
    };
  }, [chapterId, apiPage, hasMore, getPagesTrigger]);

  // Observe the sentinel
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore || isFetchingMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetchingMore && hasMore) {
          setApiPage((prev) => prev + 1);
        }
      },
      {
        root: null,
        rootMargin: "300px 0px",
        threshold: 0,
      },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, isFetchingMore, allPages.length]);

  const isInitialLoading =
    isLoadingChapter || (allPages.length === 0 && isFetchingMore);

  return (
    <div className="min-h-screen bg-black text-zinc-100">
      <Header sticky={false} />

      <main className="mx-auto w-full max-w-5xl px-2 pb-10 pt-4 sm:px-4">
        <div className="top-0 z-20 mb-6 rounded-xl border border-zinc-800/80 bg-zinc-950/85 backdrop-blur">
          <div className="flex items-center justify-between gap-4 px-4 py-3">
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                Reader
              </p>

              <h1 className="truncate text-base font-semibold sm:text-lg">
                {chapter
                  ? `Chapter ${chapter.chapterNumber}${
                      chapter.title ? ` — ${chapter.title}` : ""
                    }`
                  : "Chapter"}
              </h1>

              {chapter && (
                <p className="text-sm text-zinc-400">
                  {chapter.pageCount} page{chapter.pageCount !== 1 ? "s" : ""}
                </p>
              )}
            </div>

            <div className="hidden shrink-0 items-center gap-2 sm:flex">
              <button className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-300 transition hover:border-zinc-500 hover:bg-zinc-800">
                Prev
              </button>
              <button className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-300 transition hover:border-zinc-500 hover:bg-zinc-800">
                Next
              </button>
            </div>
          </div>
        </div>

        {isInitialLoading && (
          <div className="flex min-h-[50vh] items-center justify-center">
            <LoadingSpinner />
          </div>
        )}

        {error && !isInitialLoading && (
          <div className="mx-auto max-w-2xl rounded-xl border border-red-500/20 bg-red-500/10 p-5 text-center">
            <h2 className="text-lg font-semibold text-red-300">
              Failed to load chapter
            </h2>
            <p className="mt-1 text-sm text-red-200/80">
              Something went wrong while loading the pages.
            </p>
          </div>
        )}

        {!error && !isInitialLoading && allPages.length === 0 && (
          <div className="mx-auto max-w-2xl rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 text-center text-zinc-400">
            No pages found.
          </div>
        )}

        {!error && allPages.length > 0 && (
          <section className="space-y-2">
            {allPages.map((page) => (
              <ReaderPage
                key={page._id}
                src={page.pageUrl}
                alt={`${chapter?.title ?? "chapter"}-${page._id}`}
              />
            ))}

            {hasMore && (
              <div
                ref={sentinelRef}
                className="flex h-10 items-center justify-center"
              >
                {isFetchingMore && <LoadingSpinner />}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
