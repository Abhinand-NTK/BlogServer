import type { NextFunction, Request, Response } from 'express';
import type { ZodSchema } from 'zod';
import { AppError } from '../utils/AppError.js';

type Source = 'body' | 'query' | 'params';

/**
 * Validates and *replaces* the given request source with the parsed,
 * type-coerced result. Throws a 400 AppError with field details on failure.
 */
export const validate =
  (schema: ZodSchema, source: Source = 'body') =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const details = result.error.issues.map((i) => ({
        field: i.path.join('.'),
        message: i.message,
      }));
      return next(AppError.badRequest('Validation failed', details));
    }
    // Store parsed output on a namespaced key (req.query is read-only in Express 5).
    (req as Request & { valid?: Record<string, unknown> }).valid = {
      ...(req as Request & { valid?: Record<string, unknown> }).valid,
      [source]: result.data,
    };
    next();
  };

/** Typed accessor for validated data set by `validate`. */
export function valid<T>(req: Request, source: Source): T {
  return (req as Request & { valid?: Record<Source, unknown> }).valid?.[source] as T;
}
