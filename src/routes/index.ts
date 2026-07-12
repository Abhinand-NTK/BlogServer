import { Router } from 'express';
import blogRoutes from './blog.routes.js';
import categoryRoutes from './category.routes.js';
import uploadRoutes from './upload.routes.js';
import { blogController } from '../controllers/blog.controller.js';
import { validate } from '../middleware/validate.js';
import { listBlogsQuerySchema } from '../validators/blog.validator.js';

const router = Router();

router.get('/health', (_req, res) =>
  res.json({ success: true, status: 'ok', uptime: process.uptime() }),
);

router.use('/blogs', blogRoutes);
router.use('/categories', categoryRoutes);
router.use('/upload', uploadRoutes);

// Dedicated search alias (maps ?q= to the list endpoint's ?search=).
router.get(
  '/search',
  (req, _res, next) => {
    if (req.query.q && !req.query.search) req.query.search = req.query.q;
    next();
  },
  validate(listBlogsQuerySchema, 'query'),
  blogController.list,
);

export default router;
