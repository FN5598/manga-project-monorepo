import type { ClientSession } from 'mongoose';
import type { UserDoc } from '@users/entities/user.entity';
import type { CreateUserDto } from '@users/dto/create-user.dto';

export interface IUserRepository {
  findUserByEmail(email: string, includePassword?: boolean): Promise<UserDoc>;
  createUser(
    userData: CreateUserDto,
    session?: ClientSession,
  ): Promise<UserDoc>;
  findUserById(userId: string): Promise<UserDoc>;
  deleteUserById(userId: string): Promise<UserDoc>;
  updateRefreshToken(
    refreshToken: string | undefined,
    userId: string,
    session?: ClientSession,
  ): Promise<boolean>;
  updateUserPassword(userId: string, newPassword: string): Promise<boolean>;
  updateUserEmail(userId: string, newEmail: string): Promise<UserDoc>;
}
