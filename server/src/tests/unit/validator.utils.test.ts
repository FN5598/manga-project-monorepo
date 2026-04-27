import { z } from "zod";
import { SortInput } from "@config/constants.js";
import { InputValidationError } from "@errors/Error.js";
import {
  contentTypeSchema,
  fileTypeSchema,
  formatIssues,
  nonEmptyString,
  nonNegativeNumber,
  paginationSortSchema,
  setDefaultStringValue,
  sortSchema,
  validateGraphQLInput,
  validateInput,
} from "@validators/validator.utils.js";

describe("validator utils", () => {
  it("formats zod issues with path fields", () => {
    const result = z.object({ title: nonEmptyString }).safeParse({ title: "" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(formatIssues(result.error)[0]).toEqual(
        expect.objectContaining({
          code: "too_small",
          field: "title",
        }),
      );
    }
  });

  it("returns parsed input or throws InputValidationError", () => {
    const schema = z.object({ name: nonEmptyString });

    expect(validateInput(schema, { name: "  reader  " })).toEqual({
      name: "reader",
    });
    expect(() => validateInput(schema, { name: " " })).toThrow(
      InputValidationError,
    );
  });

  it("validates GraphQL input with the same error type", () => {
    expect(validateGraphQLInput(nonNegativeNumber, 0)).toBe(0);
    expect(() => validateGraphQLInput(nonNegativeNumber, -1)).toThrow(
      InputValidationError,
    );
  });

  it("defaults nullish string values and coerces other values to strings", () => {
    const schema = setDefaultStringValue("fallback");

    expect(schema.parse(null)).toBe("fallback");
    expect(schema.parse(123)).toBe("123");
  });

  it("validates shared enum and pagination schemas", () => {
    expect(contentTypeSchema.parse("image/webp")).toBe("image/webp");
    expect(fileTypeSchema.parse("PAGE")).toBe("PAGE");
    expect(
      sortSchema.parse({
        sort: { sortBy: SortInput.DESC, field: "createdAt" },
      }),
    ).toEqual({ sort: { sortBy: SortInput.DESC, field: "createdAt" } });
    expect(
      paginationSortSchema.parse({
        paginationInput: { page: 1, limit: 10 },
        sort: { sortBy: SortInput.ASC, field: "createdAt" },
      }),
    ).toEqual({
      paginationInput: { page: 1, limit: 10 },
      sort: { sortBy: SortInput.ASC, field: "createdAt" },
    });
  });
});
