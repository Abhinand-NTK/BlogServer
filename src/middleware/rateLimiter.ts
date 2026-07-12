import rateLimit from 'express-rate-limit';

/** Generous global limit — protects the free-tier backend from abuse. */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please slow down.' },
});

/** Tighter limit for write / upload operations. */
export const writeLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many write requests, please try again later.' },
});
