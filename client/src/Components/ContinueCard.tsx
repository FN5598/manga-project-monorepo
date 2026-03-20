import { Play } from "lucide-react";
import type { ItemType } from "../Pages/HomePage";

type ContinueCardProps = {
  item: ItemType;
};

export default function ContinueCard({ item }: ContinueCardProps) {
  return (
    <article className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:shadow-md">
      <img
        src={item.cover}
        alt={item.title}
        className="h-16 w-12 rounded-lg object-cover"
      />

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-bold text-slate-900">
          {item.title}
        </h3>
        <p className="mt-1 truncate text-xs text-slate-500">{item.chapter}</p>
        <div className="mt-3 h-1.5 rounded-full bg-slate-100">
          <div
            className="h-1.5 rounded-full bg-violet-500"
            style={{ width: `${item.progress}%` }}
          />
        </div>
        <p className="mt-2 text-right text-[10px] text-slate-400">
          {item.page}
        </p>
      </div>

      <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0d1733] text-white transition hover:scale-105">
        <Play className="h-4 w-4 fill-current" />
      </button>
    </article>
  );
}
