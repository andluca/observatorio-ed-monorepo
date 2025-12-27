"use server";

import { prisma } from "@/lib/prisma";

const ITEMS_PER_PAGE = 6;

const AUTHOR_SELECT = {
  select: {
    name: true,
    image: true,
    professionalTitle: true,
  }
};

export async function getHomepageData() {
  let featuredPost = await prisma.post.findFirst({
    where: { 
      published: true, 
      type: "TEXT",
      featured: true 
    },
    include: { author: AUTHOR_SELECT },
    orderBy: { createdAt: "desc" },
  });

  if (!featuredPost) {
    featuredPost = await prisma.post.findFirst({
      where: { 
        published: true, 
        type: "TEXT" 
      },
      include: { author: AUTHOR_SELECT },
      orderBy: { createdAt: "desc" },
    });
  }

  if (!featuredPost) {
    return { featuredPost: null, initialGridPosts: [], hasMore: false };
  }

  const initialGridPosts = await prisma.post.findMany({
    where: { 
      published: true, 
      type: "TEXT",
      id: { not: featuredPost.id }
    },
    include: { author: AUTHOR_SELECT },
    orderBy: { createdAt: "desc" },
    take: ITEMS_PER_PAGE,
  });

  const totalCount = await prisma.post.count({
    where: { 
      published: true, 
      type: "TEXT",
      id: { not: featuredPost.id }
    }
  });

  const hasMore = totalCount > initialGridPosts.length;

  return { featuredPost, initialGridPosts, hasMore };
}

export async function getPaginatedTexts(page: number, excludeId?: string) {
  const skip = (page - 1) * ITEMS_PER_PAGE;

  const posts = await prisma.post.findMany({
    where: { 
      published: true, 
      type: "TEXT",
      id: excludeId ? { not: excludeId } : undefined
    },
    include: { author: AUTHOR_SELECT },
    orderBy: { createdAt: "desc" },
    take: ITEMS_PER_PAGE,
    skip: skip,
  });

  const totalCount = await prisma.post.count({
    where: { 
      published: true, 
      type: "TEXT",
      id: excludeId ? { not: excludeId } : undefined
    }
  });
  
  const hasMore = totalCount > skip + posts.length;

  return { posts, hasMore };
}

export async function getArticlesPageData() {
  return await prisma.post.findMany({
    where: { 
      published: true,
      type: "ARTICLE"
    },
    orderBy: { createdAt: "desc" },
    include: { author: AUTHOR_SELECT }
  });
}

export async function getPostBySlug(slug: string) {
  return await prisma.post.findUnique({
    where: { 
      slug,
      published: true 
    },
    include: { author: AUTHOR_SELECT }
  });
}

export async function getRelatedPosts(currentPostId: string, type: string) {
  return await prisma.post.findMany({
    where: { 
      published: true,
      id: { not: currentPostId },
      type: type 
    },
    take: 3,
    orderBy: { createdAt: "desc" },
    include: { author: AUTHOR_SELECT }
  });
}