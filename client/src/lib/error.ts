import { emitAlert } from "@lib/alerts";

type AppError = {
  name: "AppError";
  data?: {
    message?: string;
  };
  message?: string;
};

type GraphQLError = {
  message?: string;
  extensions?: {
    code?: string;
  };
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function handleError(error: unknown): void {
  if (isRecord(error) && error.name === "AppError") {
    const appError = error as AppError;

    emitAlert(
      appError.data?.message ?? appError.message ?? "Something went wrong",
      "error",
      2500,
    );

    return;
  }

  if (
    isRecord(error) &&
    isRecord(error.extensions) &&
    typeof error.extensions.code === "string"
  ) {
    const graphQLError = error as GraphQLError;

    emitAlert(graphQLError.message ?? "Something went wrong", "error", 2500);

    return;
  }

  if (error instanceof Error) {
    emitAlert(error.message, "error", 2500);
    return;
  }

  emitAlert("Something went wrong", "error", 2500);
}
