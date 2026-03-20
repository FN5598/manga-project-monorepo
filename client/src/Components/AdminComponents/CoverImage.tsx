import { ImageDown } from "lucide-react";

type CoverImageProps = {
  preview: string | null;
  setPreview: React.Dispatch<React.SetStateAction<string | null>>;
  setPreviewFileData: React.Dispatch<React.SetStateAction<File | null>>;
};

export default function CoverImage({
  preview,
  setPreview,
  setPreviewFileData,
}: CoverImageProps) {
  // TODO improve file checking to show image correctly
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreviewFileData(file);
    const url = URL.createObjectURL(file);
    console.log("set url to:", url);
    setPreview(url);
  }

  return (
    <div className="flex flex-col gap-2 rounded p-5 rounded-xl bg-white shadow-md min-h-125 w-full">
      <label className="text-xl font-semibold text-gray">
        Cover Image <span className="text-xs text-gray">required*</span>
      </label>
      <div className="p-5 flex-1 border border-dashed rounded-xl h-full flex flex-col justify-center items-center gap-2 bg-milkyWhite relative">
        <input
          type="file"
          className="flex-1 cursor-pointer absolute inset-0  opacity-0"
          onChange={(e) => handleFileChange(e)}
        />
        {preview ? (
          <img
            src={preview}
            alt="Cover preview"
            className="w-full h-full object-fill"
          />
        ) : (
          <>
            <ImageDown className="text-gray" />
            <label className="text-gray font-medium">Upload Cover</label>
            <span className="text-gray font-light text-xs">
              Only 1 PNG, JPEG, WEBP file
            </span>
          </>
        )}
      </div>
    </div>
  );
}
