import UserModel, { User } from "@models/user.model.js";
import logger from "@config/logger.js";
import { ClientSession } from "mongoose";
import {
  BadRequestError,
  ConflictError,
  InternalRepositoryError,
  NotFoundError,
} from "@errors/Error.js";
import { getErrorMessage } from "@errors/error.utils.js";

export const findUserByEmail = async (email: string): Promise<User> => {
  if (!email) {
    throw new BadRequestError("Email is required to find a user");
  }
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new NotFoundError("User not Found");
    }
    return user;
  } catch (error) {
    logger.error("Failed to find user", {
      error,
      operation: "findUserByEmail",
      email,
    });

    throw new InternalRepositoryError("Failed to find user by email", {
      message: getErrorMessage(error),
    });
  }
};

export const createUser = async (
  userData: {
    email: string;
    hashedPassword: string;
    username: string;
  },
  session?: ClientSession,
): Promise<User> => {
  if (!userData.email || !userData.hashedPassword) {
    throw new BadRequestError(
      "Email and Password are required to create a user",
    );
  }
  try {
    const isSession = session ? { session } : {};

    const user = await UserModel.findOne({ email: userData.email });

    if (user) {
      throw new ConflictError("User with this email already exists");
    }

    const newUser = new UserModel(userData);
    return await newUser.save(isSession);
  } catch (error) {
    logger.error("Failed to create user", {
      error,
      operation: "createUser",
    });
    throw new InternalRepositoryError("Failed to create user", {
      message: getErrorMessage(error),
    });
  }
};

export const findUserById = async (userId: string) => {
  if (!userId) {
    throw new BadRequestError("User ID is required to find a user");
  }
  try {
    const user = await UserModel.findById(userId);
    if (!user) throw new NotFoundError("User not found");
    return user;
  } catch (error) {
    logger.error("Failed to fetch user", {
      error,
      operation: "findUserById",
      userId,
    });
    throw new InternalRepositoryError("Failed to find user", {
      message: getErrorMessage(error),
    });
  }
};

export const deleteUserById = async (userId: string) => {
  if (!userId) {
    throw new BadRequestError("User ID is required to delete a user");
  }
  try {
    const deletedUser = await UserModel.findByIdAndDelete(userId);
    if (!deletedUser) {
      throw new NotFoundError("User not found");
    }
    return deletedUser;
  } catch (error) {
    logger.error("Failed to delete user", {
      error,
      operation: "deleteUserById",
      userId,
    });
    throw new InternalRepositoryError("Failed to delete user", {
      message: getErrorMessage(error),
    });
  }
};

export const addRefreshToken = async (
  refreshToken: string,
  userId: string,
  session: ClientSession,
): Promise<{ ok: boolean }> => {
  if (!refreshToken) {
    throw new BadRequestError("Can't set refresh token if none passed!");
  }

  try {
    const user = await UserModel.findById(userId).session(session);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    user.refreshToken = refreshToken;

    await user.save({ session });

    return { ok: true };
  } catch (error) {
    logger.error("Failed to add refresh token to user", {
      error,
      refreshToken,
    });
    throw new InternalRepositoryError("Failed to add refresh token to user", {
      message: getErrorMessage(error),
    });
  }
};

export const updateUserPassword = async (
  userId: string,
  newPassword: string,
) => {
  if (!userId || !newPassword) {
    throw new BadRequestError(
      "User ID and new password are required to update password",
    );
  }
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    user.hashedPassword = newPassword;
    return await user.save();
  } catch (error) {
    logger.error("Failed to update user password", {
      error,
      operation: "updateUserPassword",
      userId,
    });
    throw new InternalRepositoryError("Failed to update password", {
      message: getErrorMessage(error),
    });
  }
};

export const updateUserEmail = async (userId: string, newEmail: string) => {
  if (!userId || !newEmail) {
    throw new BadRequestError(
      "User ID and new email are required to update email",
    );
  }
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    user.email = newEmail;
    return await user.save();
  } catch (error) {
    logger.error("Failed to update user email", {
      error,
      operation: "updateUserEmail",
      userId,
    });
    throw new InternalRepositoryError("Failed to update user email", {
      message: getErrorMessage(error),
    });
  }
};
