import { useGetCurrentUserQuery } from "@api/userApi";
import { UserType } from "@appTypes/User";
import { clearUserGlobalState } from "@globalState/userSlice";
import { emitAlert } from "@lib/alerts";
import LoadingPage from "@shared/LoadingPage";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppDispatch } from "@store";

export default function AdminMiddleware() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data, isLoading, isError } = useGetCurrentUserQuery();

  function handleFailure() {
    emitAlert("Failed to verify User role", "error", 2500);
    dispatch(clearUserGlobalState());
    navigate("/discover");
  }

  useEffect(() => {
    if (isError) handleFailure;
  }, [navigate, dispatch, isError]);

  if (isLoading) return <LoadingPage />;

  if (!data || !data.user || !data.user.role) handleFailure;

  if (data?.user.role === UserType.ADMIN) return <Outlet />;
}
