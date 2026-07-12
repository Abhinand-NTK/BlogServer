/** Operational error carrying an HTTP status code. */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: unknown;

  constructor(message: string, statusCode = 500, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype);
  }

  static badRequest(message: string, details?: unknown) {
    return new AppError(message, 400, details);
  }
  static notFound(message = 'Resource not found') {
    return new AppError(message, 404);
  }
  static conflict(message: string) {
    return new AppError(message, 409);
  }
}
