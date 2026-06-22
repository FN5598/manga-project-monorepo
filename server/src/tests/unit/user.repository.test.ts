import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  InternalError,
} from "@errors/Error.js";
import UserModel from "@models/user.model.js";
import { IUserRepository } from "@repository/user.repository.js";

jest.mock("@models/user.model.js", () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    findByIdAndDelete: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
  User: jest.fn(),
}));
const mockedUserModel = UserModel as jest.Mocked<typeof UserModel>;

let repository: IUserRepository;

beforeEach(() => {
  jest.clearAllMocks();
  repository = new IUserRepository();
});

describe("User repository", () => {
  describe("findUserByEmail", () => {
    test("Should throw - BadRequestError if email is missing", async () => {
      const email = "";
      await expect(repository.findUserByEmail(email, true)).rejects.toThrow(
        BadRequestError,
      );

      expect(mockedUserModel.findOne).not.toHaveBeenCalled();
    });

    test("Should successfully return user - returns password", async () => {
      const email = "some@email.com";
      const user = {
        hashedPassword: "afafa",
        email,
      };
      const query = {
        select: jest.fn().mockResolvedValue(user),
      };
      mockedUserModel.findOne.mockReturnValue(query as any);

      const result = await repository.findUserByEmail(email, true);

      expect(mockedUserModel.findOne).toHaveBeenCalledWith({ email });
      expect(result).toEqual(user);
      expect(result.hashedPassword).toEqual("afafa");
    });

    test("Should successfully return user - doesn't returns password", async () => {
      const email = "some@email.com";
      const user = {
        email,
      };
      mockedUserModel.findOne.mockReturnValue(user as any);

      const result = await repository.findUserByEmail(email, false);

      expect(mockedUserModel.findOne).toHaveBeenCalledWith({ email });
      expect(result).toEqual(user);
      expect(result.hashedPassword).toBeUndefined();
    });

    test("Should throw - NotFoundError if UserModel.findOne doesn't return doc", async () => {
      const email = "some@email.com";
      const user = {
        email,
      };
      mockedUserModel.findOne.mockReturnValue(null as any);

      await expect(repository.findUserByEmail(email, false)).rejects.toThrow(
        NotFoundError,
      );

      expect(mockedUserModel.findOne).toHaveBeenCalledWith({ email });
    });
  });
  describe("createUser", () => {
    test("Should throw - BadRequestError if email is missing", async () => {
      const userData = { username: "asdasda", hashedPassword: "sajdaj" };

      await expect(repository.createUser(userData as any)).rejects.toThrow(
        BadRequestError,
      );

      expect(mockedUserModel.findOne).not.toHaveBeenCalled();
      expect(mockedUserModel.create).not.toHaveBeenCalled();
    });

    test("Should throw - BadRequestError if password is missing", async () => {
      const userData = { username: "asdasda", email: "asdas" };

      await expect(repository.createUser(userData as any)).rejects.toThrow(
        BadRequestError,
      );

      expect(mockedUserModel.findOne).not.toHaveBeenCalled();
      expect(mockedUserModel.create).not.toHaveBeenCalled();
    });

    test("Should throw - ConflictError if user with email already exists", async () => {
      const userData = {
        username: "asdasda",
        email: "asdas",
        hashedPassword: "asdasda",
      };

      mockedUserModel.findOne.mockResolvedValue(userData as any);

      await expect(repository.createUser(userData as any)).rejects.toThrow(
        ConflictError,
      );

      expect(mockedUserModel.findOne).toHaveBeenCalledWith({
        email: userData.email,
      });
      expect(mockedUserModel.create).not.toHaveBeenCalled();
    });

    test("Should successfully create user", async () => {
      const userData = {
        username: "asdasda",
        email: "asdas",
        hashedPassword: "asdasda",
      };

      mockedUserModel.findOne.mockResolvedValue(null as any);
      mockedUserModel.create.mockResolvedValue([userData] as any);

      const result = await repository.createUser(userData as any);

      expect(mockedUserModel.findOne).toHaveBeenCalledWith({
        email: userData.email,
      });
      expect(mockedUserModel.create).toHaveBeenCalledWith([userData], {});
      expect(result).toBe(userData);
    });

    test("Should throw - NotFoundError if MangaModel.create doesn't return doc", async () => {
      const userData = {
        username: "asdasda",
        email: "asdas",
        hashedPassword: "asdasda",
      };

      mockedUserModel.findOne.mockResolvedValue(null as any);
      mockedUserModel.create.mockResolvedValue([] as any);

      await expect(repository.createUser(userData as any)).rejects.toThrow(
        NotFoundError,
      );

      expect(mockedUserModel.findOne).toHaveBeenCalledWith({
        email: userData.email,
      });
      expect(mockedUserModel.create).toHaveBeenCalledWith([userData], {});
    });
  });
  describe("findUserById", () => {
    test("Should throw - BadRequestError if userId is missing", async () => {
      const userId = "";

      await expect(repository.findUserById(userId)).rejects.toThrow(
        BadRequestError,
      );

      expect(mockedUserModel.findById).not.toHaveBeenCalled();
    });

    test("Should throw - NotFoundError if UserModel.findById doesn't return doc", async () => {
      const userId = "some-id";

      mockedUserModel.findById.mockResolvedValue(null as any);

      await expect(repository.findUserById(userId)).rejects.toThrow(
        NotFoundError,
      );

      expect(mockedUserModel.findById).toHaveBeenCalledWith(userId);
    });

    test("Should successfully return found user", async () => {
      const userId = "some-id";

      mockedUserModel.findById.mockResolvedValue({ email: "asdas" } as any);

      const result = await repository.findUserById(userId);

      expect(mockedUserModel.findById).toHaveBeenCalledWith(userId);
      expect(result).toEqual({ email: "asdas" });
    });
  });
  describe("deleteUserById", () => {
    test("Should throw - BadRequestError if userId is missing", async () => {
      const userId = "";

      await expect(repository.deleteUserById(userId)).rejects.toThrow(
        BadRequestError,
      );

      expect(mockedUserModel.findByIdAndDelete).not.toHaveBeenCalled();
    });

    test("Should throw - NotFoundError if UserModel.findById doesn't return doc", async () => {
      const userId = "some-id";

      mockedUserModel.findByIdAndDelete.mockResolvedValue(null as any);

      await expect(repository.deleteUserById(userId)).rejects.toThrow(
        NotFoundError,
      );

      expect(mockedUserModel.findByIdAndDelete).toHaveBeenCalledWith(userId);
    });

    test("Should successfully delete user", async () => {
      const userId = "some-id";

      mockedUserModel.findByIdAndDelete.mockResolvedValue({
        email: "asdas",
      } as any);

      const result = await repository.deleteUserById(userId);

      expect(mockedUserModel.findByIdAndDelete).toHaveBeenCalledWith(userId);
      expect(result).toEqual({ email: "asdas" });
    });
  });
  describe("updateRefreshToken", () => {
    test("Should throw - NotFoundError if user does not exist", async () => {
      const refreshToken = undefined;
      const userId = "asdsa";

      mockedUserModel.findById.mockResolvedValue({ email: "asdasd" });

      await expect(
        repository.updateRefreshToken(refreshToken, userId),
      ).rejects.toThrow(NotFoundError);

      expect(mockedUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
        { _id: userId },
        { refreshToken },
      );
    });

    test("Should throw - BadRequestError if userId is missing", async () => {
      const refreshToken = undefined;
      const userId = "";

      await expect(
        repository.updateRefreshToken(refreshToken, userId),
      ).rejects.toThrow(BadRequestError);

      expect(mockedUserModel.findByIdAndUpdate).not.toHaveBeenCalled();
    });

    test("Should update user's refresh token", async () => {
      const refreshToken = undefined;
      const userId = "11111";
      const user = {
        refreshToken: "SuperHugeTokenString",
        email: "email.@coms",
      };
      mockedUserModel.findByIdAndUpdate.mockResolvedValue({
        ...user,
        refreshToken,
      } as any);

      const result = await repository.updateRefreshToken(refreshToken, userId);

      expect(mockedUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
        { _id: userId },
        { refreshToken },
      );
      expect(result).toBe(true);
    });
  });

  describe("updateUserPassword", () => {
    test("Should throw - BadRequestError if userId is missing", async () => {
      const userId = "";
      const newPassword = "new-pass";

      await expect(
        repository.updateUserPassword(userId, newPassword),
      ).rejects.toThrow(BadRequestError);

      expect(mockedUserModel.findById).not.toHaveBeenCalled();
    });

    test("Should throw - BadRequestError if newPassword is missing", async () => {
      const userId = "id-123";
      const newPassword = "";

      await expect(
        repository.updateUserPassword(userId, newPassword),
      ).rejects.toThrow(BadRequestError);

      expect(mockedUserModel.findById).not.toHaveBeenCalled();
    });

    test("Should throw - NotFoundError if user not found", async () => {
      const userId = "some-id";

      mockedUserModel.findById.mockResolvedValue(null as any);

      await expect(
        repository.updateUserPassword(userId, "new-pass"),
      ).rejects.toThrow(NotFoundError);

      expect(mockedUserModel.findById).toHaveBeenCalledWith(userId);
    });

    test("Should successfully update user's password", async () => {
      const userId = "some-id";
      const newPassword = "brand-new-pass";

      const user: any = {
        hashedPassword: "old-pass",
        save: jest.fn().mockResolvedValue(true),
      };

      mockedUserModel.findById.mockResolvedValue(user as any);

      const result = await repository.updateUserPassword(userId, newPassword);

      expect(mockedUserModel.findById).toHaveBeenCalledWith(userId);
      expect(user.save).toHaveBeenCalled();
      expect(user.hashedPassword).toBe(newPassword);
      expect(result).toBe(true);
    });
  });

  describe("updateUserEmail", () => {
    test("Should throw - BadRequestError if userId is missing", async () => {
      const userId = "";
      const newEmail = "new@email.com";

      await expect(
        repository.updateUserEmail(userId, newEmail),
      ).rejects.toThrow(BadRequestError);

      expect(mockedUserModel.findById).not.toHaveBeenCalled();
    });

    test("Should throw - BadRequestError if newEmail is missing", async () => {
      const userId = "id-321";
      const newEmail = "";

      await expect(
        repository.updateUserEmail(userId, newEmail),
      ).rejects.toThrow(BadRequestError);

      expect(mockedUserModel.findById).not.toHaveBeenCalled();
    });

    test("Should throw - NotFoundError if user not found", async () => {
      const userId = "some-id";

      mockedUserModel.findById.mockResolvedValue(null as any);

      await expect(
        repository.updateUserEmail(userId, "new@email.com"),
      ).rejects.toThrow(NotFoundError);

      expect(mockedUserModel.findById).toHaveBeenCalledWith(userId);
    });

    test("Should successfully update user's email", async () => {
      const userId = "some-id";
      const newEmail = "updated@email.com";

      const user: any = {
        email: "old@email.com",
        save: jest.fn().mockResolvedValue({ email: newEmail }),
      };

      mockedUserModel.findById.mockResolvedValue(user as any);

      const result = await repository.updateUserEmail(userId, newEmail);

      expect(mockedUserModel.findById).toHaveBeenCalledWith(userId);
      expect(user.save).toHaveBeenCalled();
      expect(result).toEqual({ email: newEmail });
    });
  });
});
