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
