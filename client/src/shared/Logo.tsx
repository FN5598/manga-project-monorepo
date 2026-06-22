import { NavLink } from "react-router-dom";

export default function Logo() {
  return (
    <NavLink to={"/discover"} className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0d1733] text-yellow-400 shadow-sm">
        <span className="text-sm font-black">⚡</span>
      </div>
      <span className="text-sm font-bold text-slate-900">MangaVocab</span>
    </NavLink>
  );
}
