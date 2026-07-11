import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { UserRole } from './user-entity.types';

export type UserDoc = HydratedDocument<User>;

@ObjectType()
@Schema({
  timestamps: true,
  collection: 'users',
})
export class User {
  @Field(() => ID)
  readonly _id!: Types.ObjectId;

  @Field(() => String)
  @Prop({
    required: true,
    unique: true,
    type: String,
  })
  email!: string;

  @Field(() => String)
  @Prop({
    required: true,
    type: String,
  })
  username!: string;

  @Field(() => UserRole)
  @Prop({
    required: true,
    type: String,
    enum: UserRole,
    default: UserRole.USER,
  })
  role!: UserRole;

  @Prop({
    required: true,
    type: String,
    select: false,
  })
  hashedPassword!: string;

  @Prop({
    type: String,
  })
  refreshToken?: string;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
