import { blogRepository } from '../repositories/blog.repository.js';

export const sitemapService = {
  async build(siteUrl: string) {
    const blogs = await blogRepository.allPublishedSlugs();
    const base = siteUrl.replace(/\/$/, '');

    const staticUrls = ['', '/blog', '/about', '/contact'].map(
      (path) => `  <url><loc>${base}${path}</loc><changefreq>weekly</changefreq></url>`,
    );

    const blogUrls = blogs.map(
      (b) =>
        `  <url><loc>${base}/blog/${b.slug}</loc><lastmod>${b.updatedAt.toISOString()}</lastmod><changefreq>monthly</changefreq></url>`,
    );

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticUrls, ...blogUrls].join('\n')}
</urlset>`;
  },
};
