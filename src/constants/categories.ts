import type { Category } from '@prisma/client';

/** Human-friendly labels for the Category enum. */
export const CATEGORY_LABELS: Record<Category, string> = {
  TECHNOLOGY: 'Technology',
  PROGRAMMING: 'Programming',
  ARTIFICIAL_INTELLIGENCE: 'Artificial Intelligence',
  MACHINE_LEARNING: 'Machine Learning',
  TRAVEL: 'Travel',
  FOOD: 'Food',
  BUSINESS: 'Business',
  FINANCE: 'Finance',
  TUTORIALS: 'Tutorials',
  LIFESTYLE: 'Lifestyle',
  PERSONAL: 'Personal',
  OPEN_SOURCE: 'Open Source',
  OTHERS: 'Others',
};

export const CATEGORY_VALUES = Object.keys(CATEGORY_LABELS) as Category[];
