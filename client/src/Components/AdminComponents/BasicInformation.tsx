import { CircleAlert } from "lucide-react";
import { type Genre, MangaStatus } from "./manga.utils";
import { useGetAllGenresQuery } from "../../api/genres";
import LoadingSpinner from "../UI/LoadingSpinner";
import { emitAlert } from "../..";
import { useEffect } from "react";
import { capitalizeFirstLetter } from "../..";

type BasicInformationProps = {
  mangaTitle: string | null;
  setMangaTitle: React.Dispatch<React.SetStateAction<string | null>>;
  authorName: string | null;
  setAuthorName: React.Dispatch<React.SetStateAction<string | null>>;
  mangaStatus: MangaStatus;
  setMangaStatus: React.Dispatch<React.SetStateAction<MangaStatus>>;
  mangaDescription: string | null;
  setMangaDescription: React.Dispatch<React.SetStateAction<string | null>>;
  showMore: boolean;
  setShowMore: React.Dispatch<React.SetStateAction<boolean>>;
  activeGenre: Genre[];
  setActiveGenre: React.Dispatch<React.SetStateAction<Genre[]>>;
};

export default function BasincInformation({
  mangaTitle,
  setMangaTitle,
  authorName,
  setAuthorName,
  mangaStatus,
  setMangaStatus,
  mangaDescription,
  setMangaDescription,
  setShowMore,
  showMore,
  activeGenre,
  setActiveGenre,
}: BasicInformationProps) {
  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, // Handle input changes in 1 function for textarea and input elements
  ) {
    switch (e.target.name) {
      case "title-input":
        setMangaTitle(e.target.value);
        break;
      case "author-input":
        setAuthorName(e.target.value);
        break;
      case "description-input":
        setMangaDescription(e.target.value);
        break;
    }
  }

  const { data: genres = [], isLoading, error } = useGetAllGenresQuery();

  useEffect(() => {
    if (error) {
      emitAlert("Failed to load genres", "error");
    }
  }, [error]);

  const genresToRender = showMore ? genres : genres.slice(0, 10);

  function handleGenreClick(genre: Genre) {
    if (activeGenre.some((g) => g._id === genre._id)) {
      const updatedGenres = activeGenre.filter((g) => g._id !== genre._id); // delete it from array
      return setActiveGenre(updatedGenres);
    }

    return setActiveGenre((prev) => [...prev, genre]);
  }

  return (
    <section className="flex flex-col bg-white p-6 rounded-lg shadow-md gap-4 flex-1">
      <div className="flex flex-row gap-2 items-center">
        <CircleAlert className="text-gray" />
        <h2 className="text-xl font-semibold text-gray">Basic Information</h2>
      </div>
      <div className="flex flex-col flex-1">
        <label htmlFor="title-input" className="admin-label">
          Manga Title <span className="text-xs text-gray">required*</span>
        </label>
        <input
          required
          id="title-input"
          placeholder="e.g. One Piece Naruto ..."
          name="title-input"
          className="admin-input-style"
          value={mangaTitle ?? ""}
          onChange={(e) => handleInputChange(e)}
        />
      </div>
      <div className="flex flex-row gap-5">
        <div className="flex flex-col flex-1">
          <label htmlFor="author-input" className="admin-label">
            Author <span className="text-xs text-gray">required*</span>
          </label>
          <input
            required
            id="author-input"
            placeholder="Author Name"
            name="author-input"
            className="admin-input-style"
            value={authorName ?? ""}
            onChange={(e) => handleInputChange(e)}
          />
        </div>
        <div className="flex flex-col flex-1">
          <label htmlFor="status-input" className="admin-label">
            Status <span className="text-xs text-gray">required*</span>
          </label>
          <select
            value={mangaStatus}
            onChange={(e) => setMangaStatus(e.target.value as MangaStatus)}
            className="p-2 border rounded-md bg-milkyWhite"
          >
            <option value={MangaStatus.ONGOING}>
              {capitalizeFirstLetter(MangaStatus.ONGOING)}
            </option>
            <option value={MangaStatus.HIATUS}>
              {capitalizeFirstLetter(MangaStatus.HIATUS)}
            </option>
            <option value={MangaStatus.COMPLETED}>
              {capitalizeFirstLetter(MangaStatus.COMPLETED)}
            </option>
            <option value={MangaStatus.CANCELLED}>
              {capitalizeFirstLetter(MangaStatus.CANCELLED)}
            </option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="description-input" className="admin-label">
          Description
        </label>
        <textarea
          id="description-input"
          name="description-input"
          placeholder="Synopsis or plot summary ..."
          className="admin-input-style w-full resize-none min-h-30"
          value={mangaDescription ?? ""}
          onChange={(e) => handleInputChange(e)}
        />
      </div>

      <div className="flex flex-1 gap-2">
        <label htmlFor="genres-options" className="admin-label">
          Genres
        </label>
        <div>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              {/* 1. Determine which items to show first */}
              {genres &&
                genresToRender.map((genre) => (
                  <label
                    key={genre._id || genre.name} // Use a unique ID if available
                    className={`${activeGenre.some((g) => g._id === genre._id) ? "genres-bg-checked" : "genres-bg-unchecked"}`}
                    onClick={() => handleGenreClick(genre)}
                  >
                    {genre.name}
                  </label>
                ))}
              {/* 2. Only show the button if there are more than 10 genres */}
              {genres && genres.length > 10 && (
                <button
                  type="button"
                  className="genres-bg-checked"
                  onClick={() => setShowMore((prev) => !prev)}
                >
                  {showMore ? "Show less" : "Show more"}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
