import {
  prop,
  getModelForClass,
  pre,
  modelOptions,
  index,
} from "@typegoose/typegoose";
import { EMAIL_REGEX } from "../config/regex.js";
import { Field, ID, ObjectType, registerEnumType } from "type-graphql";

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
  EDITOR = "EDITOR",
}

registerEnumType(UserRole, {
  name: "UserRole",
});

@index({ email: 1 }, { unique: true })
@modelOptions({
  schemaOptions: {
    timestamps: true,
    collection: "users",
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.hashedPassword;
        return ret;
      },
    },
    toObject: {
      transform: (_doc, ret) => {
        delete ret.hashedPassword;
        return ret;
      },
    },
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

  @prop({
    required: true,
    type: () => String,
    select: false,
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
