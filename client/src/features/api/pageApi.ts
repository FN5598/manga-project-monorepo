import { GET_PAGES_BY_CHAPTER_ID } from "@api/graphql.queries";
import type { PaginationInput, SortInput } from "@appTypes/index";
import { apiSlice } from "@api/apiSlice";
import type { Page } from "@appTypes/Page";
import type { GraphQLResponse } from "@appTypes/api";

type GetPagesByChapterIdInput = {
  chapterId: string;
  sort?: SortInput;
  paginationInput?: PaginationInput;
};

type GetPagesByChapterIdResponseBody = GraphQLResponse<{
  getPagesByChapterId: Page[];
}>;

export const pagesApi = apiSlice.injectEndpoints({
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
