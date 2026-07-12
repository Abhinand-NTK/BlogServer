import type { Prisma } from '@prisma/client';
import { blogRepository } from '../repositories/blog.repository.js';
import { AppError } from '../utils/AppError.js';
import {
  deriveExcerpt,
  estimateReadingTime,
  slugify,
  uniqueSlug,
} from '../utils/text.js';
import type {
  CreateBlogInput,
  ListBlogsQuery,
  UpdateBlogInput,
} from '../validators/blog.validator.js';

/** Normalise empty strings to null so optional URL columns stay clean. */
const nn = (v?: string) => (v && v.trim() ? v.trim() : null);

async function resolveSlug(desired: string | undefined, title: string, currentId?: string) {
  const base = desired ? slugify(desired) : slugify(title);
  if (!base) return uniqueSlug(title);

  const existing = await blogRepository.slugExists(base);
  if (!existing || existing.id === currentId) return base;
  return uniqueSlug(base);
}

export const blogService = {
  async list(query: ListBlogsQuery) {
    const { items, total } = await blogRepository.findMany(query);
    return {
      items,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / query.limit)),
        hasNext: query.page * query.limit < total,
        hasPrev: query.page > 1,
      },
    };
  },

  async getById(id: string) {
    const blog = await blogRepository.findById(id);
    if (!blog) throw AppError.notFound('Blog not found');
    return blog;
  },

  async getBySlug(slug: string, { incrementViews = false } = {}) {
    const blog = await blogRepository.findBySlug(slug);
    if (!blog) throw AppError.notFound('Blog not found');

    if (incrementViews) {
      // Fire-and-forget; a failed counter must not break reading.
      blogRepository.incrementViews(blog.id).catch(() => undefined);
    }

    const [related, prev, next] = await Promise.all([
      blogRepository.findRelated(blog.category, blog.id),
      blog.publishedAt ? blogRepository.findAdjacent(blog.publishedAt, 'prev') : null,
      blog.publishedAt ? blogRepository.findAdjacent(blog.publishedAt, 'next') : null,
    ]);

    return { blog, related, navigation: { prev, next } };
  },

  async create(input: CreateBlogInput) {
    const slug = await resolveSlug(input.slug, input.title);
    const excerpt = input.excerpt?.trim() || deriveExcerpt(input.content);
    const publishedAt = input.status === 'PUBLISHED' ? new Date() : null;

    const data: Prisma.BlogCreateInput = {
      slug,
      title: input.title,
      subtitle: nn(input.subtitle),
      excerpt,
      content: input.content,
      category: input.category as Prisma.BlogCreateInput['category'],
      tags: input.tags,
      author: input.author,
      featuredImage: nn(input.featuredImage),
      galleryImages: input.galleryImages,
      readingTime: estimateReadingTime(input.content),
      featured: input.featured,
      status: input.status,
      seoTitle: nn(input.seoTitle),
      seoDescription: nn(input.seoDescription) ?? excerpt,
      seoKeywords: input.seoKeywords.length ? input.seoKeywords : input.tags,
      ogImage: nn(input.ogImage) ?? nn(input.featuredImage),
      canonicalUrl: nn(input.canonicalUrl),
      publishedAt,
    };
    return blogRepository.create(data);
  },

  async update(id: string, input: UpdateBlogInput) {
    const existing = await blogRepository.findById(id);
    if (!existing) throw AppError.notFound('Blog not found');

    const data: Prisma.BlogUpdateInput = {};

    if (input.title !== undefined) data.title = input.title;
    if (input.subtitle !== undefined) data.subtitle = nn(input.subtitle);
    if (input.content !== undefined) {
      data.content = input.content;
      data.readingTime = estimateReadingTime(input.content);
    }
    if (input.excerpt !== undefined) {
      data.excerpt = input.excerpt.trim() || deriveExcerpt(input.content ?? existing.content);
    }
    if (input.category !== undefined)
      data.category = input.category as Prisma.BlogUpdateInput['category'];
    if (input.tags !== undefined) data.tags = input.tags;
    if (input.author !== undefined) data.author = input.author;
    if (input.featuredImage !== undefined) data.featuredImage = nn(input.featuredImage);
    if (input.galleryImages !== undefined) data.galleryImages = input.galleryImages;
    if (input.featured !== undefined) data.featured = input.featured;
    if (input.seoTitle !== undefined) data.seoTitle = nn(input.seoTitle);
    if (input.seoDescription !== undefined) data.seoDescription = nn(input.seoDescription);
    if (input.seoKeywords !== undefined) data.seoKeywords = input.seoKeywords;
    if (input.ogImage !== undefined) data.ogImage = nn(input.ogImage);
    if (input.canonicalUrl !== undefined) data.canonicalUrl = nn(input.canonicalUrl);

    // Slug: regenerate only when explicitly provided or title changed w/o slug.
    if (input.slug !== undefined) {
      data.slug = await resolveSlug(input.slug, input.title ?? existing.title, id);
    }

    // Publish transition sets publishedAt the first time it goes live.
    if (input.status !== undefined) {
      data.status = input.status;
      if (input.status === 'PUBLISHED' && !existing.publishedAt) {
        data.publishedAt = new Date();
      }
    }

    return blogRepository.update(id, data);
  },

  async remove(id: string) {
    const existing = await blogRepository.findById(id);
    if (!existing) throw AppError.notFound('Blog not found');
    await blogRepository.delete(id);
    return { id };
  },

  async homeFeed() {
    const [featured, latest, trending] = await Promise.all([
      blogRepository.featured(1),
      blogRepository.latest(6),
      blogRepository.trending(4),
    ]);
    return { featured: featured[0] ?? null, latest, trending };
  },
};
