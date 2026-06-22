import { User } from "@models/user.model.js";
import { ClientSession } from "mongoose";

export interface IUserInterface {
  findUserByEmail(email: string, password: boolean): Promise<User>;

  createUser(
    userData: {
      email: string;
      hashedPassword: string;
      username: string;
    },
    session?: ClientSession,
  ): Promise<User>;

  findUserById(userId: string): Promise<User>;

  deleteUserById(userId: string): Promise<User>;

  updateRefreshToken(
    refreshToken: string | undefined,
    userId: string,
    session?: ClientSession,
  ): Promise<boolean>;

  updateUserPassword(userId: string, newPassword: string): Promise<boolean>;

  updateUserEmail(userId: string, newEmail: string): Promise<User>;
}
