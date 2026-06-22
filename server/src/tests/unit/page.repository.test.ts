import { BadRequestError } from "@errors/Error.js";
import PageModel from "@models/page.model.js";
import {
  CreatePagesPayload,
  IPageRepository,
} from "@repository/page.repository.js";
import mongoose, { ClientSession } from "mongoose";

jest.mock("@models/page.model.js", () => ({
  __esModule: true,
  default: {
    insertMany: jest.fn(),
    aggregate: jest.fn(),
    find: jest.fn(),
    deleteMany: jest.fn(),
  },
  Page: jest.fn(),
}));
const mockedPageModel = PageModel as jest.Mocked<typeof PageModel>;

let repository: IPageRepository;

beforeEach(() => {
  jest.clearAllMocks();
  repository = new IPageRepository();
});

function generateMongoObjectId(): mongoose.Types.ObjectId {
  return new mongoose.Types.ObjectId();
}

describe("Page repository", () => {
  describe("createPages", () => {
    test("Should throw - BadRequestError if chapterId is missing", async () => {
      const payload = {} as unknown as CreatePagesPayload;
      const session = {} as unknown as ClientSession;

      await expect(repository.createPages(payload, session)).rejects.toThrow(
        BadRequestError,
      );

      expect(mockedPageModel.insertMany).not.toHaveBeenCalled();
    });

    test("Should throw - BadRequestError if pages payload is invalid", async () => {
      const payload = {
        chapterId: "some-id",
        pages: [],
      } as unknown as CreatePagesPayload;
      const session = {} as unknown as ClientSession;

      await expect(repository.createPages(payload, session)).rejects.toThrow(
        BadRequestError,
      );

      expect(mockedPageModel.insertMany).not.toHaveBeenCalled();
    });

    test("Should create chapters", async () => {
      const payload = {
        chapterId: "8FF8D9DB7C181EC27B3B9A08",
        pages: [{ imageKey: "key-1", fileSize: 2 }],
      } as unknown as CreatePagesPayload;
      const session = {} as unknown as ClientSession;

      const pagesToUpload = payload.pages.map((page, index) => ({
        chapter: new mongoose.Types.ObjectId(payload.chapterId),
        imageKey: page.imageKey,
        fileSize: page.fileSize,
        pageNumber: index + 1,
      }));

      mockedPageModel.insertMany.mockResolvedValue(pagesToUpload as any);
      const result = await repository.createPages(payload, session);

      expect(mockedPageModel.insertMany).toHaveBeenCalledWith(pagesToUpload, {
        session,
      });
      expect(result).toBe(pagesToUpload);
    });
  });
  describe("getPagesByChapterId", () => {
    test("Should throw - BadRequestError if chapterId is missing", async () => {
      const chapterId = "";

      await expect(repository.getPagesByChapterId(chapterId)).rejects.toThrow(
        BadRequestError,
      );

      expect(mockedPageModel.aggregate).not.toHaveBeenCalled();
    });

    test("Should return found pages", async () => {
      const chapterId = "8FF8D9DB7C181EC27B3B9A08";

      const res = [{ page: 1 }, { page: 2 }];
      mockedPageModel.aggregate.mockResolvedValue(res);
      const result = await repository.getPagesByChapterId(chapterId);

      expect(mockedPageModel.aggregate).toHaveBeenCalledTimes(1);
      expect(result).toBe(res);
    });
  });
  describe("deletePagesByChaptersIds", () => {
    test("Should throw - BadRequestError if chapterIds are invalid", async () => {
      const chapterIds = [] as string[];
      const session = {} as unknown as ClientSession;

      await expect(
        repository.deletePagesByChapterIds(chapterIds, session),
      ).rejects.toThrow(BadRequestError);

      expect(mockedPageModel.find).not.toHaveBeenCalled();
      expect(mockedPageModel.deleteMany).not.toHaveBeenCalled();
    });

    test("Should return delete payload", async () => {
      const chapterIds = ["a", "2", "b"] as string[];
      const pages = [
        { _id: generateMongoObjectId },
        { _id: generateMongoObjectId },
        { _id: generateMongoObjectId },
      ];
      const session = {} as unknown as ClientSession;
      const findQuery = {
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        session: jest.fn().mockResolvedValue(pages),
      };
      const deleteManyQuery = {
        session: jest.fn().mockResolvedValue({ deletedCount: 3 }),
      };
      mockedPageModel.find.mockReturnValue(findQuery as any);
      mockedPageModel.deleteMany.mockReturnValue(deleteManyQuery as any);

      const result = await repository.deletePagesByChapterIds(
        chapterIds,
        session,
      );

      expect(mockedPageModel.find).toHaveBeenCalledTimes(1);
      expect(mockedPageModel.deleteMany).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        deletedCount: 3,
        deletedPageIds: pages.map((page) => String(page._id)),
      });
    });
  });
});
