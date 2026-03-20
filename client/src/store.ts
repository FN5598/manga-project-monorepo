import { configureStore } from "@reduxjs/toolkit";
import { genresApi } from "./api/genres";
import { awsApi } from "./api/S3";
import { mangaApi } from "./api/manga";

export const store = configureStore({
  reducer: {
    [genresApi.reducerPath]: genresApi.reducer,
    [awsApi.reducerPath]: awsApi.reducer,
    [mangaApi.reducerPath]: mangaApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      genresApi.middleware,
      awsApi.middleware,
      mangaApi.middleware,
    ),
});
