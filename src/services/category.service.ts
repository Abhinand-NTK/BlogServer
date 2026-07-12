import { CATEGORY_LABELS, CATEGORY_VALUES } from '../constants/categories.js';
import { blogRepository } from '../repositories/blog.repository.js';

export const categoryService = {
  async listWithCounts() {
    const counts = await blogRepository.categoryCounts();
    const countMap = new Map(counts.map((c) => [c.category, c._count.category]));

    return CATEGORY_VALUES.map((value) => ({
      value,
      label: CATEGORY_LABELS[value],
      count: countMap.get(value) ?? 0,
    }));
  },
};
