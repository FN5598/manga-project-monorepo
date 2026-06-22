export enum Sort {
  ASC = "asc",
  DESC = "desc",
}

export enum MangaSortFields {
  CREATED_AT = "createdAt",
}

export type PaginationInput = {
  limit: number;
  page?: number;
};

export type SortInput = {
  sortBy: "asc" | "desc";
  field?: string;
};

export enum SortFields {
  CREATED_AT = "createdAt",
}

export enum MangaFilterFields {
  STATUS = "STATUS",
  GENRES = "GENRES",
  AUTHOR = "AUTHOR",
  TITLE = "TITLE",
  ID = "ID",
}

export type FilterInput = {
  field: MangaFilterFields;
  value: string[];
};

export type PaginationSortInput = {
  paginationInput?: PaginationInput;
  sort?: SortInput;
};

export type PaginationSortFilterInput = {
  paginationInput?: PaginationInput;
  sort?: SortInput;
  filters?: FilterInput[];
};

export type AllowedImageUploadTypes = "image/jpeg" | "image/png" | "image/webp";

export enum MyLibraryTabs {
  HISTORY = "history",
  FAVOURITES = "favourites",
  PROFILE = "profile",
}

export type LoginForm = {
  email: string;
  password: string;
};
