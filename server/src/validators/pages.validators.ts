import { z } from "zod";
import {
  nonEmptyString,
  nonNegativeNumber,
  paginationSchema,
  sortSchema,
} from "./validator.utils.js";

export const pagesSchema = z
  .array(
    z.object({
      imageKey: nonEmptyString,
      fileName: nonEmptyString,
      fileSize: nonNegativeNumber,
    }),
  )
  .min(1);

export const getPagesSchema = z
  .object({
    chapterId: nonEmptyString,
  })
  .extend(paginationSchema.shape)
  .extend(sortSchema.shape);
