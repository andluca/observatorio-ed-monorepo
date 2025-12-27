"use server";

import { prisma } from "@/lib/prisma";

const ITEMS_PER_PAGE = 6;

/**
 * Busca dados completos para a Homepage:
 * 1. O Post de Destaque (Featured manual OU o mais recente).
 * 2. A primeira página do Grid (Excluindo o destaque).
 */
export async function getHomepageData() {
  // 1. Tenta achar um post marcado como destaque
  let featuredPost = await prisma.post.findFirst({
    where: { 
      published: true, 
      type: "TEXT",
      featured: true 
    },
    include: { author: true },
    orderBy: { createdAt: "desc" },
  });

  // 2. Fallback: Se não tem destaque manual, pega o último post publicado
  if (!featuredPost) {
    featuredPost = await prisma.post.findFirst({
      where: { 
        published: true, 
        type: "TEXT" 
      },
      include: { author: true },
      orderBy: { createdAt: "desc" },
    });
  }

  // Se não tem post nenhum no blog, retorna vazio
  if (!featuredPost) {
    return { featuredPost: null, initialGridPosts: [], hasMore: false };
  }

  // 3. Busca a primeira página do Grid, EXCLUINDO o destaque para não duplicar
  const initialGridPosts = await prisma.post.findMany({
    where: { 
      published: true, 
      type: "TEXT",
      id: { not: featuredPost.id } // <--- O PULO DO GATO
    },
    include: { author: true },
    orderBy: { createdAt: "desc" },
    take: ITEMS_PER_PAGE,
  });

  // 4. Verifica se tem mais para o botão "Carregar Mais"
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

/**
 * Busca páginas seguintes do grid (Client Side chama isso)
 * Precisa receber o excludeId (ID do destaque) para manter a consistência.
 */
export async function getPaginatedTexts(page: number, excludeId?: string) {
  const skip = (page - 1) * ITEMS_PER_PAGE;

  const posts = await prisma.post.findMany({
    where: { 
      published: true, 
      type: "TEXT",
      id: excludeId ? { not: excludeId } : undefined
    },
    include: { author: true },
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