import { BadRequestError, NotFoundError } from "@errors/Error.js";
import MangaModel, { Manga } from "@models/manga.model.js";
import { IMangaRepository } from "@repository/manga.repository.js";
import { MangaUploadInput } from "@resolvers/resolver.utils.js";
import { ClientSession } from "mongoose";

jest.mock("@models/manga.model.js", () => ({
  __esModule: true,
  default: {
    findByIdAndUpdate: jest.fn(),
    create: jest.fn(),
    aggregate: jest.fn(),
    findById: jest.fn(),
    findByIdAndDelete: jest.fn(),
    countDocuments: jest.fn(),
  },
  Manga: jest.fn(),
}));
const mockedMangaModel = MangaModel as jest.Mocked<typeof MangaModel>;
let repository: IMangaRepository;

beforeEach(() => {
  jest.clearAllMocks();
  repository = new IMangaRepository();
});

describe("Manga repository", () => {
  describe("updateManga", () => {
    test("should throw - BadRequestError if mangaId is missing", async () => {
      const mangaId = "";
      const updateData = {
        title: "sumthing",
        status: "ongoing",
      } as unknown as Partial<Manga>;
      const session = {} as ClientSession;

      await expect(
        repository.updateManga(mangaId, updateData, session),
      ).rejects.toThrow(BadRequestError);

      expect(mockedMangaModel.findByIdAndUpdate).not.toHaveBeenCalled();
    });

    test("should throw - BadRequestError if updateData is missing", async () => {
      const mangaId = "8FF8D9DB7C181EC27B3B9A08";
      const updateData = {};
      const session = {} as ClientSession;

      await expect(
        repository.updateManga(mangaId, updateData, session),
      ).rejects.toThrow(BadRequestError);

      expect(mockedMangaModel.findByIdAndUpdate).not.toHaveBeenCalled();
    });

    test("should successfully update manga", async () => {
      const mangaId = "8FF8D9DB7C181EC27B3B9A08";
      const updateData = {
        title: "sumthing",
        status: "ongoing",
      } as unknown as Partial<Manga>;
      const session = {} as ClientSession;
      const findByIdAndUpdateQuery = {
        session: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(updateData),
      };
      mockedMangaModel.findByIdAndUpdate.mockReturnValue(
        findByIdAndUpdateQuery as any,
      );

      const result = await repository.updateManga(mangaId, updateData, session);

      expect(mockedMangaModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mangaId,
        updateData,
        { returnDocument: "after" },
      );
      expect(result).toBe(updateData);
    });

    test("should throw - NotFoundError if MangaModel.findByIdAndUpdate doesn't return doc", async () => {
      const mangaId = "8FF8D9DB7C181EC27B3B9A08";
      const updateData = {
        title: "sumthing",
        status: "ongoing",
      } as unknown as Partial<Manga>;
      const session = {} as ClientSession;
      const findByIdAndUpdateQuery = {
        session: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      };
      mockedMangaModel.findByIdAndUpdate.mockReturnValue(
        findByIdAndUpdateQuery as any,
      );

      await expect(
        repository.updateManga(mangaId, updateData, session),
      ).rejects.toThrow(NotFoundError);

      expect(mockedMangaModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mangaId,
        updateData,
        { returnDocument: "after" },
      );
    });
  });
  describe("createManga", () => {
    test("Should throw - BadRequestError if mangaData is missing", async () => {
      const mangaData = {} as unknown as MangaUploadInput;

      await expect(repository.createManga(mangaData)).rejects.toThrow(
        BadRequestError,
      );

      expect(mockedMangaModel.create).not.toHaveBeenCalled();
    });

    test("Should successfully create manga", async () => {
      const mangaData = { title: "title", author: "bob", status: "completed" };
      mockedMangaModel.create.mockResolvedValue(mangaData as any);

      const result = await repository.createManga(mangaData);

      expect(mockedMangaModel.create).toHaveBeenCalledWith(mangaData);
      expect(result).toBe(mangaData);
    });

    test("Should throw - NotFoundError if MangaModel.create doesn't return doc", async () => {
      const mangaData = { title: "title", author: "bob", status: "completed" };
      mockedMangaModel.create.mockResolvedValue(null as any);

      await expect(repository.createManga(mangaData)).rejects.toThrow(
        NotFoundError,
      );

      expect(mockedMangaModel.create).toHaveBeenCalledWith(mangaData);
    });
  });
  describe("findAllMangas", () => {
    test("Should successfully return all mangas", async () => {
      const mangas = [{ _id: 22 }, { _id: 23232 }];
      mockedMangaModel.aggregate.mockResolvedValue(mangas);

      const result = await repository.findAllMangas();

      expect(mockedMangaModel.aggregate).toHaveBeenCalledTimes(1);
      expect(result).toBe(mangas);
    });

    test("Should throw - NotFoundError if MangaModel.aggregate doesn't return doc", async () => {
      mockedMangaModel.aggregate.mockResolvedValue(null as any);

      await expect(repository.findAllMangas()).rejects.toThrow(NotFoundError);

      expect(mockedMangaModel.aggregate).toHaveBeenCalledTimes(1);
    });
  });
  describe("findMangaById", () => {
    test("Should throw - BadRequestError if mangaId is missing", async () => {
      const mangaId = "";

      await expect(repository.findMangaById(mangaId)).rejects.toThrow(
        BadRequestError,
      );

      expect(mockedMangaModel.findById).not.toHaveBeenCalled();
    });

    test("Should successfully return found manga", async () => {
      const mangaId = "manga-id";
      const findByIdQuery = {
        populate: jest.fn().mockResolvedValue({ mangaId: 22 } as any),
      };
      mockedMangaModel.findById.mockReturnValue(findByIdQuery as any);

      const result = await repository.findMangaById(mangaId);

      expect(mockedMangaModel.findById).toHaveBeenCalledWith(mangaId);
      expect(result).toEqual({ mangaId: 22 });
    });

    test("Should throw - NotFoundError if MangaModel.findById doesn't return doc", async () => {
      const mangaId = "manga-id";
      const findByIdQuery = {
        populate: jest.fn().mockResolvedValue(null as any),
      };
      mockedMangaModel.findById.mockReturnValue(findByIdQuery as any);

      await expect(repository.findMangaById(mangaId)).rejects.toThrow(
        NotFoundError,
      );

      expect(mockedMangaModel.findById).toHaveBeenCalledWith(mangaId);
    });
  });
  describe("deleteMangaById", () => {
    test("Should throw - BadRequestError if mangaId is missing", async () => {
      const mangaId = "";
      const session = {} as ClientSession;

      await expect(
        repository.deleteMangaById(mangaId, session),
      ).rejects.toThrow(BadRequestError);

      expect(mockedMangaModel.findByIdAndDelete).not.toHaveBeenCalled();
    });

    test("Should return delete information", async () => {
      const mangaId = "xxxx";
      const manga = { mangaId: "asda" } as unknown as Manga;
      mockedMangaModel.findByIdAndDelete.mockResolvedValue(manga);

      const result = await repository.deleteMangaById(mangaId);

      expect(mockedMangaModel.findByIdAndDelete).toHaveBeenCalledWith(mangaId);
      expect(result).toEqual(manga);
    });

    test("Should throw - NotFoundError if MangaModel.findByIdAndDelete doesn't return doc", async () => {
      const mangaId = "xxxx";
      mockedMangaModel.findByIdAndDelete.mockReturnValue(null as any);

      await expect(repository.deleteMangaById(mangaId)).rejects.toThrow(
        NotFoundError,
      );

      expect(mockedMangaModel.findByIdAndDelete).toHaveBeenCalledWith(mangaId);
    });
  });
  describe("findMangaByTitle", () => {
    test("Should throw - BadRequestError if mangaTitle is missing", async () => {
      const mangaTitle = "";

      await expect(repository.findMangaByTitle(mangaTitle)).rejects.toThrow(
        BadRequestError,
      );

      expect(mockedMangaModel.aggregate).not.toHaveBeenCalled();
    });

    test("Should successfully return found mangas", async () => {
      const mangaTitle = "some-title";
      mockedMangaModel.aggregate.mockResolvedValue([{ mangaId: 2131 }] as any);

      const result = await repository.findMangaByTitle(mangaTitle);

      expect(mockedMangaModel.aggregate).toHaveBeenCalledTimes(1);
      expect(result).toEqual([{ mangaId: 2131 }]);
    });

    test("Should throw - NotFoundError if MangaModel.aggregate doesn't return doc", async () => {
      const mangaTitle = "some-title";
      mockedMangaModel.aggregate.mockResolvedValue(null as any);

      await expect(repository.findMangaByTitle(mangaTitle)).rejects.toThrow(
        NotFoundError,
      );

      expect(mockedMangaModel.aggregate).toHaveBeenCalledTimes(1);
    });
  });
  describe("countMangas", () => {
    test("Should return manga count", async () => {
      mockedMangaModel.countDocuments.mockResolvedValue(10);
      const result = await repository.countMangas();

      expect(mockedMangaModel.countDocuments).toHaveBeenCalledTimes(1);
      expect(result).toEqual(10);
    });
  });
});
