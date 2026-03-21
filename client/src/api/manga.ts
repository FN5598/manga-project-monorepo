import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL, UPDADE_MANGA_URL, UPLOAD_MANGA_URL } from "../routes";
import type {
  UploadMangaPayload,
  UploadMangaReponse,
  UpdateMangaPayload,
  UpdateMangaResponse,
  MangaStatus,
} from "../Components/AdminComponents/manga.utils";
import { FIND_MANGA_BY_ID, GET_ALL_MANGAS } from "./queries/graphql";

type uploadMangaResponse = {
  mangaData: UploadMangaReponse;
  message: string;
};

type Manga = {
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

type getAllMangaResponse = {
  data: {
    findAllMangas: Manga[];
  };
};

export type PaginationInput = {
  limit: number;
  page?: number;
};

export type SortInput = {
  sortBy: "asc" | "desc";
};

export type PaginationSortInput = {
  paginationInput?: PaginationInput;
  sort?: SortInput;
};

type FindMangaByIdResponse = {
  data: {
    findMangaById: Manga;
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
      transformResponse: (response: getAllMangaResponse) => {
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
    getMangaById: builder.query<Manga, { mangaId: string }>({
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
  }),
});

export const {
  useUploadMangaMutation,
  useGetAllMangasQuery,
  useUpdateMangaMutation,
  useGetMangaByIdQuery,
} = mangaApi;
