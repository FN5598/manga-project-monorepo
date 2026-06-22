export const GET_ALL_MANGAS = `
query MyQuery($paginationInput: PaginationInput, $sort: SortInputType, $filters: [MangaFilterTypes!]) {
	findAllMangas(paginationInput: $paginationInput, sort: $sort, filters: $filters) {
    _id
    title
    description
    author
    status
    previewUrl
    chaptersCount
    genres {
      slug
      name
    }
    createdAt
    updatedAt
    status
  }
  countMangas(filters: $filters)
}
`;

export const FIND_CHAPTERS_BY_MANGA_ID = `
query MyQuery($mangaId: String!) {
  findChaptersByMangaId(mangaId: $mangaId) {
    _id
    mangaId
    chapterNumber
    title
    storagePrefix
    pageCount
    uploadStatus
    createdAt
    updatedAt
  }
}
`;

export const FIND_MANGA_BY_ID = `
query MyQuery($mangaId: String!) {
  findMangaById(mangaId: $mangaId) {
    _id
    title
    author
    description
    genres {
      name
      description
    }
    status
    previewUrl
  }
}
`;

export const GET_PAGES_BY_CHAPTER_ID = `
query MyQuery(
  $chapterId: String!, 
  $paginationInput: PaginationInput, 
  $sort: SortInputType) {
  getPagesByChapterId(
    chapterId: $chapterId, 
    paginationInput: $paginationInput, 
    sort: $sort) {
      _id
      chapter
      imageKey
      fileSize
      createdAt
      pageUrl
      updatedAt
    }
}
`;

export const FIND_CHAPTER_BY_ID = `
query MyQuery($chapterId: String!) {
  findChapterById(chapterId: $chapterId) {
  	_id
  	mangaId
    chapterNumber
    title
    storagePrefix
    pageCount
    updatedAt
    createdAt
    updatedAt
  }
}
`;

export const FIND_MANGA_BY_NAME = `
query MyQuery($mangaTitle: String!) {
  findMangaByName(mangaTitle: $mangaTitle) {
    _id
    title
    author
    description
    chaptersCount
		status
    updatedAt
    createdAt
  }
}
`;

export const FIND_ALL_CHAPTERS = `
query MyQuery($sort: SortInputType, $paginationInput: PaginationInput) {
  findAllChapters(sort: $sort, paginationInput: $paginationInput) {
    _id
    title
    chapterNumber
    updatedAt
    mangaId
  }
}
`;

export const DELETE_USER_BY_ID = `
mutation MyMutation ($userId: String!) {
  deleteUserById(userId: $userId) {
    username
  }
}`;
