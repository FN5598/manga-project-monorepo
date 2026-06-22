import type React from "react";
import { useEffect } from "react";
import { useGetCurrentUserQuery } from "@api/userApi";
import {
  clearUserGlobalState,
  setUserGlobalState,
} from "@globalState/userSlice";
import LoadingPage from "../shared/LoadingPage";
import { useAppDispatch } from "@store";

type InitialAuthProps = {
  children: React.ReactNode;
};

export default function InitialAuth({ children }: InitialAuthProps) {
  const dispatch = useAppDispatch();

  const { data, isLoading, isError, isSuccess } = useGetCurrentUserQuery();

  useEffect(() => {
    if (isError) {
      dispatch(clearUserGlobalState());
    }

    if (isSuccess && data) {
      dispatch(setUserGlobalState({ user: data.user, isLoggedIn: true }));
    }
  }, [isSuccess, isError, dispatch, data]);

  if (isLoading) {
    return <LoadingPage />;
  }

  return children;
}
