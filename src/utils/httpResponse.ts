import type { Response } from 'express';

/** Consistent success envelope across the API. */
export function ok<T>(res: Response, data: T, status = 200, meta?: unknown) {
  return res.status(status).json({
    success: true,
    data,
    ...(meta ? { meta } : {}),
  });
}
