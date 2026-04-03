import { z } from "zod";
import {
  contentTypeSchema,
  fileTypeSchema,
  nonEmptyString,
  nonNegativeNumber,
} from "./validator.utils.js";

const chapterUploadSchema = z.array(
  z.object({
    fileName: nonEmptyString,
    contentType: contentTypeSchema,
    size: nonNegativeNumber,
    type: fileTypeSchema,
  }),
);

export const uploadImageDataSchema = z
  .object({
    fileName: nonEmptyString,
    contentType: contentTypeSchema,
    mangaId: nonEmptyString,
    mangaChapter: nonNegativeNumber,
    size: nonNegativeNumber,
    type: fileTypeSchema,
    chapters: chapterUploadSchema,
  })
  .partial();
