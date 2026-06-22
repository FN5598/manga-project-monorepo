import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { BASE_URL } from "@api/routes";
import {
  clearUserGlobalState,
  setUserGlobalState,
  type AuthState,
} from "@globalState/userSlice";
import type { ApiErrorResponse } from "@appTypes/api";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error) {
    const error = result.error as FetchBaseQueryError;
    const data = error.data as ApiErrorResponse | undefined;
    if (data?.status === 401) {
      const refreshResult = await rawBaseQuery(
        {
          url: "/api/auth/refresh",
          method: "POST",
        },
        api,
        extraOptions,
      );

      const refreshData = refreshResult.data as AuthState;
      if (refreshResult.error) {
        api.dispatch(clearUserGlobalState());
      }

      if (refreshData.user) {
        api.dispatch(
          setUserGlobalState({
            user: refreshData.user,
            isLoggedIn: refreshData.isLoggedIn,
          }),
        );
      }

      result = await rawBaseQuery(args, api, extraOptions);
    }
  }
  return result;
};
