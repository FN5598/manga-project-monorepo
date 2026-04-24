import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../routes";

type SignUpInput = {
  email: string;
  password: string;
  username: string;
};

type LoginInput = {
  password: string;
  email: string;
};

type RefreshTokenInput = {
  userId: string;
};

type Response = {
  message: string;
  code?: string;
  errorInfo?: {
    message: string;
    code: string;
    field: string;
  };
};

export const authApi = createApi({
  reducerPath: "authApi",

  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}api/auth`,
    credentials: "include",
  }),

  endpoints: (builder) => ({
    signUp: builder.mutation<Response, SignUpInput>({
      query: (body) => ({
        url: "sign-up",
        method: "POST",
        body,
      }),
    }),
    login: builder.mutation<Response, LoginInput>({
      query: (body) => ({
        url: "login",
        method: "POST",
        body,
      }),
    }),
    refreshAccessToken: builder.mutation<Response, RefreshTokenInput>({
      query: (body) => ({
        url: "refresh",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useSignUpMutation,
  useLoginMutation,
  useRefreshAccessTokenMutation,
} = authApi;
