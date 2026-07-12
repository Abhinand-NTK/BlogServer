import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { env } from './config/env.js';
import apiRoutes from './routes/index.js';
import { sitemapController } from './controllers/sitemap.controller.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { logger } from './utils/logger.js';

export function createApp() {
  const app = express();

  app.set('trust proxy', 1);
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(compression());
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));

  app.use(
    cors({
      origin(origin, cb) {
        // Allow same-origin / server-to-server (no origin) and whitelisted origins.
        if (!origin || env.clientOrigins.includes(origin)) return cb(null, true);
        return cb(new Error(`CORS blocked for origin: ${origin}`));
      },
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      credentials: false,
    }),
  );

  app.use(
    morgan(env.isProd ? 'combined' : 'dev', {
      stream: { write: (msg) => logger.info(msg.trim()) },
    }),
  );

  app.get('/', (_req, res) =>
    res.json({ success: true, service: 'BlogCraft API', docs: '/api/health' }),
  );

  // SEO endpoint lives at the root so crawlers can reach /sitemap.xml.
  app.get('/sitemap.xml', sitemapController.xml);
  app.get('/api/sitemap.xml', sitemapController.xml);

  app.use('/api', apiLimiter, apiRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
