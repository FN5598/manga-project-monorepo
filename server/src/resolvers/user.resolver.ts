import logger from "@config/logger.js";
import { User, UserRole } from "@models/user.model.js";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { UserRepository } from "@repository/index.js";
import {
  nonEmptyString,
  validateGraphQLInput,
} from "@validators/validator.utils.js";
import { GraphQLContext } from "./resolver.utils.js";
import { ForbiddenError, UnauthorizedError } from "@errors/Error.js";

@Resolver(() => User)
export class UserResolver {
  @Mutation(() => User)
  async deleteUserById(
    @Ctx() context: GraphQLContext,
    @Arg("userId", () => String)
    userId: string,
  ) {
    if (!context.user)
      throw new UnauthorizedError("Must be authorized to access this route");

    if (context.user.role !== UserRole.ADMIN)
      throw new ForbiddenError("You do not have permission to access route");

    const parsedId = validateGraphQLInput(nonEmptyString, userId);
    logger.info("Delete user by id resolver called", { parsedId });
    return await UserRepository.deleteUserById(parsedId);
  }
}
