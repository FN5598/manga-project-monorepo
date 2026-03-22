import { useState } from "react";
import {
  type Genre,
  MangaStatus,
  FileType,
  type UploadMangaPayload,
  type UpdateMangaPayload,
} from "./manga.utils";
import BasincInformation from "./BasicInformation";
import CoverImage from "./CoverImage";
import ChaptersElement from "./ChaptersElement";
import { emitAlert } from "../..";
import { useSignS3BucketUploadUrlMutation } from "../../api/S3";
import {
  useUpdateMangaMutation,
  useUploadMangaMutation,
} from "../../api/manga";
import PublishButtons from "./PublishButtons";

export type ApiError = {
  status?: number;
  data?: {
    message?: string;
  };
};

export function UploadManga() {
  const [mangaTitle, setMangaTitle] = useState<string | null>(null);
  const [authorName, setAuthorName] = useState<string | null>(null);
  const [mangaStatus, setMangaStatus] = useState<MangaStatus>(
    MangaStatus.ONGOING,
  );
  const [chapterNumber, setChapterNumber] = useState<number | null>(null);
  const [chapterTitle, setChapterTitle] = useState<string | null>(null);
  const [mangaDescription, setMangaDescription] = useState<string | null>(null);

  const [showMore, setShowMore] = useState(false);
  const [activeGenre, setActiveGenre] = useState<Genre[]>([]);
  // Uploaded preview file Allowed only 1 file
  const [preview, setPreview] = useState<string | null>(null);
  const [previewFileData, setPreviewFileData] = useState<File | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [chapterPages, setChapterPages] = useState<File[]>([]);

  const [signS3UploadUrl] = useSignS3BucketUploadUrlMutation();
  const [uploadMangaToDB] = useUploadMangaMutation();
  const [updateMangaToDB] = useUpdateMangaMutation();

  function clearAllStates() {
    const states = [
      setAuthorName,
      setChapterNumber,
      setChapterTitle,
      setMangaDescription,
      setMangaTitle,
      setPreview,
      setPreviewFileData,
    ];
    states.map((state) => state(null));
    setActiveGenre([]);
    setChapterPages([]);
    setLoading(false);
  }

  function getPublishValidationError() {
    if (!mangaTitle) return "Manga title is required";
    if (!authorName) return "Author name is required";
    if (!mangaStatus) return "Manga status is required";
    if (!chapterNumber) return "Chapter number is required";
    if (!previewFileData) return "Preview file is required";
    if (!chapterPages) return "Manga chapter images are required";
    return null;
  }
  // TODO refactor into useXXX function
  async function handlePublishManga() {
    if (loading) return;
    const validationError = getPublishValidationError();
    if (validationError) {
      emitAlert(validationError, "warning");
      return;
    }
    setLoading(true);
    try {
      const activeGenresIds = activeGenre
        ? activeGenre.map((genre) => genre._id)
        : [];

      const uploadPages = chapterPages.map((page) => ({
        fileName: page.name,
        contentType: page.type,
        type: FileType.page,
        size: page.size,
      }));

      // 1. Create Manga inside DB
      const payload: UploadMangaPayload = {
        title: mangaTitle!,
        author: authorName!,
        description: mangaDescription,
        genres: activeGenresIds,
        status: mangaStatus,
      };
      const dbRes = await uploadMangaToDB({
        mangaData: payload,
      }).unwrap();

      console.log(dbRes);

      // 2. Get signed upload URL
      const signS3UrlRes = await signS3UploadUrl({
        mode: "manga",
        body: {
          fileName: previewFileData!.name,
          contentType: previewFileData!.type,
          mangaId: dbRes.mangaData._id,
          mangaChapter: chapterNumber!,
          type: FileType.preview,
          size: previewFileData!.size,
          chapters: [...uploadPages],
        },
      }).unwrap();

      console.log(signS3UrlRes);

      // 3. Upload Data to Bucket
      await fetch(signS3UrlRes.preview!.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": signS3UrlRes.preview!.contentType },
        body: previewFileData,
      });

      await Promise.all(
        chapterPages.map((file, i) =>
          fetch(signS3UrlRes.chapters[i].uploadUrl, {
            method: "PUT",
            headers: { "Content-Type": signS3UrlRes.chapters[i].contentType },
            body: file,
          }),
        ),
      );

      const updateMangaPayload: UpdateMangaPayload = {
        manga: {
          _id: dbRes.mangaData._id,
          previewKey: signS3UrlRes.preview!.key,
        },
        chapter: {
          chapterNumber: chapterNumber!,
          title: chapterTitle!,
        },
        pages: signS3UrlRes.chapters.map((chapter) => ({
          imageKey: chapter.key,
          fileName: chapter.fileName,
          fileSize: chapter.size,
        })),
      };
      // 4. Fill in Data in DB
      const finalSave = await updateMangaToDB(updateMangaPayload);
      // 5. Emit message so success can be identified
      emitAlert(
        finalSave.data?.message ?? "Manga published successfully",
        "info",
      );

      // 6. Reset states after sending successfull request
      clearAllStates();
    } catch (error) {
      const err = error as ApiError;
      emitAlert(err.data?.message ?? "Request failed", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-milkyWhite p-6 md:p-10">
      <h1 className="text-3xl font-semibold md:text-4xl">Upload Manga</h1>

      <div className="mt-6 flex flex-wrap items-start gap-4 md:gap-6">
        <div className="flex min-w-[300px] flex-1 flex-col gap-6">
          <BasincInformation
            mangaTitle={mangaTitle}
            setMangaTitle={setMangaTitle}
            authorName={authorName}
            setAuthorName={setAuthorName}
            mangaStatus={mangaStatus}
            setMangaStatus={setMangaStatus}
            mangaDescription={mangaDescription}
            setMangaDescription={setMangaDescription}
            showMore={showMore}
            setShowMore={setShowMore}
            activeGenre={activeGenre}
            setActiveGenre={setActiveGenre}
          />

          <ChaptersElement
            chapterNumber={chapterNumber}
            setChapterNumber={setChapterNumber}
            chapterTitle={chapterTitle}
            setChapterTitle={setChapterTitle}
            chaptersPages={chapterPages}
            setChaptersPages={setChapterPages}
          />
        </div>

        <div className="flex w-full max-w-[340px] flex-col gap-5">
          <CoverImage
            preview={preview}
            setPreview={setPreview}
            setPreviewFileData={setPreviewFileData}
          />

          <PublishButtons
            handlePublish={handlePublishManga}
            clearAllStates={clearAllStates}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
