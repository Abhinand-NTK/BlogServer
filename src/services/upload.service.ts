import { cloudinary } from '../config/cloudinary.js';
import { env, isCloudinaryConfigured } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

/**
 * We never proxy image bytes through this server (free tier = tiny memory).
 * The client uploads directly to Cloudinary; here we only mint a signed
 * signature so uploads are authenticated and folder-scoped.
 */
export const uploadService = {
  createSignature(folder = 'blogcraft') {
    if (!isCloudinaryConfigured()) {
      throw AppError.badRequest(
        'Cloudinary is not configured on the server. Set CLOUDINARY_* env vars.',
      );
    }

    const timestamp = Math.round(Date.now() / 1000);
    const params = { timestamp, folder };
    const signature = cloudinary.utils.api_sign_request(params, env.cloudinary.secret);

    return {
      signature,
      timestamp,
      folder,
      apiKey: env.cloudinary.key,
      cloudName: env.cloudinary.name,
      uploadUrl: `https://api.cloudinary.com/v1_1/${env.cloudinary.name}/image/upload`,
    };
  },

  async destroy(publicId: string) {
    if (!isCloudinaryConfigured()) return { result: 'skipped' };
    return cloudinary.uploader.destroy(publicId);
  },
};
