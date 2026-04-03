import "reflect-metadata";
import { z } from "zod";
import { GraphQLError } from "graphql";
import { FileType } from "@config/constants.js";
import logger from "@config/logger.js";
import { InputValidationError } from "@errors/Error.js";

export const formatIssues = (error: z.ZodError): FormatReturn[] =>
  error.issues.map((issue) => {
    const field = issue.path;
    return {
      message: issue.message,
      code: issue.code,
      ...(field.length > 0 ? { field: issue.path.join(".") } : {}),
    };
  });

export function validateOrThrowGraphQL<T>(
  schema: z.ZodSchema<T>,
  input: unknown,
): T {
  const result = schema.safeParse(input);
  if (!result.success) {
    const issues = formatIssues(result.error);
    logger.error(`Validatation error`, {
      issues,
      input,
    });
    throw new GraphQLError("Invalid input", {
      extensions: {
        code: "BAD_USER_INPUT",
        issues,
      },
    });
  }
  return result.data;
}

type FormatReturn = {
  message: string;
  code: string;
  fiield?: string;
};

export function validateInput<T>(schema: z.ZodType<T>, input: unknown) {
  const result = schema.safeParse(input);

  if (!result.success) {
    const issues: FormatReturn[] = formatIssues(result.error);

    logger.error("Validation error", {
      issues,
      input,
    });

    throw new InputValidationError("Failed to validate input", issues);
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
