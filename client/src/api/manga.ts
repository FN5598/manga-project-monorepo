import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL, UPLOAD_MANGA_URL } from "../routes";
import type { UploadMangaPayload } from "../Components/AdminComponents/manga.utils";
import { GET_ALL_MANGAS } from "./queries/graphql";

type uploadMangaResponse = {
  mangaData: UploadMangaPayload;
  message: string;
};

type Manga = {
  title: string;
  author: string;
  description?: string;
  previewUrl: string;
  genres: string[];
  chaptersCount: number;
  createdAt: string;
  updatedAt: string;
};

type getAllMangaResponse = {
  data: {
    findAllMangas: Manga[];
  };
};

export const mangaApi = createApi({
  reducerPath: "mangaApi",

  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}`,
  }),

  endpoints: (builder) => ({
    uploadManga: builder.mutation<
      uploadMangaResponse,
      { mangaData: UploadMangaPayload }
    >({
      query: (body) => ({
        url: `manga/${UPLOAD_MANGA_URL}`,
        method: "POST",
        body,
      }),
    }),
    getAllMangas: builder.query<Manga[], void>({
      query: () => ({
        url: `graphql`,
        method: "POST",
        body: {
          query: GET_ALL_MANGAS,
        },
      }),
      transformResponse: (response: getAllMangaResponse) => {
        return response.data.findAllMangas;
      },
    }),
  }),
});

export const { useUploadMangaMutation, useGetAllMangasQuery } = mangaApi;
