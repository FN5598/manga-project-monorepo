import { useState } from "react";
import Header from "@shared/Header";
import {
  clearItemFromLocalStorage,
  getVisitedMangasFromLocalStorage,
} from "@lib/localStorage";
import { emitAlert } from "@lib/alerts";
import { useGetAllMangasQuery } from "@api/mangaApi";
import { UserType } from "@appTypes/User";
import { MangaFilterFields } from "@appTypes/index";
import MangaPreviewCard from "@shared/MangaPreviewCard";
import { skipToken } from "@reduxjs/toolkit/query";
import { useDeleteUserByIdMutation } from "@api/userApi";
import { Calendar, Cog, Mail, User, UserRoundCog } from "lucide-react";
import { Switch } from "@components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { useAppSelector } from "@store";
import { getDateFromISOString } from "@lib/index";
import { MyLibraryTabs } from "@appTypes/index";

function isMyLibraryTab(value: string | null): value is MyLibraryTabs {
  return Object.values(MyLibraryTabs).includes(value as MyLibraryTabs);
}

export default function MyLibrarypage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search).get("tab");
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<MyLibraryTabs>(
    isMyLibraryTab(searchParams) ? searchParams : MyLibraryTabs.HISTORY,
  );
  const [isSaveHistory, setIsSaveHistory] = useState<boolean>(true);
  const [readMangas] = useState(
    isSaveHistory === true
      ? getVisitedMangasFromLocalStorage("visitedMangas")
      : [],
  );
  const user = useAppSelector((state) => state.user.user);
  const [deleteAccount, setDeleteAccount] = useState<boolean>(false);
  const [deleteUserAccountTrigger] = useDeleteUserByIdMutation();
  const readingHistoryTab = activeTab === "history";
  const favouritesTab = activeTab === "favourites";
  const profileTab = activeTab === "profile";

  const queryArgs =
    readMangas.length > 0
      ? {
          filters: [
            {
              field: MangaFilterFields.ID,
              value: readMangas.map((val) => val.id),
            },
          ],
        }
      : skipToken;

  const {
    data: visitedMangas,
    isLoading,
    error,
  } = useGetAllMangasQuery(queryArgs);

  async function handleDeleteAccount() {
    if (!user || (user && !user._id)) return;
    try {
      const response = await deleteUserAccountTrigger(user._id).unwrap();
      emitAlert(`Successfully deleted account ${response.username}`, "info");
    } catch (e) {
      emitAlert("TODO ADD ERROR HANDLING", "error");
    } finally {
      setDeleteAccount(false);
      navigate("/discover", { replace: true });
    }
  }

  return (
    <>
      <Header sticky={true} />
      <div className="mx-auto mt-4 flex w-full max-w-7xl flex-col justify-center px-4 pb-8 sm:px-6 lg:px-12">
        <div className="flex flex-col gap-6 lg:gap-8">
          <section className="space-y-2">
            <h1 className="text-2xl font-bold sm:text-3xl">My Library</h1>
            <span className="block text-sm text-gray sm:text-base">
              Your personal manga collection and reading lists
            </span>
          </section>

          <section className="flex gap-2 overflow-x-auto border-b border-slate-200 pb-1 sm:gap-6">
            <h2
              onClick={() => setActiveTab(MyLibraryTabs.HISTORY)}
              className={`shrink-0 cursor-pointer px-2 py-3 text-base font-bold sm:text-xl ${readingHistoryTab ? "border-b-2 border-slate-950 transition-all ease-in duration-300" : "text-gray"}`}
            >
              Reading History
            </h2>
            <h2
              onClick={() => setActiveTab(MyLibraryTabs.FAVOURITES)}
              className={`shrink-0 cursor-pointer px-2 py-3 text-base font-bold sm:text-xl ${favouritesTab ? "border-b-2 border-slate-950 transition-all ease-in duration-300" : "text-gray"}`}
            >
              Favourites
            </h2>
            <h2
              onClick={() => setActiveTab(MyLibraryTabs.PROFILE)}
              className={`shrink-0 cursor-pointer px-2 py-3 text-base font-bold sm:text-xl ${profileTab ? "border-b-2 border-slate-950 transition-all ease-in duration-300" : "text-gray"}`}
            >
              Profile
            </h2>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            {profileTab && user && (
              <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <User className="h-20 w-20 shrink-0 rounded-full border border-slate-200 bg-milkyWhite p-3 text-slate-700 sm:h-24 sm:w-24" />
                  <div className="min-w-0">
                    <h2 className="text-xl font-bold sm:text-2xl">
                      {user.username}
                    </h2>
                    <span className="block break-all text-sm font-light text-gray">
                      {user.role}: {user._id}
                    </span>
                  </div>
                </div>

                <section className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex flex-col gap-3 text-gray sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                    <div className="flex min-w-0 flex-row items-center gap-2">
                      <Mail className="h-5 w-5 shrink-0" />
                      <h1 className="truncate">{user.email}</h1>
                    </div>

                    <div className="flex flex-row items-center gap-2">
                      <Calendar className="h-5 w-5 shrink-0" />
                      <span>Joined {getDateFromISOString(user.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    {user.role === UserType.ADMIN && (
                      <NavLink
                        to={`/admin/${user._id}/upload-manga`}
                        className="button flex min-h-11 flex-row items-center justify-center gap-2 px-4 py-2"
                      >
                        <UserRoundCog className="h-5 w-5 shrink-0" />
                        Go to Admin panel
                      </NavLink>
                    )}

                    <button className="button flex min-h-11 flex-row items-center justify-center gap-2 px-4 py-2">
                      <Cog className="h-5 w-5 shrink-0" />
                      Edit Profile
                    </button>
                  </div>
                </section>

                <section className="space-y-4 border-t border-slate-200 pt-5">
                  <div className="flex flex-row items-center justify-between gap-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-lg">
                        Reading History
                      </span>
                      <span className="text-gray text-light">
                        Save your reading history
                      </span>
                    </div>
                    <Switch
                      size={"lg"}
                      checked={isSaveHistory}
                      onCheckedChange={setIsSaveHistory}
                    />
                  </div>
                  <div className="h-px bg-slate-200"></div>
                  <Dialog open={deleteAccount} onOpenChange={setDeleteAccount}>
                    <DialogTrigger asChild>
                      <button
                        className="min-h-11 w-full cursor-pointer rounded-xl bg-red-600 px-6 py-2 font-semibold text-white hover:bg-red-700 sm:w-auto"
                        onClick={() => setDeleteAccount((prev) => !prev)}
                      >
                        Delete account
                      </button>
                    </DialogTrigger>

                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete account confirmation</DialogTitle>
                      </DialogHeader>

                      <p className="text-sm text-muted-foreground">
                        Are you sure you want to delete your account. This
                        action will be irreversible!
                      </p>

                      <div className="mt-6 flex flex-col items-stretch justify-center gap-2 sm:flex-row sm:items-center">
                        <button
                          type="button"
                          className="rounded-md bg-black px-4 py-2 text-white cursor-pointer hover:brightness-125"
                          onClick={handleDeleteAccount}
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          className="rounded-md border px-4 py-2 cursor-pointer hover:bg-white hover:brightness-90"
                          onClick={() => setDeleteAccount(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </section>
              </div>
            )}

            {profileTab && !user && (
              <div>Please Login to view your Profile</div>
            )}

            {favouritesTab && <></>}
            {readingHistoryTab &&
              (readMangas.length > 0 && isSaveHistory === true ? (
                <div className="space-y-4">
                  <MangaPreviewCard
                    isLoading={isLoading}
                    error={error}
                    mangas={visitedMangas?.mangas}
                    visitedMangas={readMangas}
                  />

                  <button
                    onClick={() => clearItemFromLocalStorage("visitedMangas")}
                    className="button flex min-h-11 w-full items-center justify-center px-4 py-2 font-semibold sm:w-auto"
                  >
                    Clear History
                  </button>
                </div>
              ) : (
                <section className="rounded-xl bg-milkyWhite p-6 text-center text-gray">
                  No stored mangas
                </section>
              ))}
          </section>
        </div>
      </div>
    </>
  );
}
