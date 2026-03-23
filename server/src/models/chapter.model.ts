import {
  getModelForClass,
  prop,
  modelOptions,
  index,
  Ref,
} from "@typegoose/typegoose";
import { ObjectType, ID, Field } from "type-graphql";
import { Manga } from "./manga.model.js";
import { Types } from "mongoose";

export type UploadStatus = "draft" | "uploading" | "ready" | "failed";

@index({ mangaId: 1, chapterNumber: 1 }, { unique: true })
@modelOptions({
  schemaOptions: {
    timestamps: true,
    collection: "chapters",
  },
})
@ObjectType()
export class Chapter {
  @Field(() => ID)
  readonly _id!: string;

  @Field(() => ID)
  @prop({
    requried: true,
    type: () => Types.ObjectId,
    ref: () => Manga,
  })
  mangaId!: Ref<Manga, Types.ObjectId>;

  @Field(() => Number)
  @prop({
    required: true,
    min: 0,
    type: () => Number,
  })
  chapterNumber!: number;

  @Field(() => String, { nullable: true })
  @prop({
    trim: true,
    default: null,
    type: () => String,
  })
  title?: string;

  @Field(() => String)
  @prop({
    required: true,
    trim: true,
    type: () => String,
  })
  storagePrefix!: string;
  // example: mangas/OnePiece/chapterNumber/images

  @Field(() => Number)
  @prop({
    default: 0,
    min: 0,
    type: () => Number,
  })
  pageCount!: number;

  @Field(() => String)
  @prop({
    required: true,
    enum: ["draft", "uploading", "ready", "failed"],
    defautl: "draft",
    type: () => String,
  })
  uploadStatus!: UploadStatus;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
}

const ChapterModel = getModelForClass(Chapter);
export default ChapterModel;
