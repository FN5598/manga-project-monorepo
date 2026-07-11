import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UserRole } from './entities/user-entity.types';
import { Logger, UseGuards } from '@nestjs/common';
import { UserRepository } from '@users/repository/users.repository';
import type { GraphQLContext } from '@shared/graphql/graphql-context';
import { AuthGuard } from '@shared/guard/auth-guard';

@Resolver(() => User)
export class UserResolver {
  private readonly logger = new Logger(UserResolver.name);
  constructor(private readonly userRepository: UserRepository) {}

  @Query(() => User)
  @UseGuards(AuthGuard())
  async currentUser(@Context() context: GraphQLContext) {
    this.logger.log('Current user resolver called', {
      userId: context.user!.userId,
    });

    return await this.userRepository.findUserById(context.user!.userId);
  }

  @Mutation(() => User)
  @UseGuards(AuthGuard(UserRole.ADMIN))
  async deleteUserById(@Args('id') id: string) {
    this.logger.log('Delete user by id resolver called', id);
    return await this.userRepository.deleteUserById(id);
  }

  @Mutation(() => User)
  @UseGuards(AuthGuard())
  async deleteCurrentUser(@Context() context: GraphQLContext) {
    this.logger.log('Delete current user resolver called', {
      userId: context.user!.userId,
    });
    return await this.userRepository.deleteUserById(context.user!.userId);
  }
}
