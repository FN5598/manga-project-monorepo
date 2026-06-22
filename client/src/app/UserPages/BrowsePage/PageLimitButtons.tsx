import { Button } from "@components/ui/button";
import type { SetStateAction } from "react";
import type React from "react";

type PageLimitButtonsProps = {
  page: number;
  setPage: React.Dispatch<SetStateAction<number>>;
  totalPages: number;
};

export default function PageLimitButtons({
  page,
  setPage,
  totalPages,
}: PageLimitButtonsProps) {
  const visiblePages = Array.from(
    { length: Math.min(totalPages, 10) },
    (_, index) => index + 1,
  );

  return (
    <section className="flex flex-wrap items-center justify-center gap-3 pb-8">
      <Button
        disabled={page <= 1}
        onClick={() => setPage((p) => p - 1)}
        className="disabled:cursor-not-allowed disabled:opacity-50"
      >
        Previous
      </Button>

      {visiblePages.map((pageNumber) => (
        <button
          key={pageNumber}
          onClick={() => setPage(pageNumber)}
          disabled={pageNumber === page}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-base font-semibold hover:bg-slate-100 disabled:bg-slate-950 disabled:text-white"
        >
          {pageNumber}
        </button>
      ))}

      <Button
        disabled={page >= totalPages}
        className="disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => setPage((p) => p + 1)}
      >
        Next
      </Button>
    </section>
  );
}
