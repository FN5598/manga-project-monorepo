import type { ItemType } from "../Pages/HomePage";

type MangaCardProps = {
  item: ItemType;
};

export default function MangaCard({ item }: MangaCardProps) {
  return (
    <article className="group min-w-0">
      <div className="relative overflow-hidden rounded-2xl shadow-sm">
        <img
          src={item.cover}
          alt={item.title}
          className="aspect-[4/5] w-full object-cover transition duration-300 group-hover:scale-105"
        />
        <div className="absolute left-2 top-2 rounded-md bg-[#f5d733] px-2 py-1 text-[10px] font-bold text-slate-900 shadow">
          ⭐ {item.rating}
        </div>
      </div>

      <h3 className="mt-3 truncate text-sm font-bold text-slate-900">
        {item.title}
      </h3>
      <p className="truncate text-xs text-slate-500">{item.author}</p>
    </article>
  );
}
