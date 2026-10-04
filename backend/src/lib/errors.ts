export type AppErrorOptions = {
  status: number;
  code: string;
  cause?: unknown;
};

export class AppError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(message: string, { status, code, cause }: AppErrorOptions) {
    super(message, cause === undefined ? undefined : { cause });
    this.name = 'AppError';
    this.status = status;
    this.code = code;
  }

  static badRequest(message: string, code = 'bad_request'): AppError {
    return new AppError(message, { status: 400, code });
  }

  static unauthorized(message: string, code = 'unauthorized'): AppError {
    return new AppError(message, { status: 401, code });
  }

  static forbidden(message: string, code = 'forbidden'): AppError {
    return new AppError(message, { status: 403, code });
  }

  static notFound(message = 'Resource not found', code = 'not_found'): AppError {
    return new AppError(message, { status: 404, code });
  }

  static conflict(message: string, code = 'conflict'): AppError {
    return new AppError(message, { status: 409, code });
  }

  static unprocessable(message: string, code = 'unprocessable_entity'): AppError {
    return new AppError(message, { status: 422, code });
  }
}