import { type User } from "@appTypes/User";
import { DELETE_USER_BY_ID } from "@api/graphql.queries";
import { apiSlice } from "@api/apiSlice";
import { appUrl } from "./routes";

type GetCurrentUserResponse = {
  user: User;
  isLoggedIn: boolean;
};

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentUser: builder.query<GetCurrentUserResponse, void>({
      query: (body) => ({
        url: appUrl.GET_CURRENT_USER,
        method: "GET",
        body,
      }),
      providesTags: ["Auth"],
    }),
    deleteUserById: builder.mutation<User, string>({
      query: (userId) => ({
        url: "graphql",
        method: "POST",
        body: {
          query: DELETE_USER_BY_ID,
          variables: {
            userId,
          },
        },
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const { useDeleteUserByIdMutation, useGetCurrentUserQuery } = userApi;
