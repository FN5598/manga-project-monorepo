import {
  getModelForClass,
  prop,
  modelOptions,
  Ref,
} from "@typegoose/typegoose";
import { Genre } from "./genre.model.js";
import mongoose from "mongoose";
import { ObjectType, Field, ID } from "type-graphql";

type MangaStatus = "ongoing" | "completed" | "hiatus" | "cancelled";

@modelOptions({
  schemaOptions: {
    timestamps: true,
    collection: "mangas",
  },
})
@ObjectType()
export class Manga {
  @Field(() => ID)
  readonly _id!: string;

  @Field(() => String)
  @prop({
    required: true,
    type: () => String,
  })
  title!: string;

  @Field(() => String)
  @prop({
    required: true,
    type: () => String,
  })
  author!: string; // TODO make schema for author and reference it here

  @Field(() => String, { nullable: true })
  @prop({
    default: "No description provided as of yet.",
    type: () => String,
  })
  description?: string;

  @Field(() => String, { nullable: true })
  @prop({
    type: () => String,
  })
  previewKey?: string;

  @Field(() => [Genre], { nullable: true })
  @prop({
    ref: () => Genre,
    default: [],
    type: () => [mongoose.Schema.Types.ObjectId],
  })
  genres?: Ref<Genre>[];

  @Field(() => String)
  @prop({
    required: true,
    enum: ["ongoing", "completed", "hiatus", "cancelled"],
    type: () => String,
  })
  status!: MangaStatus;

  @Field(() => String, { nullable: true })
  previewUrl?: string;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
}

const MangaModel = getModelForClass(Manga);
export default MangaModel;
