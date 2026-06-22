import { NavLink } from "react-router-dom";
import { useGetAllMangasQuery } from "@api/mangaApi";
import { MangaSortFields, Sort } from "@appTypes/index";
import MangaPreviewCard from "@shared/MangaPreviewCard";

export default function FeaturedMangaCard() {
  const {
    data: mangaPage,
    isLoading,
    error,
  } = useGetAllMangasQuery({
    paginationInput: { limit: 10 },
    sort: { sortBy: Sort.DESC, field: MangaSortFields.CREATED_AT },
  });
  const mangas = mangaPage?.mangas;

  return (
    <>
      <div className="flex flex-row justify-between items-center mb-5 mt-10">
        <h1 className="text-black font-bold text-2xl">Featured Manga</h1>
        <NavLink className="text-black font-medium" to="/browse">
          View All
        </NavLink>
      </div>
      <MangaPreviewCard isLoading={isLoading} mangas={mangas} error={error} />
    </>
  );
}
