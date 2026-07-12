import { createApp } from './app.js';
import { env } from './config/env.js';
import { prisma } from './config/prisma.js';
import { logger } from './utils/logger.js';

async function bootstrap() {
  const app = createApp();

  const server = app.listen(env.port, () => {
    logger.info(`🚀 BlogCraft API listening on port ${env.port} (${env.nodeEnv})`);
  });

  const shutdown = async (signal: string) => {
    logger.info(`${signal} received — shutting down gracefully`);
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => void shutdown('SIGTERM'));
  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('unhandledRejection', (reason) =>
    logger.error('Unhandled rejection', reason),
  );
}

bootstrap().catch((err) => {
  logger.error('Failed to start server', err);
  process.exit(1);
});
