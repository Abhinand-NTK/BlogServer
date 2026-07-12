import { z } from 'zod';
import { CATEGORY_VALUES } from '../constants/categories.js';

const url = z.string().url().or(z.literal('')).optional();

export const createBlogSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(160),
  subtitle: z.string().max(220).optional().or(z.literal('')),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, 'Slug may only contain lowercase letters, numbers and hyphens')
    .max(200)
    .optional(),
  excerpt: z.string().max(300).optional().or(z.literal('')),
  content: z.string().min(1, 'Content is required'),
  category: z.enum(CATEGORY_VALUES as [string, ...string[]]).default('OTHERS'),
  tags: z.array(z.string().min(1).max(40)).max(20).default([]),
  author: z.string().min(1).max(80).default('Editorial Team'),
  featuredImage: url,
  galleryImages: z.array(z.string().url()).max(30).default([]),
  featured: z.boolean().default(false),
  status: z.enum(['DRAFT', 'PUBLISHED']).default('DRAFT'),
  seoTitle: z.string().max(70).optional().or(z.literal('')),
  seoDescription: z.string().max(180).optional().or(z.literal('')),
  seoKeywords: z.array(z.string()).max(20).default([]),
  ogImage: url,
  canonicalUrl: url,
});

export const updateBlogSchema = createBlogSchema.partial();

export const listBlogsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(9),
  category: z.enum(CATEGORY_VALUES as [string, ...string[]]).optional(),
  search: z.string().max(120).optional(),
  sort: z.enum(['newest', 'oldest', 'popular']).default('newest'),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ALL']).default('PUBLISHED'),
  tag: z.string().max(40).optional(),
  featured: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
});

export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;
export type ListBlogsQuery = z.infer<typeof listBlogsQuerySchema>;
