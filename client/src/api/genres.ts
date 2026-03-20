import type { Genre } from "../Components/AdminComponents/manga.utils";
import { BASE_URL, GET_ALL_GENRES_URL } from "../routes";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const genresApi = createApi({
  reducerPath: "genresApi",

  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}api`,
  }),

  endpoints: (builder) => ({
    getAllGenres: builder.query<Genre[], void>({
      query: () => GET_ALL_GENRES_URL,
      transformResponse: (response: { message: string; genres: Genre[] }) => {
        return response.genres;
      },
    }),
  }),
});

export const { useGetAllGenresQuery } = genresApi;
