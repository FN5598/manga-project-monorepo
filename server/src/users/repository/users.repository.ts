import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { ClientSession, Model } from 'mongoose';
import { User } from '@users/entities/user.entity';
import type { UserDoc } from '@users/entities/user.entity';
import type { IUserRepository } from '@users/repository/users-repository.interface';
import type { CreateUserDto } from '@users/dto/create-user.dto';

@Injectable()
export class UserRepository implements IUserRepository {
  private readonly logger = new Logger(UserRepository.name);

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDoc>,
  ) {}

  async findUserByEmail(
    email: string,
    includePassword = false,
  ): Promise<UserDoc> {
    if (!email) {
      throw new BadRequestException('Email is required to find a user');
    }

    try {
      const query = this.userModel.findOne({ email });
      const user = includePassword
        ? await query.select('+hashedPassword').exec()
        : await query.exec();

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user;
    } catch (error: unknown) {
      this.logger.error('Failed to fetch user by email', {
        error,
        email,
      });
      throw error;
    }
  }

  async createUser(
    userData: CreateUserDto,
    session?: ClientSession,
  ): Promise<UserDoc> {
    if (!userData.email || !userData.hashedPassword) {
      throw new BadRequestException(
        'Email and password are required to create a user',
      );
    }

    try {
      const existingUser = await this.userModel.findOne({
        email: userData.email,
      });

      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }

      const createdUsers = session
        ? await this.userModel.create([userData], { session })
        : await this.userModel.create([userData]);
      const [newUser] = createdUsers;

      if (!newUser) {
        throw new NotFoundException('Failed to create user');
      }

      return newUser;
    } catch (error: unknown) {
      this.logger.error('Failed to create user', {
        error,
        operation: 'createUser',
      });
      throw error;
    }
  }

  async findUserById(userId: string): Promise<UserDoc> {
    if (!userId) {
      throw new BadRequestException('User ID is required to find a user');
    }

    try {
      const user = await this.userModel.findById(userId);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user;
    } catch (error: unknown) {
      this.logger.error('Failed to fetch user', {
        error,
        operation: 'findUserById',
        userId,
      });
      throw error;
    }
  }

  async deleteUserById(userId: string): Promise<UserDoc> {
    if (!userId) {
      throw new BadRequestException('User ID is required to delete a user');
    }

    try {
      const deletedUser = await this.userModel.findByIdAndDelete(userId);

      if (!deletedUser) {
        throw new NotFoundException('User not found');
      }

      return deletedUser;
    } catch (error: unknown) {
      this.logger.error('Failed to delete user', {
        error,
        operation: 'deleteUserById',
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
    if (!userId) {
      throw new BadRequestException(
        'UserId is required to update refresh token',
      );
    }

    try {
      const user = await this.userModel.findByIdAndUpdate(
        userId,
        { refreshToken },
        { new: true, session },
      );

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return true;
    } catch (error: unknown) {
      this.logger.error('Failed to add refresh token to user', {
        error,
      });
      throw error;
    }
  }

  async updateUserPassword(
    userId: string,
    newPassword: string,
  ): Promise<boolean> {
    if (!userId || !newPassword) {
      throw new BadRequestException(
        'User ID and new password are required to update password',
      );
    }

    try {
      const user = await this.userModel.findById(userId);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      user.hashedPassword = newPassword;
      await user.save();

      return true;
    } catch (error: unknown) {
      this.logger.error('Failed to update user password', {
        error,
        operation: 'updateUserPassword',
        userId,
      });
      throw error;
    }
  }

  async updateUserEmail(userId: string, newEmail: string): Promise<UserDoc> {
    if (!userId || !newEmail) {
      throw new BadRequestException(
        'User ID and new email are required to update email',
      );
    }

    try {
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      user.email = newEmail;
      return await user.save();
    } catch (error: unknown) {
      this.logger.error('Failed to update user email', {
        error,
        operation: 'updateUserEmail',
        userId,
      });
      throw error;
    }
  }
}
