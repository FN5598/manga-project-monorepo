import {
  getModelForClass,
  prop,
  modelOptions,
  Ref,
} from "@typegoose/typegoose";
import { Genre } from "./genre.model.js";
import mongoose from "mongoose";

@modelOptions({
  schemaOptions: {
    timestamps: true,
    collection: "mangas",
  },
})
export class Manga {
  @prop({
    required: true,
    type: () => String,
  })
  public title!: string;

  @prop({
    required: true,
    type: () => String,
  })
  public author!: string; // TODO make schema for author and reference it here

  @prop({
    default: "No description provided as of yet.",
    type: () => String,
  })
  public description!: string;

  @prop({
    required: true,
    type: () => String,
  })
  public imageKey!: string;

  @prop({
    ref: () => Genre,
    default: [],
    type: () => [mongoose.Schema.Types.ObjectId],
  })
  public genres!: Ref<Genre>[];

  @prop({
    required: true,
    default: 0,
    type: () => Number,
  })
  public chaptersCount!: number;

  @prop({
    required: true,
    type: () => String,
  })
  public chapterImagesBucket!: string;

  @prop({
    required: true,
    type: () => String,
  })
  public status!: string;
}

const MangaModel = getModelForClass(Manga);
export default MangaModel;
