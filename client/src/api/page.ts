import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../routes";
import { GET_PAGES_BY_CHAPTER_ID } from "./queries/graphql";
import { type SortInput, type PaginationInput } from "./manga";

export type Page = {
  _id: string;
  chapter: string;
  imageKey: string;
  fileSize: number;
  createdAt: string;
  pageUrl: string;
  updatedAt: string;
};

type GetPagesByChapterIdInput = {
  chapterId: string;
  sort?: SortInput;
  paginationInput?: PaginationInput;
};

type GetPagesByChapterIdResponseBody = {
  data: {
    getPagesByChapterId: Page[];
  };
};

export const pagesApi = createApi({
  reducerPath: "pagesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  endpoints: (builder) => ({
    getPagesByChapterId: builder.query<Page[], GetPagesByChapterIdInput>({
      query: (payload) => ({
        url: "graphql",
        method: "POST",
        body: {
          query: GET_PAGES_BY_CHAPTER_ID,
          variables: {
            chapterId: payload.chapterId,
            paginationInput: payload.paginationInput,
            sort: payload.sort,
          },
        },
      }),
      transformResponse: (response: GetPagesByChapterIdResponseBody) => {
        return response.data.getPagesByChapterId;
      },
    }),
  }),
});

export const { useLazyGetPagesByChapterIdQuery } = pagesApi;
