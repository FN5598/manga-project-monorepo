import {
  FIND_ALL_CHAPTERS,
  FIND_CHAPTER_BY_ID,
  FIND_CHAPTERS_BY_MANGA_ID,
} from "@api/graphql.queries";
import type { PaginationSortInput } from "@appTypes/index";
import type { Chapter } from "@appTypes/Chapter";
import { apiSlice } from "@api/apiSlice";
import type { GraphQLResponse } from "@appTypes/api";
import { appUrl } from "./routes";

type FindChaptersResponse = GraphQLResponse<{
  findChaptersByMangaId: Chapter[];
}>;
type FindChapterByIdResponse = GraphQLResponse<{ findChapterById: Chapter }>;
type FindAllChapersResponse = GraphQLResponse<{ findAllChapters: Chapter[] }>;
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

export const chaptersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createChapterForManga: builder.mutation<
      { message: string },
      addChapterPayload
    >({
      query: (body) => ({
        url: appUrl.CREATE_CHAPTER,
        method: "POST",
        body,
      }),
    }),
    findChapterByMangaId: builder.query<Chapter[], string>({
      query: (mangaId) => ({
        url: "/graphql",
        method: "POST",
        body: {
          query: FIND_CHAPTERS_BY_MANGA_ID,
          variables: {
            mangaId,
          },
        },
      }),
      transformResponse: (response: FindChaptersResponse) => {
        return response.data.findChaptersByMangaId;
      },
    }),
    findChapterById: builder.query<Chapter, string>({
      query: (chapterId) => ({
        url: "graphql",
        method: "POST",
        body: {
          query: FIND_CHAPTER_BY_ID,
          variables: {
            chapterId,
          },
        },
      }),
      transformResponse: (response: FindChapterByIdResponse) => {
        return response.data.findChapterById;
      },
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
      transformResponse: (response: FindAllChapersResponse) => {
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
