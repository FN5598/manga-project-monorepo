import { SortInput } from "@config/constants.js";
import { InputValidationError } from "@errors/Error.js";
import { Chapter } from "@models/chapter.model.js";
import { ChapterRepository } from "@repository/index.js";
import { ChapterResolver } from "@resolvers/chapter.resolvers.js";
import { PaginationInput, SortInputType } from "@resolvers/resolver.utils.js";

jest.mock("@repository/index.js", () => ({
  ChapterRepository: {
    findChaptersByMangaId: jest.fn(),
    findChapterById: jest.fn(),
    findAllChapters: jest.fn(),
  },
}));

const mockedChapterRepository = ChapterRepository as jest.Mocked<
  typeof ChapterRepository
>;

let resolver: ChapterResolver;

beforeEach(() => {
  jest.clearAllMocks();
  resolver = new ChapterResolver();
});

describe("Chapter resolver", () => {
  describe("findChaptersByMangaId", () => {
    test("Should throw - InputValidationError if mangaId is empty", async () => {
      await expect(resolver.findChaptersByMangaId("")).rejects.toThrow(
        InputValidationError,
      );
      expect(
        mockedChapterRepository.findChaptersByMangaId,
      ).not.toHaveBeenCalled();
    });

    test("Should return chapters found by mangaId", async () => {
      const chapters = [
        { _id: "chapter-1", mangaId: "manga-id" },
        { _id: "chapter-2", mangaId: "manga-id" },
      ] as unknown as Chapter[];
      mockedChapterRepository.findChaptersByMangaId.mockResolvedValue(chapters);

      const result = await resolver.findChaptersByMangaId("  manga-id  ");

      expect(
        mockedChapterRepository.findChaptersByMangaId,
      ).toHaveBeenCalledWith("manga-id");
      expect(result).toBe(chapters);
    });
  });

  describe("findChapterById", () => {
    test("Should throw - InputValidationError if chapterId is empty", async () => {
      await expect(resolver.findChapterById("   ")).rejects.toThrow(
        InputValidationError,
      );
      expect(mockedChapterRepository.findChapterById).not.toHaveBeenCalled();
    });

    test("Should return the found chapter", async () => {
      const chapter = { _id: "chapter-id" } as unknown as Chapter;
      mockedChapterRepository.findChapterById.mockResolvedValue(chapter);

      const result = await resolver.findChapterById("chapter-id");

      expect(mockedChapterRepository.findChapterById).toHaveBeenCalledWith(
        "chapter-id",
      );
      expect(result).toBe(chapter);
    });
  });

  describe("findAllChapters", () => {
    test("Should throw - InputValidationError if pagination is invalid", async () => {
      const pagination = { page: -1, limit: 10 } as PaginationInput;
      const sort = {
        sortBy: SortInput.ASC,
        field: "createdAt",
      } satisfies SortInputType;

      await expect(resolver.findAllChapters(sort, pagination)).rejects.toThrow(
        InputValidationError,
      );
      expect(mockedChapterRepository.findAllChapters).not.toHaveBeenCalled();
    });

    test("Should throw - InputValidationError if sort is invalid", async () => {
      const pagination = { page: 1, limit: 10 };
      const sort = {
        sortBy: "invalid",
        field: "createdAt",
      } as unknown as SortInputType;

      await expect(resolver.findAllChapters(sort, pagination)).rejects.toThrow(
        InputValidationError,
      );
      expect(mockedChapterRepository.findAllChapters).not.toHaveBeenCalled();
    });

    test("Should return all chapters with parsed inputs", async () => {
      const pagination = { page: 2, limit: 10 };
      const sort = {
        sortBy: SortInput.DESC,
        field: "createdAt",
      } satisfies SortInputType;
      const chapters = [
        { _id: "chapter-1" },
        { _id: "chapter-2" },
      ] as unknown as Chapter[];
      mockedChapterRepository.findAllChapters.mockResolvedValue(chapters);

      const result = await resolver.findAllChapters(sort, pagination);

      expect(mockedChapterRepository.findAllChapters).toHaveBeenCalledWith(
        sort,
        pagination,
      );
      expect(result).toBe(chapters);
    });

    test("Should allow omitted pagination and sort inputs", async () => {
      mockedChapterRepository.findAllChapters.mockResolvedValue([]);

      const result = await resolver.findAllChapters(undefined!, undefined!);

      expect(mockedChapterRepository.findAllChapters).toHaveBeenCalledWith(
        undefined,
        undefined,
      );
      expect(result).toEqual([]);
    });
  });
});
