import { useEffect, useState } from "react";
import Header from "@shared/Header";
import { useGetAllGenresQuery } from "@api/genresApi";
import MangaPreviewCard from "@shared/MangaPreviewCard";
import { useLazyGetAllMangasQuery } from "@api/mangaApi";
import { MangaFilterFields } from "@appTypes/index";
import { useDebounce } from "@hooks/useDebounce";
import { useSearchParams } from "react-router-dom";
import useHandleInputChange from "@hooks/useHandleInputChange";
import { Input } from "@components/ui/input";
import GenresSortCard from "./GenresSortCard";
import PageLimitButtons from "./PageLimitButtons";

export default function BrowsePage() {
  const [searchParams] = useSearchParams();
  const [mangaTitle, setMangaTitle] = useState<string>("");
  const tab = searchParams.get("tab");
  const [activeGenres, setActiveGenres] = useState<string[] | null>(
    tab ? [tab] : [],
  );
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    useHandleInputChange(e, setMangaTitle);

  const {
    data: genres = [],
    isSuccess: isGenresSuccess,
    isLoading: isGenresLoading,
    isError: isGenresError,
  } = useGetAllGenresQuery();

  const [page, setPage] = useState(1);
  const limit = 10;

  const debouncedTitle = useDebounce(mangaTitle?.toLowerCase(), 500);
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
  }, [getAllMangas, debouncedTitle, activeGenres, page]);

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
            name="manga-input"
            value={mangaTitle ?? ""}
            onChange={handleChange}
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
