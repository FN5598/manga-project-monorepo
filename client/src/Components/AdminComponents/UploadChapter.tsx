import ChaptersElement from "./ChaptersElement";
import React, { useState } from "react";
import PublishButtons from "./PublishButtons";
import { Search } from "lucide-react";
import { useDebounce } from "../../hooks/useDebounce";
import { useFindChapterByNameQuery, type Manga } from "../../api/manga";
import { emitAlert } from "../..";
import { useSignS3BucketUploadUrlMutation, type SignBody } from "../../api/S3";
import {
  useCreateChapterForMangaMutation,
  type addChapterPayload,
} from "../../api/chapter";
import { FileType } from "./manga.utils";
import { type ApiError } from "./UploadManga";

export default function UploadChapter() {
  const [chapterNumber, setChapterNumber] = useState<number | null>(null);
  const [chapterTitle, setChapterTitle] = useState<string | null>(null);
  const [chapterPages, setChapterPages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [mangaTitle, setMangaTitle] = useState<string>("");
  const [chosenManga, setChosenManga] = useState<Manga | null>(null);

  const debouncedTitle = useDebounce(mangaTitle?.toLowerCase(), 1000);

  const { data: mangas } = useFindChapterByNameQuery(
    { mangaTitle: debouncedTitle },
    { skip: !debouncedTitle },
  );

  const [signS3UploadUrlTrigger] = useSignS3BucketUploadUrlMutation();
  const [createChapter] = useCreateChapterForMangaMutation();

  const showDropdown =
    ((mangaTitle?.length ?? 0) > 0 &&
      (mangas?.length ?? 0) > 0 &&
      !mangas?.some((manga) => manga.title === mangaTitle)) ??
    false;

  function checkStates(): null | string {
    if (!chapterNumber) return "Chapter Number is required input!";
    if (!chapterTitle) return "Chapter Title is required input!";
    if (!chapterPages) return "At least 1 page is required!";
    if (!chosenManga) return "Pick existing manga";
    return null;
  }

  async function handlePublishChapter() {
    try {
      if (loading) return;
      console.log("handle publish manga pressed");

      const states = checkStates();
      if (states) {
        emitAlert(states, "warning");
      }

      setLoading(true);

      // 1. Create upload URLs for images and verify file ext.
      const pagesPayload = chapterPages!.map((page) => ({
        fileName: page.name,
        contentType: page.type,
        type: FileType.page,
        size: page.size,
      }));
      const payload: SignBody = {
        mode: "chapter",
        body: {
          mangaId: chosenManga!._id,
          mangaChapter: chapterNumber!,
          chapters: [...pagesPayload],
        },
      };
      const signS3Res = await signS3UploadUrlTrigger(payload).unwrap();

      // 2. Create chapter instance in DB
      const addChapterPayload: addChapterPayload = {
        mangaId: chosenManga!._id,
        chapterTitle: chapterTitle!,
        chapterNumber: chapterNumber!,
        pages: signS3Res.chapters.map((chapter) => ({
          imageKey: chapter.key,
          fileName: chapter.fileName,
          fileSize: chapter.size,
        })),
      };
      const chapterRes = await createChapter(addChapterPayload).unwrap();

      // 3. Uplaod to S3 Storage
      await Promise.all(
        chapterPages.map((file, i) =>
          fetch(signS3Res.chapters[i].uploadUrl, {
            method: "PUT",
            headers: { "Content-Type": signS3Res.chapters[i].contentType },
            body: file,
          }),
        ),
      );

      // 4. Clear states
      clearAllStates();

      // 5. Emit alert so success can be identified
      emitAlert(chapterRes.message ?? "Chapter successfully added", "info");

      // 6. Reset states after sending successfull request
      clearAllStates();
    } catch (error) {
      const err = error as ApiError;
      emitAlert(err.data?.message ?? "Request failed", "error");
    } finally {
      setLoading(false);
    }
  }

  function clearAllStates() {
    setChapterNumber(null);
    setChapterTitle(null);
    setChapterPages([]);
    setLoading(false);
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    switch (name) {
      case "manga-input":
        setMangaTitle(value);
        break;
    }
  }

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-milkyWhite p-6 md:p-10">
      <h1 className="font-bold text-3xl">Upload Chapter</h1>
      <span className="mb-5 text-gray mt-1">
        Add new chapter to an existing manga series
      </span>
      <div className="flex flex-col gap-6">
        <section className="flex flex-col bg-white p-4 rounded-xl">
          <div className="flex flex-row gap-2 text-xl items-center mb-2">
            <Search className="h-5 w-5" />
            <label className="font-semibold">
              Select Manga Series{" "}
              <span className="text-xs text-gray">required*</span>
            </label>
          </div>

          <div className="relative flex flex-1 flex-col">
            <input
              placeholder="Choose a manga series"
              name="manga-input"
              className="admin-input-style"
              value={mangaTitle ?? ""}
              onChange={(e) => handleInput(e)}
            />

            {showDropdown && (
              <>
                {mangas && mangas.length === 0 && mangaTitle && (
                  <div className="absolute left-0 top-full z-50 mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-900 p-3 text-sm text-zinc-400">
                    No results found
                  </div>
                )}

                {mangas && mangas.length > 0 && (
                  <div className="absolute left-0 top-full z-50 mt-2 max-h-60 w-full overflow-y-auto rounded-xl border border-zinc-700 bg-slate-200 shadow-xl">
                    {mangas.map((manga) => (
                      <button
                        key={manga._id}
                        type="button"
                        onClick={() => {
                          setMangaTitle(manga.title);
                          setChosenManga(manga);
                        }}
                        className="w-full px-4 py-3 text-left text-sm text-black font-semibold transition hover:bg-slate-100 cursor-pointer"
                      >
                        {manga.title}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        <ChaptersElement
          chapterNumber={chapterNumber}
          setChapterNumber={setChapterNumber}
          chapterTitle={chapterTitle}
          setChapterTitle={setChapterTitle}
          chaptersPages={chapterPages}
          setChaptersPages={setChapterPages}
          disabled={!mangaTitle}
        />

        <PublishButtons
          handlePublish={handlePublishChapter}
          loading={loading}
          clearAllStates={clearAllStates}
        />
      </div>
    </div>
  );
}
