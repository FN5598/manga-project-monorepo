export const GET_ALL_MANGAS = `
query MyQuery {
	findAllMangas {
    _id
    title
    description
    author
    status
    chaptersCount
    previewUrl
    status
    genres {
      slug
      name
    }
    createdAt
    updatedAt
  }
}
`;
