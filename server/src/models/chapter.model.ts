import {
  getModelForClass,
  prop,
  modelOptions,
  index,
} from "@typegoose/typegoose";
import { ObjectType, ID, Field } from "type-graphql";

type UploadStatus = "draft" | "uploading" | "ready" | "failed";

@index({ manga: 1, chapterNumber: 1 }, { unique: true })
@modelOptions({
  schemaOptions: {
    timestamps: true,
    collection: "chapters",
  },
})
@ObjectType()
export class Chapter {
  @Field(() => ID)
  _id!: string;

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
    defailt: 0,
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
}

const ChapterModel = getModelForClass(Chapter);
export default ChapterModel;
