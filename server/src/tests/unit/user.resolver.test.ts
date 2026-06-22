import logger from "@config/logger.js";
import {
  ForbiddenError,
  InputValidationError,
  UnauthorizedError,
} from "@errors/Error.js";
import { UserRole } from "@models/user.model.js";
import { UserRepository } from "@repository/index.js";
import { UserResolver } from "@resolvers/user.resolver.js";

jest.mock("@repository/index.js", () => ({
  UserRepository: {
    deleteUserById: jest.fn(),
  },
}));
const mockedUserRepository = UserRepository as jest.Mocked<
  typeof UserRepository
>;

jest.mock("@config/logger.js");

let resolver: UserResolver;
const adminContext = {
  user: { userId: "admin-id", role: UserRole.ADMIN },
};
const userContext = {
  user: { userId: "user-id", role: UserRole.USER },
};
const anonymousContext = { user: null };

beforeEach(() => {
  jest.clearAllMocks();
  resolver = new UserResolver();
});

describe("User resolver", () => {
  describe("Mutation - deleteUserById", () => {
    test("Should throw - UnauthorizedError if user is not authenticated", async () => {
      await expect(
        resolver.deleteUserById(anonymousContext, "user-id"),
      ).rejects.toThrow(UnauthorizedError);

      expect(mockedUserRepository.deleteUserById).not.toHaveBeenCalled();
    });

    test("Should throw - ForbiddenError if user is not an admin", async () => {
      await expect(
        resolver.deleteUserById(userContext, "user-id"),
      ).rejects.toThrow(ForbiddenError);

      expect(mockedUserRepository.deleteUserById).not.toHaveBeenCalled();
    });

    test("Should delete user", async () => {
      const userId = "user-id";
      const user = { userId };
      mockedUserRepository.deleteUserById.mockResolvedValue(user as any);

      const result = await resolver.deleteUserById(adminContext, userId);

      expect(mockedUserRepository.deleteUserById).toHaveBeenCalledWith(userId);
      expect(mockedUserRepository.deleteUserById).toHaveBeenCalledTimes(1);
      expect(result).toBe(user);
    });

    test("Should throw - InputValidationError if userId is empty", async () => {
      const userId = "";

      await expect(
        resolver.deleteUserById(adminContext, userId),
      ).rejects.toThrow(InputValidationError);

      expect(mockedUserRepository.deleteUserById).not.toHaveBeenCalled();
    });
  });
});
