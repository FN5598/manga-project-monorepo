import { appUrl } from "./routes";
import type {
  UploadMangaPayload,
  UpdateMangaPayload,
  Manga,
  UpdateMangaResponse,
} from "@appTypes/Manga";
import {
  FIND_MANGA_BY_ID,
  FIND_MANGA_BY_NAME,
  GET_ALL_MANGAS,
} from "./graphql.queries";
import { type PaginationSortFilterInput } from "@appTypes/index";
import { apiSlice } from "@api/apiSlice";
import type { ApiSuccessResponse, GraphQLResponse } from "@appTypes/api";

type FindMangaByNameResponse = GraphQLResponse<{ findMangaByName: Manga[] }>;
type UploadMangaResponse = ApiSuccessResponse<{ mangaData: Manga }>;
type FindMangaByIdResponse = GraphQLResponse<{ findMangaById: Manga }>;
type GetAllMangaData = {
  mangas: Manga[];
  mangaCount: number;
};
type GetAllMangaResponse = GraphQLResponse<{
  findAllMangas: Manga[];
  countMangas: number;
}>;

export const mangaApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadManga: builder.mutation<
      UploadMangaResponse,
      { mangaData: UploadMangaPayload }
    >({
      query: (body) => ({
        url: appUrl.UPLOAD_MANGA_CHAPTER,
        method: "POST",
        body,
      }),
    }),
    getAllMangas: builder.query<
      GetAllMangaData,
      PaginationSortFilterInput | void
    >({
      query: (params) => ({
        url: `graphql`,
        method: "POST",
        body: {
          query: GET_ALL_MANGAS,
          variables: {
            paginationInput: params?.paginationInput,
            sort: params?.sort,
            filters: params?.filters,
          },
        },
      }),
      transformResponse: (response: GetAllMangaResponse) => {
        return {
          mangas: response.data.findAllMangas,
          mangaCount: response.data.countMangas,
        };
      },
    }),
    updateManga: builder.mutation<UpdateMangaResponse, UpdateMangaPayload>({
      query: (body) => ({
        url: appUrl.UPDATE_MANGA,
        method: "PUT",
        body,
      }),
    }),
    getMangaById: builder.query<Manga, string>({
      query: (mangaId) => ({
        url: "graphql",
        method: "POST",
        body: {
          query: FIND_MANGA_BY_ID,
          variables: {
            mangaId,
          },
        },
      }),
      transformResponse: (response: FindMangaByIdResponse) => {
        return response.data.findMangaById;
      },
    }),
    findChapterByName: builder.query<Manga[], string>({
      query: (mangaTitle) => ({
        url: "graphql",
        method: "POST",
        body: {
          query: FIND_MANGA_BY_NAME,
          variables: {
            mangaTitle,
          },
        },
      }),
      transformResponse: (response: FindMangaByNameResponse) => {
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
  useLazyGetAllMangasQuery,
} = mangaApi;
