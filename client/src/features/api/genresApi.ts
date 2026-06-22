import type { Genre } from "@appTypes/Genres";
import { appUrl } from "@api/routes";
import { apiSlice } from "@api/apiSlice";
import type { ApiSuccessResponse } from "@appTypes/api";

type GetAllGenresData = { message: string; genres: Genre[] };

export const genresApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllGenres: builder.query<Genre[], void>({
      query: () => appUrl.GET_ALL_GENRES,
      transformResponse: (response: ApiSuccessResponse<GetAllGenresData>) => {
        return response.data.genres;
      },
    }),
  }),
});

export const { useGetAllGenresQuery } = genresApi;
