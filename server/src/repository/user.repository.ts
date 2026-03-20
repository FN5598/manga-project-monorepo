import UserModel from "@models/user.model.js";
import logger from "@config/logger.js";

export const findUserByEmail = async (email: string) => {
  if (!email) {
    throw new Error("Email is required to find a user");
  }
  try {
    const user = await UserModel.findOne({ email });
    return user;
  } catch (error) {
    logger.error("Failed to find user", {
      error,
      operation: "findUserByEmail",
      email,
    });
  }
};

export const createUser = async (userData: {
  email: string;
  password: string;
}) => {
  if (!userData.email || !userData.password) {
    throw new Error("Email and Password are required to create a user");
  }
  try {
    // TODO hash password before saving
    const newUser = new UserModel(userData);
    return await newUser.save();
  } catch (error) {
    logger.error("Failed to create user", {
      error,
      operation: "createUser",
    });
    throw error;
  }
};

export const findUserById = async (userId: string) => {
  if (!userId) {
    throw new Error("User ID is required to find a user");
  }
  try {
    const user = await UserModel.findById(userId);
    return user;
  } catch (error) {
    logger.error("Failed to fetch user", {
      error,
      operation: "findUserById",
      userId,
    });
    throw error;
  }
};

export const deleteUserById = async (userId: string) => {
  if (!userId) {
    throw new Error("User ID is required to delete a user");
  }
  try {
    const deletedUser = await UserModel.findByIdAndDelete(userId);
    if (!deletedUser) {
      throw new Error("User not found");
    }
    return deletedUser;
  } catch (error) {
    logger.error("Failed to delete user", {
      error,
      operation: "deleteUserById",
      userId,
    });
    throw error;
  }
};

export const updateUserPassword = async (
  userId: string,
  newPassword: string,
) => {
  if (!userId || !newPassword) {
    throw new Error("User ID and new password are required to update password");
  }
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    // TODO: Add hashing for password before saving
    user.passwordHash = newPassword;
    return await user.save();
  } catch (error) {
    logger.error("Failed to update user password", {
      error,
      operation: "updateUserPassword",
      userId,
    });
    throw error;
  }
};

export const updateUserEmail = async (userId: string, newEmail: string) => {
  if (!userId || !newEmail) {
    throw new Error("User ID and new email are required to update email");
  }
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
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
};
