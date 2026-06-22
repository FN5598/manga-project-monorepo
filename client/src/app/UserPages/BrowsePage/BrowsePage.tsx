import { useEffect, useState } from "react";
import Header from "@shared/Header";
import { useGetAllGenresQuery } from "@api/genresApi";
import MangaPreviewCard from "@shared/MangaPreviewCard";
import { useLazyGetAllMangasQuery } from "@api/mangaApi";
import { MangaFilterFields } from "@appTypes/index";
import { useDebounce } from "@hooks/useDebounce";
import { useSearchParams } from "react-router-dom";
import { Input } from "@components/ui/input";
import GenresSortCard from "./GenresSortCard";
import PageLimitButtons from "./PageLimitButtons";

export default function BrowsePage() {
  function transformGenresParams(param: string): string[] {
    if (!param) return [];

    return param.substring(0, param.length).split(", ");
  }

  const [searchParams, setSearchParams] = useSearchParams();
  const genreParams = searchParams.get("genres");
  const titleParam = searchParams.get("title");
  const pageParam = searchParams.get("page");
  const [mangaTitle, setMangaTitle] = useState<string>(
    titleParam ? titleParam : "",
  );
  const [activeGenres, setActiveGenres] = useState<string[] | null>(
    genreParams ? transformGenresParams(genreParams) : [],
  );

  const {
    data: genres = [],
    isSuccess: isGenresSuccess,
    isLoading: isGenresLoading,
    isError: isGenresError,
  } = useGetAllGenresQuery();

  const [page, setPage] = useState(
    pageParam ? (Number.isNaN(Number(pageParam)) ? Number(pageParam) : 1) : 1,
  );
  const limit = 10;

  const debouncedTitle = useDebounce(
    typeof mangaTitle === "string" ? mangaTitle.toLowerCase() : "",
    500,
  );
  const [
    getAllMangas,
    { data: mangaPage, isFetching: isMangasLoading, error: isMangasError },
  ] = useLazyGetAllMangasQuery();
  const mangas = mangaPage?.mangas ?? [];
  const mangaCount = mangaPage?.mangaCount ?? 0;
  const totalPages = Math.ceil((mangaCount ?? 0) / limit);

  useEffect(() => {
    getAllMangas({
      paginationInput: {
        limit,
        page,
      },
      filters: [
        {
          field: MangaFilterFields.TITLE,
          value: debouncedTitle ? [debouncedTitle] : [],
        },
        {
          field: MangaFilterFields.GENRES,
          value: activeGenres ?? [],
        },
      ],
    });

    setSearchParams(
      (params) => {
        if (debouncedTitle) {
          params.set("title", debouncedTitle);
        } else {
          params.delete("title");
        }

        if (activeGenres?.length) {
          params.set("genres", activeGenres.toString());
        } else {
          params.delete("genres");
        }

        params.set("page", String(page));
        return params;
      },
      { replace: true },
    );

    // Reset page after each new request
    setPage(1);
  }, [
    getAllMangas,
    debouncedTitle,
    activeGenres,
    page,
    setSearchParams,
    setPage,
  ]);

  return (
    <>
      <Header sticky={true} />
      <div className="mx-auto mt-4 flex w-full max-w-7xl flex-col gap-6 px-4 pb-8 sm:px-6 lg:gap-8 lg:px-12">
        <section className="space-y-2">
          <h1 className="text-2xl font-bold sm:text-3xl">Browse manga</h1>
          <span className="block text-sm text-gray sm:text-base">
            Explore our extensive catalog of manga series
          </span>
        </section>

        <section className="relative flex flex-1 flex-col">
          <Input
            placeholder={`Search for manga titles, authors or characters`}
            name="mangaTitle"
            value={mangaTitle ?? ""}
            onChange={(e) => setMangaTitle(e.target.value)}
          />
        </section>

        <GenresSortCard
          genres={genres}
          isLoading={isGenresLoading}
          isSuccess={isGenresSuccess}
          isError={isGenresError}
          activeGenres={activeGenres}
          setActiveGenres={setActiveGenres}
        />

        <section className="space-y-4">
          <span className="block p-1 text-sm font-semibold text-gray">
            Showing results {mangas.length} of {mangaCount}
          </span>
          <MangaPreviewCard
            isLoading={isMangasLoading}
            mangas={mangas}
            error={isMangasError}
          />
        </section>

        <PageLimitButtons
          page={page}
          setPage={setPage}
          totalPages={totalPages}
        />
      </div>
    </>
  );
}
