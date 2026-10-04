import type { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { AppError } from '../lib/errors';

const ALLOWED_METHODS = ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'];
const ALLOWED_HEADERS = ['Authorization', 'Content-Type', 'X-Request-Id'];

/**
 * Strict allow-list CORS.
 *
 * There is deliberately no `*` and no reflection of unlisted origins: a wildcard
 * would let any page read authenticated responses. Requests without an Origin
 * header (server-to-server, curl) are allowed through untouched, which is not a
 * cross-origin request at all.
 */
export function createCorsMiddleware(allowedOrigins: readonly string[]) {
  const allowList = new Set(allowedOrigins.map((origin) => origin.trim().replace(/\/$/, '')).filter(Boolean));

  return cors({
    origin(origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }

      const normalised = origin.replace(/\/$/, '');

      if (allowList.has(normalised)) {
        callback(null, true);
        return;
      }

      callback(new AppError('Origin is not allowed.', { status: 403, code: 'origin_not_allowed' }));
    },
    credentials: false,
    methods: ALLOWED_METHODS,
    allowedHeaders: ALLOWED_HEADERS,
    maxAge: 600,
  });
}

export function notAllowedOriginHandler(_req: Request, _res: Response, next: NextFunction): void {
  next(AppError.forbidden('Origin is not allowed.', 'origin_not_allowed'));
}
