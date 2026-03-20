import * as mangaResolvers from "./manga.resolvers.js";

export const resolvers = {
  Query: {
    // Manga Query Resolvers
    findAllMangas: mangaResolvers.findAllMangasResolver,
    findMangaById: mangaResolvers.findMangaByIdResolver,
  },
  Mutation: {
    // Manga Mutation Resolvers
    uploadManga: mangaResolvers.uploadMangaResolver,
  },
};
