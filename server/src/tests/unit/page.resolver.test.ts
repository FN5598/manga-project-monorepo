import { SortInput } from "@config/constants.js";
import { InputValidationError } from "@errors/Error.js";
import { Page } from "@models/page.model.js";
import { PageRepository } from "@repository/index.js";
import { PageResolver } from "@resolvers/page.resolvers.js";
import { PaginationInput, SortInputType } from "@resolvers/resolver.utils.js";

jest.mock("@repository/index.js", () => ({
  PageRepository: {
    getPagesByChapterId: jest.fn(),
  },
}));

const mockedPageRepository = PageRepository as jest.Mocked<
  typeof PageRepository
>;

let resolver: PageResolver;

beforeEach(() => {
  jest.clearAllMocks();
  resolver = new PageResolver();
});

describe("Page resolver", () => {
  describe("getPagesByChapterId", () => {
    test("Should throw - InputValidationError if chapterId is empty", async () => {
      await expect(
        resolver.getPagesByChapterId("", undefined!, undefined!),
      ).rejects.toThrow(InputValidationError);
      expect(mockedPageRepository.getPagesByChapterId).not.toHaveBeenCalled();
    });

    test("Should throw - InputValidationError if pagination is invalid", async () => {
      const pagination = { page: 1, limit: -1 } as PaginationInput;

      await expect(
        resolver.getPagesByChapterId("chapter-id", pagination, undefined!),
      ).rejects.toThrow(InputValidationError);
      expect(mockedPageRepository.getPagesByChapterId).not.toHaveBeenCalled();
    });

    test("Should throw - InputValidationError if sort is invalid", async () => {
      const sort = {
        sortBy: SortInput.ASC,
        field: "updatedAt",
      } as unknown as SortInputType;

      await expect(
        resolver.getPagesByChapterId("chapter-id", undefined!, sort),
      ).rejects.toThrow(InputValidationError);
      expect(mockedPageRepository.getPagesByChapterId).not.toHaveBeenCalled();
    });

    test("Should return pages found by chapterId", async () => {
      const pagination = { page: 2, limit: 20 };
      const sort = {
        sortBy: SortInput.ASC,
        field: "createdAt",
      } satisfies SortInputType;
      const pages = [
        { _id: "page-1" },
        { _id: "page-2" },
      ] as unknown as Page[];
      mockedPageRepository.getPagesByChapterId.mockResolvedValue(pages);

      const result = await resolver.getPagesByChapterId(
        "  chapter-id  ",
        pagination,
        sort,
      );

      expect(mockedPageRepository.getPagesByChapterId).toHaveBeenCalledWith(
        "chapter-id",
        pagination,
        sort,
      );
      expect(result).toBe(pages);
    });

    test("Should allow omitted pagination and sort inputs", async () => {
      mockedPageRepository.getPagesByChapterId.mockResolvedValue([]);

      const result = await resolver.getPagesByChapterId(
        "chapter-id",
        undefined!,
        undefined!,
      );

      expect(mockedPageRepository.getPagesByChapterId).toHaveBeenCalledWith(
        "chapter-id",
        undefined,
        undefined,
      );
      expect(result).toEqual([]);
    });
  });

  describe("pageUrl", () => {
    test("Should return null when the page has no image key", () => {
      expect(resolver.pageUrl({} as Page)).toBeNull();
    });

    test("Should return the public URL for the page image", () => {
      const page = {
        imageKey: "mangas/Manga One/chapter 1/page 1.png",
      } as Page;

      expect(resolver.pageUrl(page)).toBe(
        "http://localhost:9000/manga-project-bucket/mangas/Manga%20One/chapter%201/page%201.png",
      );
    });
  });
});
