import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../routes";
import {
  FIND_CHAPTER_BY_ID,
  FIND_CHAPTERS_BY_MANGA_ID,
} from "./queries/graphql";

type Chapter = {
  _id: string;
  mangaId: string;
  chapterNumber: number;
  title: string;
  storagePrefix: string;
  pageCount: number;
  uploadStatus: string; //  TODO make enum
  createdAt: string;
  updatedAt: string;
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

export const chaptersApi = createApi({
  reducerPath: "chaptersApi",

  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),

  endpoints: (builder) => ({
    findChapterByMangaId: builder.query<Chapter[], { mangaId: string }>({
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
    findChapterById: builder.query<Chapter, { chapterId: string }>({
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
  }),
});

export const { useFindChapterByMangaIdQuery, useFindChapterByIdQuery } =
  chaptersApi;
