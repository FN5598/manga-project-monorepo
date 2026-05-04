interface ErorrInfo {
  code?: string;
  message: string;
  details?: Record<string, unknown>;
}

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public errorInfo?: ErorrInfo,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class ConflictError extends AppError {
  constructor(message: string, errorInfo?: ErorrInfo) {
    super(409, "CONFLICT", message, errorInfo);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string, errorInfo?: ErorrInfo) {
    super(404, "NOT_FOUND", message, errorInfo);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string, errorInfo?: ErorrInfo) {
    super(400, "BAD_REQUEST", message, errorInfo);
  }
}

export class InputValidationError extends AppError {
  constructor(errorInfo: ErorrInfo) {
    super(
      400,
      "INPUT_VALIDATION_ERROR",
      "Some of input fields were incorrect",
      errorInfo,
    );
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string, errorInfo?: ErorrInfo) {
    super(401, "UNAUTHORIZED", message, errorInfo);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string, errorInfo?: ErorrInfo) {
    super(403, "FORBIDDEN", message, errorInfo);
  }
}

export class FileTooLargeError extends AppError {
  constructor(message: string) {
    super(413, "FILE_TOO_LARGE", message);
  }
}
/**
 * * 5xx Error codes
 */
export class InvalidEnvConfiguration extends AppError {
  constructor(
    message: string = "Invalid enviroment variables config",
    errorInfo?: ErorrInfo,
  ) {
    super(500, "INVALID_ENV_CONFIGURATION", message, errorInfo);
  }
}

export class InternalError extends AppError {
  constructor(message: string, errorInfo?: ErorrInfo) {
    super(500, "INTERNAL_ERROR", message, errorInfo);
  }
}
