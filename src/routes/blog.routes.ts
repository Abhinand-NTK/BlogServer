import { Router } from 'express';
import { blogController } from '../controllers/blog.controller.js';
import { validate } from '../middleware/validate.js';
import { writeLimiter } from '../middleware/rateLimiter.js';
import {
  createBlogSchema,
  listBlogsQuerySchema,
  updateBlogSchema,
} from '../validators/blog.validator.js';

const router = Router();

router.get('/featured', blogController.home);
router.get('/by-id/:id', blogController.getById);
router.get('/', validate(listBlogsQuerySchema, 'query'), blogController.list);
router.get('/:slug', blogController.getBySlug);

router.post('/', writeLimiter, validate(createBlogSchema), blogController.create);
router.put('/:id', writeLimiter, validate(updateBlogSchema), blogController.update);
router.delete('/:id', writeLimiter, blogController.remove);

export default router;
