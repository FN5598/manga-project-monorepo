import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "@errors/Error.js";
import {
  createChapterPayload,
  IChapterRepository,
  UploadStatus,
} from "@repository/chapter.repository.js";
import mongoose, { ClientSession } from "mongoose";
import ChapterModel, { Chapter } from "@models/chapter.model.js";

jest.mock("@models/chapter.model.js", () => ({
  __esModule: true,
  default: {
    find: jest.fn(),
    create: jest.fn(),
    aggregate: jest.fn(),
    findById: jest.fn(),
    deleteMany: jest.fn(),
  },
  Chapter: jest.fn(),
}));
const mockedChapterModel = ChapterModel as jest.Mocked<typeof ChapterModel>;

let repository: IChapterRepository;

beforeEach(() => {
  jest.clearAllMocks();
  repository = new IChapterRepository();
});

function generateMongoObjectId(): mongoose.Types.ObjectId {
  return new mongoose.Types.ObjectId();
}

describe("Chapter repository", () => {
  describe("createChapter", () => {
    test("Should throw - BadRequestError if chapterNumber is invalid", async () => {
      const payload = { chapterNumber: -2 } as unknown as createChapterPayload;
      const sessionMock = {} as ClientSession;
      await expect(
        repository.createChapter(payload, sessionMock),
      ).rejects.toThrow(BadRequestError);

      expect(mockedChapterModel.find).not.toHaveBeenCalled();
    });

    test("Should throw - BadRequestError if mangaId is missing", async () => {
      const payload = {
        chapterNumber: 2,
        mangaId: undefined,
      } as unknown as createChapterPayload;
      const sessionMock = {} as ClientSession;

      await expect(
        repository.createChapter(payload, sessionMock),
      ).rejects.toThrow(BadRequestError);

      expect(mockedChapterModel.find).not.toHaveBeenCalled();
    });

    test("Should throw - BadRequestError if title is missing", async () => {
      const payload = {
        chapterNumber: 2,
        mangaId: "manga-id",
        title: "",
      } as unknown as createChapterPayload;
      const sessionMock = {} as ClientSession;

      await expect(
        repository.createChapter(payload, sessionMock),
      ).rejects.toThrow(BadRequestError);

      expect(mockedChapterModel.find).not.toHaveBeenCalled();
    });

    test("Should throw - BadRequestError if chapterPrefix is missing", async () => {
      const payload = {
        chapterNumber: 2,
        mangaId: "manga-id",
        title: "some title",
        chapterPrefix: undefined,
      } as unknown as createChapterPayload;
      const sessionMock = {} as ClientSession;

      await expect(
        repository.createChapter(payload, sessionMock),
      ).rejects.toThrow(BadRequestError);

      expect(mockedChapterModel.find).not.toHaveBeenCalled();
    });

    test("Should throw - BadRequestError if pageCount is invalid", async () => {
      const payload = {
        chapterNumber: 2,
        mangaId: "manga-id",
        title: "some title",
        chapterPrefix: "chapter-prefix",
        pageCount: null,
      } as unknown as createChapterPayload;
      const sessionMock = {} as ClientSession;

      await expect(
        repository.createChapter(payload, sessionMock),
      ).rejects.toThrow(BadRequestError);

      expect(mockedChapterModel.find).not.toHaveBeenCalled();
    });

    test("Should throw - ConflictError if chapterNumber already exists", async () => {
      const payload = {
        chapterNumber: 2,
        mangaId: "manga-id",
        title: "some title",
        chapterPrefix: "chapter-prefix",
        pageCount: 1,
      } as unknown as createChapterPayload;
      const sessionMock = {} as ClientSession;

      const queryMock = {
        session: jest.fn().mockResolvedValue([payload]),
      };
      mockedChapterModel.find.mockReturnValue(queryMock as any);

      await expect(
        repository.createChapter(payload, sessionMock),
      ).rejects.toThrow(ConflictError);

      expect(mockedChapterModel.find).toHaveBeenCalledTimes(1);
    });

    test("Should successfully create chapter", async () => {
      const payload = {
        chapterNumber: 2,
        mangaId: "manga-id",
        title: "some title",
        chapterPrefix: "chapter-prefix",
        pageCount: 1,
      } as unknown as createChapterPayload;
      const sessionMock = {} as ClientSession;
      const resultPayload = {
        chapterNumber: 2,
        mangaId: "manga-id",
        title: "some title",
        pageCount: 1,
        storagePrefix: "chapter-prefix",
        uploadStatus: UploadStatus.READY,
      };

      const queryMock = {
        session: jest.fn().mockResolvedValue([]),
      };
      mockedChapterModel.find.mockReturnValue(queryMock as any);
      mockedChapterModel.create.mockResolvedValue([resultPayload] as any);

      const result = await repository.createChapter(payload, sessionMock);

      expect(mockedChapterModel.find).toHaveBeenCalledTimes(1);
      expect(mockedChapterModel.create).toHaveBeenCalledWith([resultPayload], {
        session: sessionMock,
      });
      expect(result).toEqual(resultPayload);
    });

    test("Should throw - NotFoundError if ChapterModel.create didn't return doc", async () => {
      const payload = {
        chapterNumber: 2,
        mangaId: "manga-id",
        title: "some title",
        chapterPrefix: "chapter-prefix",
        pageCount: 1,
      } as unknown as createChapterPayload;
      const sessionMock = {} as ClientSession;
      const resultPayload = {
        chapterNumber: 2,
        mangaId: "manga-id",
        title: "some title",
        pageCount: 1,
        storagePrefix: "chapter-prefix",
        uploadStatus: UploadStatus.READY,
      };

      const queryMock = {
        session: jest.fn().mockResolvedValue([]),
      };
      mockedChapterModel.find.mockReturnValue(queryMock as any);
      mockedChapterModel.create.mockResolvedValue([] as any);

      await expect(
        repository.createChapter(payload, sessionMock),
      ).rejects.toThrow(NotFoundError);

      expect(mockedChapterModel.find).toHaveBeenCalledTimes(1);
      expect(mockedChapterModel.create).toHaveBeenCalledWith([resultPayload], {
        session: sessionMock,
      });
    });
  });
  describe("findChaptersByMangaId", () => {
    test("Should throw - BadRequestError if mangaId is missing", async () => {
      const payload = "";

      await expect(repository.findChaptersByMangaId(payload)).rejects.toThrow(
        BadRequestError,
      );
      expect(mockedChapterModel.aggregate).not.toHaveBeenCalled();
    });

    test("Should successfully find chapters", async () => {
      const payload = "04B534C573BAFCDA79129E55";
      const chapters = [{ mangaId: "some-id" }, { mangaId: "some-id-2" }];
      mockedChapterModel.aggregate.mockResolvedValue(chapters);

      const result = await repository.findChaptersByMangaId(payload);
      expect(mockedChapterModel.aggregate).toHaveBeenCalledTimes(1);
      expect(result).toBe(chapters);
    });

    test("Should throw - NotFoundError if ChapterModel.aggregate doesnt return doc", async () => {
      const payload = "04B534C573BAFCDA79129E55";
      mockedChapterModel.aggregate.mockResolvedValue([]);

      await expect(repository.findChaptersByMangaId(payload)).rejects.toThrow(
        NotFoundError,
      );
      expect(mockedChapterModel.aggregate).toHaveBeenCalledTimes(1);
    });
  });
  describe("findAllChapters", () => {
    test("Should return found chapters", async () => {
      const mockedChapters = [
        { chapterId: "1" },
        { chapterId: "2" },
      ] as unknown as Chapter[];
      const query = {
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockResolvedValue(mockedChapters),
      };
      mockedChapterModel.find.mockReturnValue(query as any);

      const result = await repository.findAllChapters();

      expect(mockedChapterModel.find).toHaveBeenCalledTimes(1);
      expect(result).toBe(mockedChapters);
    });

    test("Should throw - NotFoundError if ChapterModel.find doesn't return doc", async () => {
      const query = {
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockResolvedValue([]),
      };
      mockedChapterModel.find.mockReturnValue(query as any);

      await expect(repository.findAllChapters()).rejects.toThrow(NotFoundError);

      expect(mockedChapterModel.find).toHaveBeenCalledTimes(1);
    });
  });
  describe("findChapterById", () => {
    test("Should return found chapter", async () => {
      const chapterId = "2";
      const chapter = { _id: chapterId } as unknown as Chapter;
      mockedChapterModel.findById.mockResolvedValue(chapter);

      const result = await repository.findChapterById(chapterId);

      expect(mockedChapterModel.findById).toHaveBeenCalledWith(chapterId);
      expect(result).toBe(chapter);
      expect(result._id).toBe("2");
    });

    test("Should throw - NotFoundError if ChapterModel.findById doesn't return doc", async () => {
      const chapterId = "2";
      mockedChapterModel.findById.mockResolvedValue(null);

      await expect(repository.findChapterById(chapterId)).rejects.toThrow(
        NotFoundError,
      );

      expect(mockedChapterModel.findById).toHaveBeenCalledWith(chapterId);
    });
  });
  describe("deleteChaptersByMangaId", () => {
    test("Should throw - BadRequestError if mangaId is missing", async () => {
      const mangaId = "";
      const session = {} as unknown as ClientSession;

      await expect(
        repository.deleteChaptersByMangaId(mangaId, session),
      ).rejects.toThrow(BadRequestError);

      expect(mockedChapterModel.deleteMany).not.toHaveBeenCalled();
      expect(mockedChapterModel.find).not.toHaveBeenCalled();
    });

    test("Should return deleted information", async () => {
      const mangaId = "some-manga-id";
      const session = {} as unknown as ClientSession;
      const deletedChapters = [
        { _id: generateMongoObjectId() },
        { _id: generateMongoObjectId() },
        { _id: generateMongoObjectId() },
      ];
      const query = {
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        session: jest.fn().mockResolvedValue(deletedChapters),
      };
      const deleteManyQuery = {
        session: jest.fn().mockResolvedValue({ deletedCount: 3 }),
      };

      mockedChapterModel.find.mockReturnValue(query as any);
      mockedChapterModel.deleteMany.mockReturnValue(deleteManyQuery as any);

      const result = await repository.deleteChaptersByMangaId(mangaId, session);

      expect(mockedChapterModel.deleteMany).toHaveBeenCalledWith({ mangaId });
      expect(mockedChapterModel.find).toHaveBeenCalledWith({ mangaId });
      expect(result).toEqual({
        deletedCount: 3,
        deletedIds: deletedChapters.map((chapter) => chapter._id.toString()),
      });
    });
  });
});
