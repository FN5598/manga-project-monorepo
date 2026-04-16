export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unknown error";
}

interface errorShape {
  errorName: string;
  message: string;
  cause?: unknown;
  stack?: string;
}

export function getErrorInfo(error: unknown): errorShape {
  if (error instanceof Error) {
    return {
      errorName: error.name,
      message: error.message,
      cause: error.cause,
      stack: error.stack,
    };
  }

  return {
    errorName: "Unknown error",
    message: "Unknown error occured",
  };
}
