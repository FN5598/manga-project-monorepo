import {
  prop,
  getModelForClass,
  pre,
  modelOptions,
  index,
} from "@typegoose/typegoose";
import { EMAIL_REGEX } from "../config/regex.js";
import { Field, ID, ObjectType } from "type-graphql";

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
  EDITOR = "EDITOR",
}

@index({ email: 1 }, { unique: true })
@modelOptions({
  schemaOptions: {
    timestamps: true,
    collection: "users",
  },
})
@pre<User>("save", function () {
  if (!EMAIL_REGEX.test(this.email)) {
    throw new Error("Invalid email format");
  }
})
@ObjectType()
export class User {
  @Field(() => ID)
  readonly _id!: string;

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
  username!: string;

  @Field(() => UserRole)
  @prop({
    required: true,
    type: () => String,
    enum: UserRole,
    default: UserRole.USER,
  })
  role!: UserRole;

  @Field(() => String)
  @prop({
    required: true,
    type: () => String,
  })
  hashedPassword!: string;

  @prop({
    type: () => String,
  })
  refreshToken?: string;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
}

const UserModel = getModelForClass(User);
export default UserModel;
