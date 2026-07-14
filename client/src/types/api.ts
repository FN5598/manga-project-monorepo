// Custom REST api app errors
export type ApiErrorResponse = {
  status: number;
  data: {
    message: string;
    code: string;
    errorInfo?: {
      field?: string;
      code?: string;
      message?: string;
    };
  };
};

export type ApiSuccessResponse<TData> = {
  status: number;
  data: TData;
};

export type GraphQLError = {
  message: string;
  path?: Array<string | number>;
  extensions?: {
    code?: string;
    status: number;
    [key: string]: unknown;
  };
};

/**
 * Graphql response
 *
 * @example
 * type LoginPayload = {
 *  user: User;
 *  isLoggedIn: boolean;
 * }
 *
 * type LoginResponse = GraphQLResponse<"login", LoginPayload>
 */
export type GraphQLResponse<TData extends Record<string, unknown>> = {
  data: TData;
  errors?: GraphQLError[];
};
