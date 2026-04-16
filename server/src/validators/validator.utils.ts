import "reflect-metadata";
import { z } from "zod";
import { FileType, SortInput } from "@config/constants.js";
import logger from "@config/logger.js";
import { InputValidationError } from "@errors/Error.js";

type FormatReturn = {
  message: string;
  code: string;
  fiield?: string;
};

export const formatIssues = (error: z.ZodError): FormatReturn[] =>
  error.issues.map((issue) => {
    const field = issue.path;
    return {
      message: issue.message,
      code: issue.code,
      ...(field.length > 0 ? { field: issue.path.join(".") } : {}),
    };
  });

export function validateGraphQLInput<T>(
  schema: z.ZodSchema<T>,
  input: unknown,
): T {
  const result = schema.safeParse(input);

  if (!result.success) {
    const issue: FormatReturn = formatIssues(result.error)[0];

    logger.info("Failed to validate input", {
      issue,
    });
    throw new InputValidationError(issue);
  }
  return result.data;
}

export function validateInput<T>(schema: z.ZodType<T>, input: unknown) {
  const result = schema.safeParse(input);

  if (!result.success) {
    const issue: FormatReturn = formatIssues(result.error)[0];

    throw new InputValidationError(issue);
  }

  return result.data;
}

// * Helper functions to check zod input
export const nonEmptyString = z.string().trim().min(1);
export const nonNegativeNumber = z.number().min(0);
export function setDefaultStringValue(defaultValue: string) {
  return z.preprocess((val) => {
    if (val === null) return undefined;
    return String(val);
  }, z.string().trim().default(defaultValue));
}

export const contentTypeSchema = z.enum([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export const fileTypeSchema = z.enum([FileType.preview, FileType.page]);

export const sortEnumSchema = z.enum([SortInput.ASC, SortInput.DESC]);
export const sortFieldEnum = z.enum(["createdAt"]);

export const sortSchema = z.object({
  sort: z
    .object({
      sortBy: sortEnumSchema,
      field: sortFieldEnum,
    })
    .optional(),
});

export const paginationSchema = z.object({
  paginationInput: z
    .object({
      page: nonNegativeNumber.optional(),
      limit: nonNegativeNumber.optional(),
    })
    .optional(),
});

export const paginationSortSchema = paginationSchema.extend(sortSchema.shape);

export type PaginationType = z.infer<typeof paginationSchema>;
