import { z } from "zod";
import { nonEmptyString, nonNegativeNumber } from "./validator.utils.js";

export const pagesSchema = z
  .array(
    z.object({
      imageKey: nonEmptyString,
      fileName: nonEmptyString,
      fileSize: nonNegativeNumber,
    }),
  )
  .min(1);
