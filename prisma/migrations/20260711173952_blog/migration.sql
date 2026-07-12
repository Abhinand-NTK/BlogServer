-- CreateEnum
CREATE TYPE "BlogStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('TECHNOLOGY', 'PROGRAMMING', 'ARTIFICIAL_INTELLIGENCE', 'MACHINE_LEARNING', 'TRAVEL', 'FOOD', 'BUSINESS', 'FINANCE', 'TUTORIALS', 'LIFESTYLE', 'PERSONAL', 'OPEN_SOURCE', 'OTHERS');

-- CreateTable
CREATE TABLE "Blog" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" "Category" NOT NULL DEFAULT 'OTHERS',
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "author" TEXT NOT NULL DEFAULT 'Editorial Team',
    "featuredImage" TEXT,
    "galleryImages" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "readingTime" INTEGER NOT NULL DEFAULT 1,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "status" "BlogStatus" NOT NULL DEFAULT 'DRAFT',
    "views" INTEGER NOT NULL DEFAULT 0,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "seoKeywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "ogImage" TEXT,
    "canonicalUrl" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Blog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Blog_slug_key" ON "Blog"("slug");

-- CreateIndex
CREATE INDEX "Blog_status_publishedAt_idx" ON "Blog"("status", "publishedAt");

-- CreateIndex
CREATE INDEX "Blog_category_idx" ON "Blog"("category");

-- CreateIndex
CREATE INDEX "Blog_featured_idx" ON "Blog"("featured");

-- CreateIndex
CREATE INDEX "Blog_views_idx" ON "Blog"("views");

-- CreateIndex
CREATE INDEX "Blog_title_idx" ON "Blog"("title");
