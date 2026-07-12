import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma.js';
import type { ListBlogsQuery } from '../validators/blog.validator.js';

/**
 * Data-access layer for blogs. Nothing above this file should touch Prisma
 * directly — this keeps the ORM swappable and business logic testable.
 */
export const blogRepository = {
  buildWhere(query: ListBlogsQuery): Prisma.BlogWhereInput {
    const where: Prisma.BlogWhereInput = {};

    if (query.status !== 'ALL') where.status = query.status;
    if (query.category) where.category = query.category as Prisma.EnumCategoryFilter['equals'];
    if (query.featured !== undefined) where.featured = query.featured;
    if (query.tag) where.tags = { has: query.tag };

    if (query.search) {
      const term = query.search;
      where.OR = [
        { title: { contains: term, mode: 'insensitive' } },
        { subtitle: { contains: term, mode: 'insensitive' } },
        { excerpt: { contains: term, mode: 'insensitive' } },
        { content: { contains: term, mode: 'insensitive' } },
        { slug: { contains: term, mode: 'insensitive' } },
        { tags: { has: term } },
      ];
    }
    return where;
  },

  buildOrderBy(sort: ListBlogsQuery['sort']): Prisma.BlogOrderByWithRelationInput {
    switch (sort) {
      case 'oldest':
        return { publishedAt: 'asc' };
      case 'popular':
        return { views: 'desc' };
      case 'newest':
      default:
        return { publishedAt: 'desc' };
    }
  },

  async findMany(query: ListBlogsQuery) {
    const where = this.buildWhere(query);
    const orderBy = this.buildOrderBy(query.sort);
    const skip = (query.page - 1) * query.limit;

    const [items, total] = await Promise.all([
      prisma.blog.findMany({ where, orderBy, skip, take: query.limit }),
      prisma.blog.count({ where }),
    ]);
    return { items, total };
  },

  findBySlug(slug: string) {
    return prisma.blog.findUnique({ where: { slug } });
  },

  findById(id: string) {
    return prisma.blog.findUnique({ where: { id } });
  },

  slugExists(slug: string) {
    return prisma.blog.findUnique({ where: { slug }, select: { id: true } });
  },

  create(data: Prisma.BlogCreateInput) {
    return prisma.blog.create({ data });
  },

  update(id: string, data: Prisma.BlogUpdateInput) {
    return prisma.blog.update({ where: { id }, data });
  },

  delete(id: string) {
    return prisma.blog.delete({ where: { id } });
  },

  incrementViews(id: string) {
    return prisma.blog.update({ where: { id }, data: { views: { increment: 1 } } });
  },

  /** Related posts: same category, excluding the current one. */
  findRelated(category: string, excludeId: string, take = 3) {
    return prisma.blog.findMany({
      where: {
        status: 'PUBLISHED',
        category: category as Prisma.EnumCategoryFilter['equals'],
        NOT: { id: excludeId },
      },
      orderBy: { publishedAt: 'desc' },
      take,
    });
  },

  findAdjacent(publishedAt: Date, direction: 'prev' | 'next') {
    return prisma.blog.findFirst({
      where: {
        status: 'PUBLISHED',
        publishedAt:
          direction === 'next' ? { gt: publishedAt } : { lt: publishedAt },
      },
      orderBy: { publishedAt: direction === 'next' ? 'asc' : 'desc' },
      select: { slug: true, title: true },
    });
  },

  featured(take = 1) {
    return prisma.blog.findMany({
      where: { status: 'PUBLISHED', featured: true },
      orderBy: { publishedAt: 'desc' },
      take,
    });
  },

  latest(take = 6) {
    return prisma.blog.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      take,
    });
  },

  trending(take = 4) {
    return prisma.blog.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: [{ views: 'desc' }, { publishedAt: 'desc' }],
      take,
    });
  },

  async categoryCounts() {
    return prisma.blog.groupBy({
      by: ['category'],
      where: { status: 'PUBLISHED' },
      _count: { category: true },
    });
  },

  allPublishedSlugs() {
    return prisma.blog.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true, updatedAt: true },
      orderBy: { publishedAt: 'desc' },
    });
  },
};
