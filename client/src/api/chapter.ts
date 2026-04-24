import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../routes";
import {
  FIND_ALL_CHAPTERS,
  FIND_CHAPTER_BY_ID,
  FIND_CHAPTERS_BY_MANGA_ID,
} from "./queries/graphql";
import type { PaginationSortInput } from "../index.types";

export enum UploadStatus {
  DRAFT = "draft",
  UPLOADING = "uploading",
  READY = "ready",
  FAILED = "failed",
}

type Chapter = {
  _id: string;
  mangaId: string;
  chapterNumber: number;
  title: string;
  storagePrefix: string;
  pageCount: number;
  uploadStatus: UploadStatus;
  createdAt: string;
  updatedAt: string;
};

export type addChapterPayload = {
  mangaId: string;
  chapterTitle: string;
  chapterNumber: number;
  pages: {
    imageKey: string;
    fileName: string;
    fileSize: number;
  }[];
};

export type FindChapterByMangaIdInput = {
  mangaId: string;
};

export type FindChapterById = {
  chapterId: string;
};

type FindChaptersResponseBody = {
  data: {
    findChaptersByMangaId: Chapter[];
  };
};

type FindChapterByIdBody = {
  data: {
    findChapterById: Chapter;
  };
};

type FindAllChapersBody = {
  data: {
    findAllChapters: Chapter[];
  };
};

export const chaptersApi = createApi({
  reducerPath: "chaptersApi",

  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
  }),

  endpoints: (builder) => ({
    findChapterByMangaId: builder.query<Chapter[], FindChapterByMangaIdInput>({
      query: (payload) => ({
        url: "/graphql",
        method: "POST",
        body: {
          query: FIND_CHAPTERS_BY_MANGA_ID,
          variables: {
            mangaId: payload.mangaId,
          },
        },
      }),
      transformResponse: (response: FindChaptersResponseBody) => {
        return response.data.findChaptersByMangaId;
      },
    }),
    findChapterById: builder.query<Chapter, FindChapterById>({
      query: (payload) => ({
        url: "graphql",
        method: "POST",
        body: {
          query: FIND_CHAPTER_BY_ID,
          variables: {
            chapterId: payload.chapterId,
          },
        },
      }),
      transformResponse: (response: FindChapterByIdBody) => {
        return response.data.findChapterById;
      },
    }),
    createChapterForManga: builder.mutation<
      { message: string },
      addChapterPayload
    >({
      query: (body) => ({
        url: "/api/chapter/create-chapter",
        method: "POST",
        body,
      }),
    }),
    findAllChapters: builder.query<Partial<Chapter[]>, PaginationSortInput>({
      query: (payload) => ({
        url: "/graphql",
        method: "POST",
        body: {
          query: FIND_ALL_CHAPTERS,
          varaibles: {
            paginationInput: payload.paginationInput,
            sort: payload.sort,
          },
        },
      }),
      transformResponse: (response: FindAllChapersBody) => {
        return response.data.findAllChapters;
      },
    }),
  }),
});

export const {
  useFindChapterByMangaIdQuery,
  useFindChapterByIdQuery,
  useCreateChapterForMangaMutation,
  useFindAllChaptersQuery,
} = chaptersApi;
