import { BookOpen } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function DiscoverMangaCard() {
  return (
    <div className="gradient-blue flex flex-col rounded-xl p-6 gap-4 mt-10">
      <h1 className="flex text-white font-semibold text-3xl">
        Discover Amazing Manga
      </h1>
      <p className="text-slate-300 font-md text-md">
        Explore thousands of manga titles from popular series to hidden gems.
        Start your reading journey today.
      </p>
      <div className="flex flex-row gap-4 items-center">
        <NavLink
          to="/my-library"
          className="flex p-2 pr-4 pl-4 rounded-xl bg-white gap-2 justiy-center items-center cursor-pointer transition hover:bg-slate-200 active:scale-[0.98]"
        >
          <BookOpen className="w-5 h-5" />
          <span className="font-semibold">Start Reading</span>
        </NavLink>
        <NavLink
          to="/browse"
          className="flex border border-1 border-white text-white p-2 pr-6 pl-6 rounded-xl font-semibold cursor-pointer transition hover:bg-white/10 active:scale-[0.98]"
        >
          Browse Catalog
        </NavLink>
      </div>
    </div>
  );
}
