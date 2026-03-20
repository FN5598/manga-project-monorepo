import {
  getModelForClass,
  modelOptions,
  prop,
  index,
  pre,
} from "@typegoose/typegoose";
import { ObjectType, ID, Field } from "type-graphql";

/**
 * Used to slugify genre name to be easy to use on BE, also can be used instead of _id
 *
 * @param text - Science Fiction
 * @returns - science-fiction
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // spaces -> -
    .replace(/[^\w\-]+/g, "") // remove special chars
    .replace(/\-\-+/g, "-"); // remove duplicate -
}

@modelOptions({
  schemaOptions: {
    collection: "genres",
    timestamps: true,
  },
})
@pre<Genre>("save", function () {
  if (this.isModified("name")) {
    this.slug = slugify(this.name);
  }
})
@index({ name: 1 }, { unique: true })
@index({ slug: 1 }, { unique: true })
@ObjectType()
export class Genre {
  @Field(() => ID)
  _id!: string;

  @Field(() => String)
  @prop({
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
    type: () => String,
  })
  name!: string;

  @Field(() => String)
  @prop({
    required: true,
    trim: true,
    lowercase: true,
    minlength: 2,
    maxlength: 60,
    type: () => String,
  })
  slug!: string;

  @Field(() => String, { nullable: true })
  @prop({
    trim: true,
    maxlength: 500,
    default: "",
    type: () => String,
  })
  description?: string;
}

export const GenreModel = getModelForClass(Genre);
