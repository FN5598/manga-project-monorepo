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
  _id!: string;

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

  @prop({
    required: true,
    type: () => String,
  })
  previewKey!: string;

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
}

const MangaModel = getModelForClass(Manga);
export default MangaModel;
