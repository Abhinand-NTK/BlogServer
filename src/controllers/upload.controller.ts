import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/httpResponse.js';
import { uploadService } from '../services/upload.service.js';

export const uploadController = {
  signature: asyncHandler(async (req: Request, res: Response) => {
    const folder = typeof req.body?.folder === 'string' ? req.body.folder : 'blogcraft';
    ok(res, uploadService.createSignature(folder));
  }),

  destroy: asyncHandler(async (req: Request, res: Response) => {
    ok(res, await uploadService.destroy(req.params.publicId));
  }),
};
