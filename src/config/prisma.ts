import { PrismaClient } from '@prisma/client';
import { env } from './env.js';

/**
 * Single Prisma instance reused across the app (avoids exhausting the
 * Supabase connection pool during dev hot-reloads).
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: env.isProd ? ['error'] : ['error', 'warn'],
  });

if (!env.isProd) globalForPrisma.prisma = prisma;
