import { z } from "zod";
import { nonEmptyString, nonNegativeNumber } from "./validator.utils.js";
import { pagesSchema } from "./pages.validators.js";

export const addChapterToMangaSchema = z.object({
  mangaId: nonEmptyString,
  chapterTitle: nonEmptyString,
  chapterNumber: nonNegativeNumber,
  pages: pagesSchema,
});
