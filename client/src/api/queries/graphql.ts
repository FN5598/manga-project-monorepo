export const GET_ALL_MANGAS = `
query MyQuery {
  findAllMangas {
    title
    author
    description
    genres
    chaptersCount
    createdAt
    updatedAt
    previewUrl
  }
}
`;
