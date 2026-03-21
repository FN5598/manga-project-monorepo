import { configureStore } from "@reduxjs/toolkit";
import { genresApi } from "./api/genres";
import { awsApi } from "./api/S3";
import { mangaApi } from "./api/manga";
import { chaptersApi } from "./api/chapter";
import { pagesApi } from "./api/page";

export const store = configureStore({
  reducer: {
    [genresApi.reducerPath]: genresApi.reducer,
    [awsApi.reducerPath]: awsApi.reducer,
    [mangaApi.reducerPath]: mangaApi.reducer,
    [chaptersApi.reducerPath]: chaptersApi.reducer,
    [pagesApi.reducerPath]: pagesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      genresApi.middleware,
      awsApi.middleware,
      mangaApi.middleware,
      chaptersApi.middleware,
      pagesApi.middleware,
    ),
});
