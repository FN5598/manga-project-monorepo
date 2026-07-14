import { useGetCurrentUserQuery } from "@api/userApi";
import { UserType } from "@appTypes/User";
import { clearUserGlobalState } from "@globalState/userSlice";
import { emitAlert } from "@lib/alerts";
import LoadingPage from "@shared/LoadingPage";
import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAppDispatch } from "@store";

export default function AdminMiddleware() {
  const dispatch = useAppDispatch();
  const { data, isLoading, isError } = useGetCurrentUserQuery();
  const isAdmin = data?.user.role === UserType.ADMIN;
  const accessDenied = !isLoading && (isError || !isAdmin);

  useEffect(() => {
    if (!accessDenied) return;

    dispatch(clearUserGlobalState());
    emitAlert("You do not have permission to access the admin area", "error", 2500);
  }, [accessDenied, dispatch]);

  if (isLoading) return <LoadingPage />;
  if (accessDenied) return <Navigate replace to="/discover" />;

  return <Outlet />;
}
