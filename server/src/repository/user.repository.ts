import UserModel, { User } from "@models/user.model.js";
import logger from "@config/logger.js";
import { ClientSession } from "mongoose";
import {
  BadRequestError,
  ConflictError,
  InternalError,
  NotFoundError,
} from "@errors/Error.js";
import { getErrorMessage } from "@errors/error.utils.js";
import { IUserInterface } from "./user.repository.interface.js";

export class IUserRepository implements IUserInterface {
  async findUserByEmail(email: string, password: boolean): Promise<User> {
    if (!email) throw new BadRequestError("Email is required to find a user");

    try {
      const query = password
        ? UserModel.findOne({ email }).select("+hashedPassword")
        : UserModel.findOne({ email });
      const user = await query;

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

      throw error;
    }
  }

  async createUser(
    userData: {
      email: string;
      hashedPassword: string;
      username: string;
    },
    session?: ClientSession,
  ): Promise<User> {
    if (!userData.email || !userData.hashedPassword) {
      throw new BadRequestError(
        "Email and Password are required to create a user",
      );
    }
    try {
      const user = await UserModel.findOne({ email: userData.email });

      if (user) throw new ConflictError("User with this email already exists");

      const isSession = session ? { session } : {};
      const [newUser] = await UserModel.create([userData], isSession);

      if (!newUser) throw new NotFoundError("Failed to find user");
      return newUser;
    } catch (error) {
      logger.error("Failed to create user", {
        error,
        operation: "createUser",
      });
      throw error;
    }
  }

  async findUserById(userId: string): Promise<User> {
    if (!userId)
      throw new BadRequestError("User ID is required to find a user");

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
      throw error;
    }
  }

  async deleteUserById(userId: string): Promise<User> {
    if (!userId)
      throw new BadRequestError("User ID is required to delete a user");

    try {
      const deletedUser = await UserModel.findByIdAndDelete(userId);

      if (!deletedUser) throw new NotFoundError("User not found");

      return deletedUser;
    } catch (error) {
      logger.error("Failed to delete user", {
        error,
        operation: "deleteUserById",
        userId,
      });
      throw error;
    }
  }

  async updateRefreshToken(
    refreshToken: string | undefined,
    userId: string,
    session?: ClientSession,
  ): Promise<boolean> {
    if (!userId)
      throw new BadRequestError("UserId is required to update refresh token");
    try {
      let query = UserModel.findByIdAndUpdate(
        { _id: userId },
        { refreshToken },
      );

      if (session) query.session(session);

      const user = await query;

      if (!user) throw new NotFoundError("User not found");

      return true;
    } catch (error) {
      logger.error("Failed to add refresh token to user", {
        error,
        refreshToken,
      });
      throw error;
    }
  }

  async updateUserPassword(
    userId: string,
    newPassword: string,
  ): Promise<boolean> {
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
      await user.save();

      return true;
    } catch (error) {
      logger.error("Failed to update user password", {
        error,
        operation: "updateUserPassword",
        userId,
      });
      throw error;
    }
  }

  async updateUserEmail(userId: string, newEmail: string): Promise<User> {
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
      throw error;
    }
  }
}
