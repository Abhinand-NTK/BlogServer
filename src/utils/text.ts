/** Convert a title to a URL-safe slug. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Append a short suffix to keep slugs unique. */
export function uniqueSlug(base: string): string {
  const suffix = Math.random().toString(36).slice(2, 7);
  return `${slugify(base) || 'post'}-${suffix}`;
}

/** Estimate reading time in minutes from markdown/plain content. */
export function estimateReadingTime(content: string, wpm = 220): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / wpm));
}

/** Build an excerpt from content when the author left it blank. */
export function deriveExcerpt(content: string, max = 160): string {
  const plain = content
    .replace(/[#>*_`~\-]/g, ' ')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
  return plain.length > max ? `${plain.slice(0, max).trimEnd()}…` : plain;
}
