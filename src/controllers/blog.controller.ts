import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/httpResponse.js';
import { valid } from '../middleware/validate.js';
import { blogService } from '../services/blog.service.js';
import type {
  CreateBlogInput,
  ListBlogsQuery,
  UpdateBlogInput,
} from '../validators/blog.validator.js';

export const blogController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const query = valid<ListBlogsQuery>(req, 'query');
    const result = await blogService.list(query);
    ok(res, result.items, 200, result.pagination);
  }),

  home: asyncHandler(async (_req: Request, res: Response) => {
    ok(res, await blogService.homeFeed());
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    ok(res, await blogService.getById(req.params.id));
  }),

  getBySlug: asyncHandler(async (req: Request, res: Response) => {
    const result = await blogService.getBySlug(req.params.slug, { incrementViews: true });
    ok(res, result);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const input = valid<CreateBlogInput>(req, 'body');
    ok(res, await blogService.create(input), 201);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const input = valid<UpdateBlogInput>(req, 'body');
    ok(res, await blogService.update(req.params.id, input));
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    ok(res, await blogService.remove(req.params.id));
  }),
};
