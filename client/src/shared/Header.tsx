import Logo from "./Logo";
import {
  House,
  Compass,
  UsersRound,
  Library,
  Menu,
  X,
  User,
  ArrowRightFromLineIcon,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { emitAlert } from "@lib/alerts";
import { useLogoutMutation } from "@api/authApi";
import { useAppSelector } from "@store";
import { getPath } from "@lib/index";
import { MyLibraryTabs } from "@appTypes/index";

const navItems = [
  { label: "Discover", icon: <House className="h-4 w-4" /> },
  { label: "Browse", icon: <Compass className="h-4 w-4" /> },
  { label: "My Library", icon: <Library className="h-4 w-4" /> },
  { label: "Community", icon: <UsersRound className="h-4 w-4" /> },
] as const;

type HeaderProps = {
  sticky: boolean;
};

export default function Header({ sticky }: HeaderProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [logoutTrigger] = useLogoutMutation();
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);

  async function logoutHandler() {
    try {
      const res = await logoutTrigger().unwrap();
      emitAlert(res.message, "info");
    } catch (e) {
      emitAlert("TODO ADD ERROR HANDLING", "error");
    } finally {
      navigate("/discover");
    }
  }
  return (
    <>
      <header
        className={`top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur ${sticky ? `sticky` : "block"}`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-4 lg:gap-8">
            <Logo />

            <nav className="hidden items-center gap-2 lg:flex">
              {navItems.map(({ label, icon }) => (
                <NavLink
                  key={label}
                  to={getPath(label)}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${
                      isActive
                        ? "bg-slate-900 text-white"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`
                  }
                >
                  <span className="shrink-0">{icon}</span>
                  <span className="whitespace-nowrap">{label}</span>
                </NavLink>
              ))}
            </nav>
          </div>

          {!isLoggedIn && (
            <div className="hidden items-center gap-3 lg:flex">
              <NavLink
                to="/auth?page=login"
                className="rounded-xl px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-100 cursor-pointer"
              >
                Log In
              </NavLink>
              <NavLink
                to="/auth?page=sign-up"
                className="rounded-xl bg-slate-950 px-4 py-2 font-semibold text-white transition hover:bg-slate-800 cursor-pointer"
              >
                Sign Up
              </NavLink>
            </div>
          )}

          {isLoggedIn && (
            <div className="hidden items-center gap-3 lg:flex flex-row">
              <NavLink
                to={`/my-library?tab=${MyLibraryTabs.PROFILE}`}
                className="flex flex-row p-2 gap-2 hover:bg-white hover:brightness-90 cursor-pointer rounded-xl"
              >
                <User />
                <span>Profile</span>
              </NavLink>
              <button
                className="hover:bg-white hover:brightness-90 cursor-pointer rounded-xl p-2"
                onClick={() => logoutHandler()}
              >
                Logout
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open navigation menu"
            className="inline-flex rounded-xl p-2 text-slate-700 transition hover:bg-slate-100 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />

          <div className="absolute right-0 top-0 flex h-full w-[85%] max-w-sm flex-col bg-white p-5 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <Logo />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="rounded-xl p-2 text-slate-700 transition hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex flex-col gap-2">
              {navItems.map(({ label, icon }) => (
                <NavLink
                  key={label}
                  to={getPath(label)}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-slate-900 text-white"
                        : "text-slate-700 hover:bg-slate-100"
                    }`
                  }
                >
                  <span className="shrink-0">{icon}</span>
                  <span>{label}</span>
                </NavLink>
              ))}
            </nav>

            {!isLoggedIn && (
              <div className="mt-auto flex flex-col gap-3 border-t border-slate-200 pt-5">
                <NavLink
                  to="/auth?page=login"
                  className="rounded-xl px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Log In
                </NavLink>
                <NavLink
                  to="/auth?page=sign-up"
                  className="rounded-xl bg-slate-950 px-4 py-3 font-semibold text-white transition hover:bg-slate-800"
                >
                  Sign Up
                </NavLink>
              </div>
            )}

            {isLoggedIn && (
              <div className="mt-auto flex flex-col gap-3 border-t border-slate-200 pt-5">
                <NavLink
                  to={`/my-library?tab=${MyLibraryTabs.PROFILE}`}
                  className="flex flex-row p-2 gap-2 hover:bg-white hover:brightness-90 cursor-pointer rounded-xl justify-start"
                >
                  <User />
                  <span>Profile</span>
                </NavLink>
                <button
                  className="hover:bg-white hover:brightness-90 cursor-pointer rounded-xl flex flex-row justify-start p-2 gap-2"
                  onClick={() => logoutHandler()}
                >
                  <ArrowRightFromLineIcon className="w-6 h-6" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
