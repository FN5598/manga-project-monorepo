import {
  getModelForClass,
  prop,
  modelOptions,
  index,
  Ref,
} from "@typegoose/typegoose";
import { ObjectType, Field, ID } from "type-graphql";
import mongoose from "mongoose";
import { Chapter } from "./chapter.model.js";
import { Types } from "mongoose";

@index({ chapter: 1, pageNumber: 1 }, { unique: true })
@modelOptions({
  schemaOptions: {
    timestamps: true,
    collection: "pages",
  },
})
@ObjectType()
export class Page {
  @Field(() => ID)
  readonly _id!: string;

  @Field(() => ID)
  @prop({
    ref: () => Chapter,
    required: true,
    type: () => mongoose.Schema.Types.ObjectId,
  })
  chapter!: Ref<Chapter, Types.ObjectId>;

  @Field(() => String)
  @prop({
    required: true,
    type: () => String,
  })
  imageKey!: string;

  @Field(() => Number, { nullable: true })
  @prop({
    min: 0,
    default: null,
    type: () => Number,
  })
  fileSize?: number;

  @prop({
    required: true,
    min: 0,
    validate: Number.isInteger,
    type: () => Number,
  })
  pageNumber!: number;

  @Field(() => String)
  pageUrl?: string;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
}

const PageModel = getModelForClass(Page);
export default PageModel;
