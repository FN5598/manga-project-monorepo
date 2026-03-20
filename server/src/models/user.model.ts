import { prop, getModelForClass, pre } from "@typegoose/typegoose";
import { EMAIL_REGEX } from "../config/regex.js";
import { Field, ID, ObjectType } from "type-graphql";

enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
  EDITOR = "EDITOR",
}

pre<User>("save", function () {
  if (!EMAIL_REGEX.test(this.email)) {
    throw new Error("Invalid email format");
  }
});
ObjectType();
export class User {
  @Field(() => ID)
  _id!: string;

  @Field(() => String)
  @prop({
    required: true,
    type: () => String,
  })
  email!: string;

  @Field(() => String)
  @prop({
    required: true,
    type: () => String,
  })
  name!: string;

  @Field(() => UserRole)
  @prop({
    required: true,
    type: () => UserRole,
  })
  role!: UserRole;

  @Field(() => String)
  @prop({
    required: true,
    type: () => String,
  })
  passwordHash!: string;
}

const UserModel = getModelForClass(User);
export default UserModel;
