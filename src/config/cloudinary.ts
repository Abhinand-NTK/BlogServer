import { v2 as cloudinary } from 'cloudinary';
import { env } from './env.js';

cloudinary.config({
  cloud_name: env.cloudinary.name,
  api_key: env.cloudinary.key,
  api_secret: env.cloudinary.secret,
  secure: true,
});

export { cloudinary };
