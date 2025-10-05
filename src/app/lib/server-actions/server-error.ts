// Server-side error handling
export const SERVER_ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_AUTHORIZED: 'NOT_AUTHORIZED',
  NOT_FOUND: 'NOT_FOUND',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  FORBIDDEN: 'FORBIDDEN',
  ERROR: 'ERROR'
} as const;

export class ServerError extends Error {
  public data: unknown;
  public code: keyof typeof SERVER_ERROR_CODES;
  constructor(
    code: keyof typeof SERVER_ERROR_CODES = SERVER_ERROR_CODES.ERROR,
    message?: string,
    data?: unknown
  ) {
    super();
    this.code = code;
    this.data = data;
    this.message = message || '';
    Object.setPrototypeOf(this, ServerError.prototype);

    if (data instanceof Error) {
      this.message = data.message;
      this.stack = data.stack;
      this.name = data.name;
      this.cause = data.cause;
    }
  }
}
