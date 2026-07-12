/* Minimal structured logger — swap for pino/winston later without touching callers. */
const ts = () => new Date().toISOString();

export const logger = {
  info: (msg: string, meta?: unknown) =>
    console.log(`[${ts()}] INFO  ${msg}`, meta ?? ''),
  warn: (msg: string, meta?: unknown) =>
    console.warn(`[${ts()}] WARN  ${msg}`, meta ?? ''),
  error: (msg: string, meta?: unknown) =>
    console.error(`[${ts()}] ERROR ${msg}`, meta ?? ''),
};
