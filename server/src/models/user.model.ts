import { prop, getModelForClass, pre } from "@typegoose/typegoose";
import { EMAIL_REGEX } from "../config/regex.js";

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
export class User {
  @prop({
    required: true,
    type: () => String,
  })
  public email!: string;

  @prop({
    required: true,
    type: () => String,
  })
  public name!: string;

  @prop({
    required: true,
    type: () => UserRole,
  })
  public role!: UserRole;

  @prop({
    required: true,
    type: () => String,
  })
  public passwordHash!: string;
}

const UserModel = getModelForClass(User);
export default UserModel;
