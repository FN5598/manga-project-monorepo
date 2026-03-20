import { gql } from "graphql-tag";

export const mangaQueries = gql`
  #
  # Mutations
  #
  type Mutation {
    uploadManga(mangaUploadInput: MangaUploadInput!): Manga!
  }
  #
  # Queries
  #
  type Query {
    findMangaById(mangaId: ID!): Manga

    findAllMangas(paginationInput: PaginationInput): [Manga!]!
  }

  #
  # Inputs and Types
  #
  input MangaUploadInput {
    title: String!
    description: String
    author: String!
    coverImageUrl: String
    genres: [String!]!
    chaptersCount: Int
  }

  input PaginationInput {
    page: Int!
    limit: Int!
  }

  type Manga {
    id: ID!
    title: String!
    author: String!
    description: String
    genres: [String!]!
    chaptersCount: Int
    createdAt: String!
    updatedAt: String!
    previewUrl: String!
  }
`;
