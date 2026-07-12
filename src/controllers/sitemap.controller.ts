import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sitemapService } from '../services/sitemap.service.js';

export const sitemapController = {
  xml: asyncHandler(async (req: Request, res: Response) => {
    const siteUrl =
      (req.query.site as string) ||
      process.env.SITE_URL ||
      `${req.protocol}://${req.get('host')}`;
    const xml = await sitemapService.build(siteUrl);
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  }),
};
