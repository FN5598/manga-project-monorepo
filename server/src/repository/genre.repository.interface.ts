import { Genre } from "@models/genre.model.js";

export interface IGenreInterface {
  getAllGenres(): Promise<Genre[]>;
}
