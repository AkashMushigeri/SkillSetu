import type { NextFunction, Request, Response } from 'express';
import { z, type ZodType } from 'zod';
import { AppError } from '../lib/errors';

/**
 * Turns a Zod failure into the standard error envelope. Only field paths and the
 * validator's own message are exposed — never the submitted value, which could
 * carry a password.
 */
function toValidationError(error: z.ZodError): AppError {
  const details = error.issues
    .map((issue) => {
      const path = issue.path.length > 0 ? issue.path.join('.') : '(root)';
      return `${path}: ${issue.message}`;
    })
    .slice(0, 10);

  return new AppError(`Request validation failed — ${details.join('; ')}`, {
    status: 400,
    code: 'validation_failed',
  });
}

export function validateBody<T extends ZodType>(schema: T) {
  return function bodyValidator(req: Request, _res: Response, next: NextFunction): void {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      next(toValidationError(result.error));
      return;
    }

    // Reassigning req.body is safe here: nothing downstream reads the raw payload.
    req.body = result.data;
    next();
  };
}

export function validateQuery<T extends ZodType>(schema: T) {
  return function queryValidator(req: Request, res: Response, next: NextFunction): void {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      next(toValidationError(result.error));
      return;
    }

    // res.locals, not req.query: Express 5 makes req.query a getter-only property.
    res.locals.query = result.data;
    next();
  };
}

export type { Request, Response, NextFunction };
