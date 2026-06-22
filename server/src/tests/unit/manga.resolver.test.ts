import { MangaResolver } from "@resolvers/manga.resolvers.js";
import {
  MangaFilterFields,
  MangaFilterTypes,
  MangaUploadInput,
  PaginationInput,
  SortInputType,
} from "@resolvers/resolver.utils.js";
import { InputValidationError } from "@errors/Error.js";

jest.mock("@resolvers/manga.resolvers.utils.js", () => ({
  __esModule: true,
  deleteFolderFromS3: jest.fn(),
}));
import * as resolversUtils from "@resolvers/manga.resolvers.utils.js";
const mockedResolverUtils = resolversUtils as jest.Mocked<
  typeof resolversUtils
>;

jest.mock("mongoose", () => {
  const actualMongoose = jest.requireActual("mongoose");
  return {
    __esModule: true,
    ...actualMongoose,
    default: {
      ...actualMongoose,
      startSession: jest.fn(),
      endSession: jest.fn(),
      withTransaction: jest.fn(),
    },
  };
});

import mongoose from "mongoose";

const mockedMongoose = mongoose as jest.Mocked<typeof mongoose>;

jest.mock("@repository/index.js", () => ({
  MangaRepository: {
    countMangas: jest.fn(),
    findMangaByTitle: jest.fn(),
    deleteMangaById: jest.fn(),
    createManga: jest.fn(),
    findMangaById: jest.fn(),
    findAllMangas: jest.fn(),
  },
  ChapterRepository: {
    deleteChaptersByMangaId: jest.fn(),
  },
  PageRepository: {
    deletePagesByChapterIds: jest.fn(),
  },
}));
import {
  ChapterRepository,
  MangaRepository,
  PageRepository,
} from "@repository/index.js";
import { Manga } from "@models/manga.model.js";
import { MangaStatus } from "@validators/manga.validators.js";
import { SortInput } from "@config/constants.js";

const mockedMangaRepository = MangaRepository as jest.Mocked<
  typeof MangaRepository
>;
const mockedPageRepository = PageRepository as jest.Mocked<
  typeof PageRepository
>;
const mockedChapterRepository = ChapterRepository as jest.Mocked<
  typeof ChapterRepository
>;
let resolver: MangaResolver;

beforeEach(() => {
  jest.clearAllMocks();
  resolver = new MangaResolver();
});

describe("Manga resolver", () => {
  describe("previewUrl", () => {
    test("Should return null when the manga has no preview key", () => {
      expect(resolver.previewUrl({} as Manga)).toBeNull();
    });

    test("Should return the public URL for the manga preview", () => {
      const manga = {
        previewKey: "previews/Manga One/cover image.png",
      } as Manga;

      expect(resolver.previewUrl(manga)).toBe(
        "http://localhost:9000/manga-project-bucket/previews/Manga%20One/cover%20image.png",
      );
    });
  });
  describe("countMangas", () => {
    test("Should return counted mangas with filters", async () => {
      const filter = {
        field: MangaFilterFields.GENRES,
        value: ["cool-genre"],
      };
      mockedMangaRepository.countMangas.mockResolvedValue(2);

      const result = await resolver.countMangas([filter]);

      expect(mockedMangaRepository.countMangas).toHaveBeenCalledWith([filter]);
      expect(result).toEqual(2);
    });

    test("Should throw - InputValidationError if filters are invalid", async () => {
      const filter = {
        field: "bababa",
        value: "asdadsa",
      } as unknown as MangaFilterTypes;

      await expect(resolver.countMangas([filter])).rejects.toThrow(
        InputValidationError,
      );

      expect(mockedMangaRepository.countMangas).not.toHaveBeenCalled();
    });
  });
  describe("findMangaByName", () => {
    test("Should throw - InputValidationError", async () => {
      const mangaTitle = "";

      await expect(resolver.findMangaByName(mangaTitle)).rejects.toThrow(
        InputValidationError,
      );

      expect(mockedMangaRepository.findMangaByTitle).not.toHaveBeenCalled();
    });

    test("Should return found manga", async () => {
      const mangaTitle = "insane-title";

      mockedMangaRepository.findMangaByTitle.mockResolvedValue({
        manga: "cool-2",
      } as any);

      const result = await resolver.findMangaByName(mangaTitle);

      expect(mockedMangaRepository.findMangaByTitle).toHaveBeenCalledWith(
        mangaTitle,
      );
      expect(result).toEqual({
        manga: "cool-2",
      });
    });
  });
  describe("deleteManga", () => {
    test("Should throw - InputValidationError if mangaId is missing", async () => {
      await expect(resolver.deleteManga("")).rejects.toThrow(
        InputValidationError,
      );

      expect(mockedMongoose.startSession).not.toHaveBeenCalled();
      expect(mockedMangaRepository.deleteMangaById).not.toHaveBeenCalled();
      expect(
        mockedChapterRepository.deleteChaptersByMangaId,
      ).not.toHaveBeenCalled();
      expect(
        mockedPageRepository.deletePagesByChapterIds,
      ).not.toHaveBeenCalled();
      expect(mockedResolverUtils.deleteFolderFromS3).not.toHaveBeenCalled();
    });

    test("Should rethrow if repository throws", async () => {
      const mangaId = "manga-id";

      const sessionCalls = {
        withTransaction: jest.fn(async (callback) => callback()),
        endSession: jest.fn().mockResolvedValue(undefined),
      };

      mockedMongoose.startSession.mockResolvedValue(sessionCalls as any);

      mockedMangaRepository.deleteMangaById.mockRejectedValue(
        new Error("Rejects"),
      );

      await expect(resolver.deleteManga(mangaId)).rejects.toThrow("Rejects");

      expect(mockedMongoose.startSession).toHaveBeenCalled();

      expect(sessionCalls.withTransaction).toHaveBeenCalledTimes(1);
      expect(sessionCalls.endSession).toHaveBeenCalledTimes(1);

      expect(mockedMangaRepository.deleteMangaById).toHaveBeenCalledWith(
        mangaId,
        sessionCalls,
      );

      expect(
        mockedChapterRepository.deleteChaptersByMangaId,
      ).not.toHaveBeenCalled();

      expect(
        mockedPageRepository.deletePagesByChapterIds,
      ).not.toHaveBeenCalled();

      expect(mockedResolverUtils.deleteFolderFromS3).not.toHaveBeenCalled();
    });

    test("Should delete manga", async () => {
      const mangaId = "manga-id";
      const manga = { _id: mangaId } as unknown as Manga;
      const deletedPages = {
        deletedCount: 3,
        deletedPageIds: ["id-1", "id-2", "id-3"],
      };
      const deletedChapters = {
        deletedCount: 3,
        deletedIds: ["id-1", "id-2", "id-3"],
      };

      const sessionCalls = {
        withTransaction: jest.fn(async (callback) => callback()),
        endSession: jest.fn().mockResolvedValue(undefined),
      };

      mockedMongoose.startSession.mockResolvedValue(sessionCalls as any);

      mockedMangaRepository.deleteMangaById.mockResolvedValue(manga);
      mockedPageRepository.deletePagesByChapterIds.mockResolvedValue(
        deletedPages,
      );
      mockedChapterRepository.deleteChaptersByMangaId.mockResolvedValue(
        deletedChapters,
      );

      const result = await resolver.deleteManga(mangaId);

      expect(mockedMongoose.startSession).toHaveBeenCalled();

      expect(sessionCalls.withTransaction).toHaveBeenCalledTimes(1);
      expect(sessionCalls.endSession).toHaveBeenCalledTimes(1);

      expect(mockedMangaRepository.deleteMangaById).toHaveBeenCalledWith(
        mangaId,
        sessionCalls,
      );
      expect(mockedPageRepository.deletePagesByChapterIds).toHaveBeenCalledWith(
        deletedChapters.deletedIds,
        sessionCalls,
      );
      expect(
        mockedChapterRepository.deleteChaptersByMangaId,
      ).toHaveBeenCalledWith(mangaId, sessionCalls);
      expect(
        mockedChapterRepository.deleteChaptersByMangaId,
      ).toHaveBeenCalled();

      expect(mockedResolverUtils.deleteFolderFromS3).toHaveBeenCalledWith(
        `mangas/${mangaId}/`,
      );
      expect(mockedResolverUtils.deleteFolderFromS3).toHaveBeenCalledTimes(1);
      expect(result).toEqual(manga);
    });

    test("Should delete the manga and preview folders", async () => {
      const mangaId = "manga-id";
      const manga = {
        _id: mangaId,
        previewKey: "previews/manga-id/cover.png",
      } as unknown as Manga;
      const deletedChapters = {
        deletedCount: 1,
        deletedIds: ["chapter-id"],
      };
      const sessionCalls = {
        withTransaction: jest.fn(async (callback) => callback()),
        endSession: jest.fn().mockResolvedValue(undefined),
      };

      mockedMongoose.startSession.mockResolvedValue(sessionCalls as any);
      mockedMangaRepository.deleteMangaById.mockResolvedValue(manga);
      mockedChapterRepository.deleteChaptersByMangaId.mockResolvedValue(
        deletedChapters,
      );
      mockedPageRepository.deletePagesByChapterIds.mockResolvedValue({
        deletedCount: 1,
        deletedPageIds: ["page-id"],
      });

      const result = await resolver.deleteManga(mangaId);

      expect(mockedResolverUtils.deleteFolderFromS3).toHaveBeenNthCalledWith(
        1,
        "mangas/manga-id/",
      );
      expect(mockedResolverUtils.deleteFolderFromS3).toHaveBeenNthCalledWith(
        2,
        "previews/manga-id/",
      );
      expect(sessionCalls.endSession).toHaveBeenCalledTimes(1);
      expect(result).toBe(manga);
    });
  });
  describe("uploadManga", () => {
    test("Should throw - InputValidationError if mangaData is invalid", async () => {
      const mangaUploadInput = { a: "aaaa" } as unknown as MangaUploadInput;

      await expect(resolver.uploadManga(mangaUploadInput)).rejects.toThrow(
        InputValidationError,
      );

      expect(mockedMangaRepository.createManga).not.toHaveBeenCalled();
    });

    test("Should successfully create manga", async () => {
      const mangaUploadInput = {
        title: "some-title",
        author: "Some-author",
        status: MangaStatus.COMPLETED,
      } satisfies MangaUploadInput;

      const createdManga = {
        _id: "some-id",
        ...mangaUploadInput,
      } as unknown as Manga;
      mockedMangaRepository.createManga.mockResolvedValue(createdManga);

      const result = await resolver.uploadManga(mangaUploadInput);

      expect(mockedMangaRepository.createManga).toHaveBeenCalledWith({
        ...mangaUploadInput,
        description: "No description provided as of yet.",
      });
      expect(result).toEqual(createdManga);
    });
  });
  describe("findMangaById", () => {
    test("Should throw - InputValidationError if mangaId is invalid", async () => {
      const mangaId = "";

      await expect(resolver.findMangaById(mangaId)).rejects.toThrow(
        InputValidationError,
      );

      expect(mockedMangaRepository.findMangaById).not.toHaveBeenCalled();
    });

    test("Should return found manga", async () => {
      const mangaId = "some-id";
      const manga = { _id: mangaId } as unknown as Manga;

      mockedMangaRepository.findMangaById.mockResolvedValue(manga);
      const result = await resolver.findMangaById(mangaId);

      expect(mockedMangaRepository.findMangaById).toHaveBeenCalledWith(mangaId);
      expect(result).toEqual(manga);
    });
  });
  describe("findAllMangas", () => {
    test("Should throw - InputValidation error if paginationInput is invalid", async () => {
      const paginationInput = { page: -1, limit: 10 } as PaginationInput;
      const sort = {
        sortBy: SortInput.ASC,
        field: "createdAt",
      };
      const filters = [
        { field: MangaFilterFields.AUTHOR, value: ["Some-author"] },
      ];

      await expect(
        resolver.findAllMangas(paginationInput, sort as any, filters),
      ).rejects.toThrow(InputValidationError);

      expect(mockedMangaRepository.findAllMangas).not.toHaveBeenCalled();
    });

    test("Should throw - InputValidation error if sort input is invalid", async () => {
      const paginationInput = { page: 3, limit: 10 };
      const sort = { a: "aa" } as unknown as SortInput;
      const filters = [
        { field: MangaFilterFields.AUTHOR, value: ["Some-author"] },
      ];

      await expect(
        resolver.findAllMangas(paginationInput, sort as any, filters),
      ).rejects.toThrow(InputValidationError);

      expect(mockedMangaRepository.findAllMangas).not.toHaveBeenCalled();
    });

    test("Should throw - InputValidation error if filter input is invalid", async () => {
      const paginationInput = { page: 3, limit: 10 };
      const sort = { sortBy: SortInput.ASC, field: "createdAt" };
      const filters = [{ a: "aaa" }] as unknown as MangaFilterTypes[];

      await expect(
        resolver.findAllMangas(paginationInput, sort as any, filters),
      ).rejects.toThrow(InputValidationError);

      expect(mockedMangaRepository.findAllMangas).not.toHaveBeenCalled();
    });

    test("Should return all found mangas according to filters", async () => {
      const paginationInput = { page: 3, limit: 10 };
      const sort = { sortBy: SortInput.ASC, field: "createdAt" };
      const filters = [
        { field: MangaFilterFields.AUTHOR, value: ["Some-author"] },
      ];
      const mangas = [
        { _id: "id-1" },
        { _id: "id-2" },
        { _id: "id-3" },
      ] as unknown as Manga[];
      mockedMangaRepository.findAllMangas.mockResolvedValue(mangas);

      const result = await resolver.findAllMangas(
        paginationInput,
        sort as any,
        filters,
      );

      expect(mockedMangaRepository.findAllMangas).toHaveBeenCalledWith(
        paginationInput,
        sort as any,
        filters,
      );

      expect(result).toEqual(mangas);
    });
  });
});
