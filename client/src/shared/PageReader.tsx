import { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";

type ReaderPageProps = {
  src: string;
  alt: string;
};

export default function ReaderPage({ src, alt }: ReaderPageProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-md bg-zinc-950 flex justify-center items-center">
        {!loaded && !failed && <LoadingSpinner />}

        {failed && (
          <div className="flex items-center justify-center text-sm text-zinc-500">
            Failed to load page
          </div>
        )}

        <img
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`h-auto w-[400] transition-opacity duration-200 ${
            loaded ? "opacity-100" : "opacity-0 absolute inset-0"
          }`}
          draggable={false}
        />
      </div>
    </div>
  );
}
