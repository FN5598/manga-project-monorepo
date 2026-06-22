import logger from "@config/logger.js";
import { User } from "@models/user.model.js";
import { Arg, Mutation, Resolver } from "type-graphql";
import { UserRepository } from "@repository/index.js";
import {
  nonEmptyString,
  validateGraphQLInput,
} from "@validators/validator.utils.js";

@Resolver(() => User)
export class UserResolver {
  @Mutation(() => User)
  async deleteUserById(
    @Arg("userId", () => String)
    userId: string,
  ) {
    const parsedId = validateGraphQLInput(nonEmptyString, userId);
    logger.info("Delete user by id resolver called", { parsedId });
    return await UserRepository.deleteUserById(parsedId);
  }
}
