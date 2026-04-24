import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL, UPDADE_MANGA_URL, UPLOAD_MANGA_URL } from "../routes";
import type {
  UploadMangaPayload,
  UploadMangaReponse,
  UpdateMangaPayload,
  UpdateMangaResponse,
  MangaStatus,
} from "../Components/AdminComponents/manga.utils";
import {
  FIND_MANGA_BY_ID,
  FIND_MANGA_BY_NAME,
  GET_ALL_MANGAS,
} from "./queries/graphql";
import { type PaginationSortInput } from "../index.types";

export type Manga = {
  _id: string;
  title: string;
  author: string;
  description?: string;
  previewUrl: string;
  status: MangaStatus;
  genres: {
    name?: string;
    description?: string;
    _id?: string;
    slug?: string;
  }[];
  chaptersCount: number;
  createdAt: string;
  updatedAt: string;
};

type UploadMangaResponse = {
  mangaData: UploadMangaReponse;
  message: string;
};

type GetAllMangaResponse = {
  data: {
    findAllMangas: Manga[];
  };
};

type FindMangaByIdResponse = {
  data: {
    findMangaById: Manga;
  };
};

type FindMangaByNameBody = {
  data: {
    findMangaByName: Manga[];
  };
};

type GetMangaById = {
  mangaId: string;
};

type FindChapterByName = {
  mangaTitle: string;
};

export const mangaApi = createApi({
  reducerPath: "mangaApi",

  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}`,
    credentials: "include",
  }),

  endpoints: (builder) => ({
    uploadManga: builder.mutation<
      UploadMangaResponse,
      { mangaData: UploadMangaPayload }
    >({
      query: (body) => ({
        url: `manga/${UPLOAD_MANGA_URL}`,
        method: "POST",
        body,
      }),
    }),
    getAllMangas: builder.query<Manga[], void | PaginationSortInput>({
      query: (params) => ({
        url: `graphql`,
        method: "POST",
        body: {
          query: GET_ALL_MANGAS,
          variables: {
            paginationInput: params?.paginationInput,
            sort: params?.sort,
          },
        },
      }),
      transformResponse: (response: GetAllMangaResponse) => {
        return response.data.findAllMangas;
      },
    }),
    updateManga: builder.mutation<UpdateMangaResponse, UpdateMangaPayload>({
      query: (body) => ({
        url: `manga/${UPDADE_MANGA_URL}`,
        method: "PUT",
        body,
      }),
    }),
    getMangaById: builder.query<Manga, GetMangaById>({
      query: (payload) => ({
        url: "graphql",
        method: "POST",
        body: {
          query: FIND_MANGA_BY_ID,
          variables: {
            mangaId: payload.mangaId,
          },
        },
      }),
      transformResponse: (response: FindMangaByIdResponse) => {
        return response.data.findMangaById;
      },
    }),
    findChapterByName: builder.query<Manga[], FindChapterByName>({
      query: (payload) => ({
        url: "graphql",
        method: "POST",
        body: {
          query: FIND_MANGA_BY_NAME,
          variables: {
            mangaTitle: payload.mangaTitle,
          },
        },
      }),
      transformResponse: (response: FindMangaByNameBody) => {
        return response.data.findMangaByName;
      },
    }),
  }),
});

export const {
  useUploadMangaMutation,
  useGetAllMangasQuery,
  useUpdateMangaMutation,
  useGetMangaByIdQuery,
  useFindChapterByNameQuery,
} = mangaApi;
