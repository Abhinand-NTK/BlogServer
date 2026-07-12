import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/httpResponse.js';
import { categoryService } from '../services/category.service.js';

export const categoryController = {
  list: asyncHandler(async (_req: Request, res: Response) => {
    ok(res, await categoryService.listWithCounts());
  }),
};
