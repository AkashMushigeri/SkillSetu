import { randomUUID } from 'node:crypto';
import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import type { Pool } from 'pg';
import type { Auth } from 'firebase-admin/auth';
import { AppError } from './lib/errors';
import { logger } from './lib/logger';
import { createAuthMiddleware } from './middleware/auth';
import { createCorsMiddleware } from './middleware/cors';
import { createIdentityRouter } from './routes/auth';
import { createRoleRequestRouter } from './routes/roleRequests';
import { createHealthRouter, type FirebaseState } from './routes/health';

const JSON_BODY_LIMIT = '1mb';
const SAFE_REQUEST_ID_PATTERN = /^[A-Za-z0-9._:-]{1,64}$/;

export type CreateAppOptions = {
  pool: Pool;
  firebaseState?: FirebaseState;
  resolveAuth?: () => Auth;
  allowedOrigins?: readonly string[];
};

function resolveRequestId(req: Request): string {
  const inbound = req.header('x-request-id');
  return inbound && SAFE_REQUEST_ID_PATTERN.test(inbound) ? inbound : randomUUID();
}

function elapsedMsSince(startedAt: bigint): number {
  return Number(process.hrtime.bigint() - startedAt) / 1_000_000;
}

function requestContext(req: Request, res: Response, next: NextFunction): void {
  const startedAt = process.hrtime.bigint();
  const requestId = resolveRequestId(req);

  res.locals.requestId = requestId;
  res.setHeader('X-Request-Id', requestId);

  res.on('finish', () => {
    logger.info(
      {
        requestId,
        method: req.method,
        path: req.path,
        status: res.statusCode,
        durationMs: Math.round(elapsedMsSince(startedAt) * 1000) / 1000,
      },
      'request completed',
    );
  });

  next();
}

function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({
    error: 'Resource not found',
    code: 'not_found',
    requestId: String(res.locals.requestId ?? ''),
  });
}

function classifyClientError(error: unknown): { status: number; code: string } | null {
  if (typeof error !== 'object' || error === null) {
    return null;
  }

  const { type } = error as { type?: unknown };

  if (type === 'entity.parse.failed') {
    return { status: 400, code: 'invalid_json' };
  }

  if (type === 'entity.too.large') {
    return { status: 413, code: 'payload_too_large' };
  }

  return null;
}

function errorHandler(error: unknown, _req: Request, res: Response, next: NextFunction): void {
  if (res.headersSent) {
    next(error);
    return;
  }

  const requestId = String(res.locals.requestId ?? '');
  const clientError = classifyClientError(error);
  const status = error instanceof AppError ? error.status : (clientError?.status ?? 500);
  const code = error instanceof AppError ? error.code : (clientError?.code ?? 'internal_error');
  const message =
    error instanceof AppError ? error.message : status >= 500 ? 'Internal server error' : 'Invalid request';

  logger[status >= 500 ? 'error' : 'warn']({ requestId, status, code, err: error }, 'request failed');

  res.status(status).json({ error: message, code, requestId });
}

export function createApp({ pool, firebaseState, resolveAuth, allowedOrigins }: CreateAppOptions) {
  const app = express();

  app.disable('x-powered-by');
  app.use(requestContext);
  app.use(createCorsMiddleware(allowedOrigins ?? []));
  app.use(express.json({ limit: JSON_BODY_LIMIT }));
  app.use(createHealthRouter(pool, firebaseState ?? (() => 'not_initialized')));

  // Auth routes only mount when an Auth instance is resolvable, so /health keeps
  // working even when Firebase configuration is absent.
  if (resolveAuth) {
    const authMiddleware = createAuthMiddleware({ pool, resolveAuth });
    app.use(createIdentityRouter({ pool, auth: resolveAuth(), authMiddleware }));
    app.use(createRoleRequestRouter({ pool, auth: resolveAuth(), authMiddleware }));
  } else {
    logger.warn('auth routes are not mounted: no Firebase Auth resolver was provided');
  }

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}