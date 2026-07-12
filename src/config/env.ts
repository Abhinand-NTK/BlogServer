import dotenv from 'dotenv';

dotenv.config();

/** Fail fast if a required variable is missing in production. */
function required(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  isProd: process.env.NODE_ENV === 'production',
  port: Number(process.env.PORT ?? 5000),
  clientOrigins: (process.env.CLIENT_ORIGIN ?? 'http://localhost:5173')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean),
  databaseUrl: required('DATABASE_URL', 'postgresql://localhost:5432/blogcraft'),
  cloudinary: {
    name: process.env.CLOUDINARY_NAME ?? '',
    key: process.env.CLOUDINARY_KEY ?? '',
    secret: process.env.CLOUDINARY_SECRET ?? '',
    preset: process.env.CLOUDINARY_PRESET ?? 'blogcraft_unsigned',
  },
} as const;

export const isCloudinaryConfigured = () =>
  Boolean(env.cloudinary.name && env.cloudinary.key && env.cloudinary.secret);
