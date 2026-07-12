import { Router } from 'express';
import { uploadController } from '../controllers/upload.controller.js';
import { writeLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Mint a signed upload signature — client uploads bytes directly to Cloudinary.
router.post('/signature', writeLimiter, uploadController.signature);
router.delete('/:publicId', writeLimiter, uploadController.destroy);

export default router;
