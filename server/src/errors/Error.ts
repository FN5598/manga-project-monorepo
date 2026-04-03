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
    public errorInfo?: ErorrInfo | ErorrInfo[],
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflict") {
    super(409, "CONFLICT", message);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not found") {
    super(404, "NOT_FOUND", message);
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad request") {
    super(400, "BAD_REQUEST", message);
  }
}

export class InputValidationError extends AppError {
  constructor(message = "Failed to validate input", errorInfo: ErorrInfo[]) {
    super(400, "INPUT_VALIDATION_ERROR", message, errorInfo);
  }
}

export class InternalRepositoryError extends AppError {
  constructor(message: string, errorInfo: ErorrInfo) {
    super(500, "INTERNAL_REPOSITORY_ERROR", message, errorInfo);
  }
}

export class InternalControllerError extends AppError {
  constructor(message: string) {
    super(500, "INTERNAL_CONTROLLER_ERROR", message);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Session expired") {
    super(401, "REFRESH_TOKEN_EXPIRED", message);
  }
}
