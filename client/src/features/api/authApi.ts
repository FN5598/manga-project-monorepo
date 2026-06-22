import type { ApiSuccessResponse } from "@appTypes/api";
import { apiSlice } from "@api/apiSlice";
import type { User } from "@appTypes/User";
import { appUrl } from "./routes";

type SignUpInput = {
  email: string;
  password: string;
  username: string;
};

type LoginInput = {
  password: string;
  email: string;
};

type SignUpData = { user: User; message: string };
type LoginData = { message: string; isLoggedIn: boolean; user: User };
type LogoutData = { message: string };

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    signUp: builder.mutation<SignUpData, SignUpInput>({
      query: (body) => ({
        url: appUrl.SIGN_UP,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
      transformResponse: (response: ApiSuccessResponse<SignUpData>) => {
        return response.data;
      },
    }),
    login: builder.mutation<LoginData, LoginInput>({
      query: (body) => ({
        url: appUrl.LOGIN,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
      transformResponse: (response: ApiSuccessResponse<LoginData>) => {
        return response.data;
      },
    }),
    logout: builder.mutation<LogoutData, void>({
      query: () => ({
        url: appUrl.LOGOUT,
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
      transformErrorResponse: (response: ApiSuccessResponse<LogoutData>) => {
        return response.data;
      },
    }),
  }),
});

export const { useSignUpMutation, useLoginMutation, useLogoutMutation } =
  authApi;
