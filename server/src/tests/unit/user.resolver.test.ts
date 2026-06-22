import logger from "@config/logger.js";
import { InputValidationError } from "@errors/Error.js";
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

beforeEach(() => {
  jest.clearAllMocks();
  resolver = new UserResolver();
});

describe("User resolver", () => {
  describe("Mutation - deleteUserById", () => {
    test("Should delete user", async () => {
      const userId = "user-id";
      const user = { userId };
      mockedUserRepository.deleteUserById.mockResolvedValue(user as any);

      const result = await resolver.deleteUserById(userId);

      expect(mockedUserRepository.deleteUserById).toHaveBeenCalledWith(userId);
      expect(mockedUserRepository.deleteUserById).toHaveBeenCalledTimes(1);
      expect(result).toBe(user);
    });

    test("Should throw - InputValidationError if userId is empty", async () => {
      const userId = "";

      await expect(resolver.deleteUserById(userId)).rejects.toThrow(
        InputValidationError,
      );

      expect(mockedUserRepository.deleteUserById).not.toHaveBeenCalled();
    });
  });
});
