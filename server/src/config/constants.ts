export type Pagination = {
  page: number;
  limit: number;
};

export enum SortInput {
  ASC = "asc",
  DESC = "desc",
}

export enum FileType {
  preview = "PREVIEW",
  page = "PAGE",
}

export const DEFAULT_PAGINATION: Required<Pagination> = {
  page: 1,
  limit: 100,
};

export const MAX_PREVIEW_SIZE = 500 * 1024; // 500KB
