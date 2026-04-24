export type Page = {
  _id: string;
  pageUrl: string;
};

export enum Sort {
  ASC = "asc",
  DESC = "desc",
}

export type ApiError = {
  status?: number;
  data?: {
    message?: string;
    code?: string;
    errorInfo?: {
      field?: string;
      code?: string;
      message: string;
    };
  };
};

export type PaginationInput = {
  limit: number;
  page?: number;
};

export type SortInput = {
  sortBy: "asc" | "desc";
  field?: string;
};

export type PaginationSortInput = {
  paginationInput?: PaginationInput;
  sort?: SortInput;
};
