import { z } from "zod";
import { pagesSchema } from "./pages.validators.js";
import {
  nonEmptyString,
  nonNegativeNumber,
  setDefaultStringValue,
} from "./validator.utils.js";

export enum MangaStatus {
  ONGOING = "ongoing",
  COMPLETED = "completed",
  HIATUS = "hiatus",
  CANCELLED = "cancelled",
}
const mangaStatusSchema = z.enum(MangaStatus);

export const uploadMangaSchema = z.object({
  mangaData: z.object({
    title: nonEmptyString.max(100),
    author: nonEmptyString.max(50),
    description: setDefaultStringValue("No description provided as of yet."),
    genres: z.array(nonEmptyString).min(1).optional(),
    status: mangaStatusSchema,
  }),
});

export const uploadMangaSchemaGQL = z.object({
  title: nonEmptyString.max(100),
  author: nonEmptyString.max(50),
  description: setDefaultStringValue("No description provided as of yet."),
  genres: z.array(nonEmptyString).min(1).optional(),
  status: mangaStatusSchema,
});

export const updateMangaSchema = z.object({
  manga: z.object({
    _id: nonEmptyString,
    previewKey: nonEmptyString,
  }),
  chapter: z.object({
    chapterNumber: nonNegativeNumber,
    title: nonEmptyString,
  }),
  pages: pagesSchema,
});
