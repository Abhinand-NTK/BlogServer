import { PrismaClient, type Category } from '@prisma/client';

const prisma = new PrismaClient();

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-');
}
const readingTime = (c: string) => Math.max(1, Math.round(c.split(/\s+/).length / 220));

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=80`;

type Seed = {
  title: string;
  subtitle: string;
  excerpt: string;
  content: string;
  category: Category;
  tags: string[];
  author: string;
  featuredImage: string;
  featured?: boolean;
  views?: number;
};

const posts: Seed[] = [
  {
    title: 'Designing Scalable Frontend Architecture with React 19',
    subtitle: 'Patterns that keep large apps maintainable as teams grow',
    excerpt:
      'A practical tour of the folder structure, data-fetching, and state patterns that keep a React 19 codebase healthy at scale.',
    category: 'PROGRAMMING',
    tags: ['react', 'architecture', 'typescript', 'frontend'],
    author: 'Ada Lovelace',
    featuredImage: img('photo-1633356122544-f134324a6cee'),
    featured: true,
    views: 1284,
    content: `## Why architecture matters

As a React app grows, the cost of a bad structure compounds. This guide covers the patterns we use to keep large codebases healthy.

### 1. Feature-first folders

Group by feature, not by file type. It keeps related code close and deletions clean.

### 2. A single API client

\`\`\`ts
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
});
\`\`\`

### 3. Server state vs UI state

Use React Query for server state and local state for UI. Never mix them.

> The best architecture is the one your team can delete safely.

### 4. Typed everything

Strong TypeScript types at the boundaries prevent whole classes of bugs. Validate at the edges with Zod and trust your types inside.

Happy shipping!`,
  },
  {
    title: 'A Gentle Introduction to Vector Databases',
    subtitle: 'How embeddings power modern semantic search',
    excerpt:
      'Understand embeddings, similarity search, and when a vector database beats your trusty Postgres index.',
    category: 'ARTIFICIAL_INTELLIGENCE',
    tags: ['ai', 'embeddings', 'search', 'databases'],
    author: 'Alan Turing',
    featuredImage: img('photo-1620712943543-bcc4688e7485'),
    views: 986,
    content: `## What is an embedding?

An embedding maps text (or images) into a high-dimensional vector so that similar meanings sit close together.

### Similarity search

Given a query vector, we find nearest neighbours using cosine similarity. Specialised indexes (HNSW, IVF) make this fast at scale.

\`\`\`python
from numpy import dot
from numpy.linalg import norm

def cosine(a, b):
    return dot(a, b) / (norm(a) * norm(b))
\`\`\`

### When do you actually need one?

For a few thousand rows, Postgres + pgvector is plenty. Reach for a dedicated vector DB when you have millions of vectors and strict latency budgets.`,
  },
  {
    title: 'Deploying Full-Stack Apps on Free Tiers in 2026',
    subtitle: 'Render, Netlify, Supabase and Cloudinary, wired together',
    excerpt:
      'A no-nonsense checklist for shipping a production full-stack app without spending a cent.',
    category: 'TUTORIALS',
    tags: ['devops', 'deployment', 'render', 'netlify'],
    author: 'Grace Hopper',
    featuredImage: img('photo-1667372393119-3d4c48d07fc9'),
    views: 1520,
    content: `## The free-tier stack

- **Frontend:** Netlify
- **Backend:** Render
- **Database:** Supabase Postgres
- **Images:** Cloudinary

### Watch out for cold starts

Render free services sleep after inactivity. Add a lightweight health check and a friendly loading state on the client.

### Environment variables

Keep secrets on the server. The client only needs the public Cloudinary name and upload preset.

Ship small, ship often.`,
  },
  {
    title: 'The Art of Writing Readable Code',
    subtitle: 'Naming, structure, and the empathy of good software',
    excerpt:
      'Readable code is a gift to your future self. Here are the habits that make it happen.',
    category: 'PROGRAMMING',
    tags: ['clean-code', 'craft', 'career'],
    author: 'Ada Lovelace',
    featuredImage: img('photo-1461749280684-dccba630e2f6'),
    views: 742,
    content: `## Code is read far more than it is written

Optimise for the reader. Good names beat clever comments every time.

### Small functions

A function should do one thing and be named after that thing.

### Consistent structure

Predictable structure lowers cognitive load. Follow the surrounding conventions even when you disagree.`,
  },
  {
    title: 'Slow Travel: Seeing More by Doing Less',
    subtitle: 'Why one city beats ten in a week',
    excerpt:
      'A love letter to slow travel and the underrated joy of staying put.',
    category: 'TRAVEL',
    tags: ['travel', 'lifestyle', 'mindfulness'],
    author: 'Marco Polo',
    featuredImage: img('photo-1476514525535-07fb3b4ae5f1'),
    views: 421,
    content: `## The case for staying longer

Rushing between landmarks turns a trip into a checklist. Stay a week and a place becomes a story.

### Find your café

Return to the same café three mornings in a row and you stop being a tourist.

Travel slow. Remember more.`,
  },
  {
    title: 'Understanding the JavaScript Event Loop',
    subtitle: 'Microtasks, macrotasks, and why your setTimeout lies',
    excerpt:
      'Demystify the event loop so async bugs stop being mysterious.',
    category: 'PROGRAMMING',
    tags: ['javascript', 'async', 'fundamentals'],
    author: 'Alan Turing',
    featuredImage: img('photo-1579468118864-1b9ea3c0db4a'),
    views: 1105,
    content: `## The loop in one sentence

JavaScript runs your code, then drains microtasks, then takes one macrotask, and repeats.

\`\`\`js
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');
// 1, 4, 3, 2
\`\`\`

### Microtasks first

Promises resolve before timers. That ordering explains most "impossible" async bugs.`,
  },
];

async function main() {
  console.log('🌱 Seeding database…');
  await prisma.blog.deleteMany();

  for (const p of posts) {
    await prisma.blog.create({
      data: {
        slug: slugify(p.title),
        title: p.title,
        subtitle: p.subtitle,
        excerpt: p.excerpt,
        content: p.content,
        category: p.category,
        tags: p.tags,
        author: p.author,
        featuredImage: p.featuredImage,
        ogImage: p.featuredImage,
        readingTime: readingTime(p.content),
        featured: p.featured ?? false,
        status: 'PUBLISHED',
        views: p.views ?? 0,
        seoTitle: p.title,
        seoDescription: p.excerpt,
        seoKeywords: p.tags,
        publishedAt: new Date(),
      },
    });
  }
  console.log(`✅ Seeded ${posts.length} blogs.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
