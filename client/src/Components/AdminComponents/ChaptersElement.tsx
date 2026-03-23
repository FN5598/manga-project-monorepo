import { Layers3, CloudUpload } from "lucide-react";
import { useCallback, useEffect, useMemo } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { NUMBER_REGEX, emitAlert } from "../..";

type ChapterElementProps = {
  setChapterNumber: React.Dispatch<React.SetStateAction<number | null>>;
  chapterNumber: number | null;
  setChapterTitle: React.Dispatch<React.SetStateAction<string | null>>;
  chapterTitle: string | null;
  setChaptersPages: React.Dispatch<React.SetStateAction<File[]>>;
  chaptersPages: File[];
  disabled?: boolean;
};

export default function ChaptersElement({
  setChapterNumber,
  chapterNumber,
  setChapterTitle,
  chapterTitle,
  setChaptersPages,
  chaptersPages,
  disabled,
}: ChapterElementProps) {
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    switch (name) {
      case "chapter-number":
        if (value === "") {
          setChapterNumber(null);
          return;
        }

        if (NUMBER_REGEX.test(value)) {
          setChapterNumber(Number(value));
        } else {
          emitAlert("Can only input numbers", "info");
        }
        break;

      case "chapter-title":
        setChapterTitle(value);
        break;
    }
  }

  function getPageNumber(fileName: string): number {
    const match = fileName.match(/^\d+/); // match leading digits
    return match ? Number(match[0]) : Number.MAX_SAFE_INTEGER;
  }

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        emitAlert(
          "Some files were rejected. Only JPG, JPEG, and PNG are allowed.",
          "warning",
        );
      }

      function sortFilesByPage(files: File[]) {
        return [...files].sort((a, b) => {
          return getPageNumber(a.name) - getPageNumber(b.name);
        });
      }

      if (!acceptedFiles.length) return;

      setChaptersPages((prev) => {
        const merged = [...prev, ...acceptedFiles];

        // optional dedupe
        const merge = merged.filter(
          (file, index, self) =>
            index ===
            self.findIndex((f) => f.name === file.name && f.size === file.size),
        );
        return sortFilesByPage(merge);
      });
    },
    [setChaptersPages],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
  });

  const previews = useMemo(() => {
    return chaptersPages.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
  }, [chaptersPages]);

  useEffect(() => {
    return () => {
      previews.forEach((item) => URL.revokeObjectURL(item.preview));
    };
  }, [previews]);

  function removeFile(indexToRemove: number) {
    setChaptersPages((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    );
  }

  return (
    <section
      className={`flex flex-col p-6 shadow-md rounded-xl bg-white gap-5 flex-1 ${disabled ? "opacity-50 pointer-events-none relative select-none" : ""}`}
    >
      {disabled && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <span className="text-3xl font-semibold text-black">
            Manga series is required!
          </span>
        </div>
      )}

      <div className="flex flex-row gap-2 relative items-center">
        <Layers3 className="text-gray" />
        <h1 className="text-xl font-semibold text-gray">Chapters & Pages</h1>
        <label className="absolute right-0 text-black font-semibold text-gray">
          Bulk Upload
        </label>
      </div>

      <div className="flex flex-row gap-5">
        <div className="flex flex-col flex-1">
          <label htmlFor="chapter-number" className="admin-label">
            Chapter Number <span className="text-xs text-gray">required*</span>
          </label>
          <input
            required
            value={chapterNumber ?? ""}
            onChange={handleInputChange}
            id="chapter-number"
            name="chapter-number"
            placeholder="e.g. 1"
            className="admin-input-style"
            inputMode="numeric"
            type="text"
          />
        </div>

        <div className="flex flex-col flex-[2]">
          <label htmlFor="chapter-title" className="admin-label">
            Chapter Title <span className="text-xs text-gray">required*</span>
          </label>
          <input
            required
            value={chapterTitle ?? ""}
            onChange={handleInputChange}
            id="chapter-title"
            name="chapter-title"
            placeholder="e.g. Luffy vs Kaido"
            className="admin-input-style"
          />
        </div>
      </div>

      <div
        {...getRootProps()}
        className={`border border-dashed rounded-lg p-5 cursor-pointer transition ${
          isDragActive ? "border-amber-500 bg-amber-50" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />

        {previews.length > 0 ? (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {previews.map((item, index) => (
                <div
                  key={`${item.file.name}-${item.file.size}-${index}`}
                  className="relative border rounded-lg overflow-hidden bg-gray-50"
                >
                  <img
                    src={item.preview}
                    alt={item.file.name}
                    className="w-full h-48 object-cover"
                  />

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="absolute top-2 right-2 bg-white/90 px-2 py-1 text-xs rounded"
                  >
                    Remove
                  </button>

                  <div className="p-2 text-xs truncate">{item.file.name}</div>
                </div>
              ))}
            </div>

            <p className="text-center text-sm text-gray">
              Drag more images here or click to add more
            </p>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center gap-2">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <div className="absolute w-16 h-16 bg-yellow-50 rounded-full" />
              <CloudUpload className="text-amber-500 relative z-10" />
            </div>

            <label className="admin-label text-center">
              Drag & drop page images here{" "}
              <span className="text-xs text-gray">required*</span>
            </label>

            <label className="text-gray font-light text-sm text-center">
              Supports individual JPG/PNG files
            </label>
          </div>
        )}
      </div>
    </section>
  );
}
