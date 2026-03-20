import { Bell, Search } from "lucide-react";
import Logo from "./Logo";
import { NavLink } from "react-router-dom";

const navItems = ["Discover", "Browse", "My Library", "Community"];

export default function Header() {
  function getPath(name: string): string {
    return `/${name.toLowerCase().trim().replace(/\s+/g, "-")}`;
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-3">
        <div className="flex items-center gap-8">
          <Logo />

          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item}
                to={getPath(item)}
                className={({ isActive }) =>
                  `text-xs font-medium transition cursor-pointer ${
                    isActive
                      ? "text-slate-900 underline decoration-2 underline-offset-8"
                      : "text-slate-500 hover:text-slate-900"
                  }`
                }
              >
                {item}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* TODO handle search */}
        <div className="flex items-center gap-4">
          <div className="hidden h-10 w-[260px] items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 md:flex">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              placeholder="Search manga, authors..."
              className="w-full bg-transparent text-sm text-slate-600 outline-none placeholder:text-slate-400"
            />
          </div>

          {/* TODO open window with messages */}
          <button className="relative rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900">
            <Bell className="h-4 w-4" />
          </button>

          {/* TODO handle logged in user */}
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
            alt="User avatar"
            className="h-9 w-9 rounded-full object-cover ring-2 ring-violet-200"
          />
        </div>
      </div>
    </header>
  );
}
