"use client";

import { useState } from "react";
import { TextCard } from "@/components/website/cards";
import { getPaginatedTexts } from "@/actions/website-actions";
import { Loader2, Plus } from "lucide-react";
import { Prisma } from "@prisma/client";

type PostWithAuthor = Prisma.PostGetPayload<{ include: { author: true } }>

interface TextGridProps {
  initialPosts: PostWithAuthor[];
  initialHasMore: boolean;
  excludeId?: string; // <--- Novo prop obrigatório para a lógica funcionar
}

export function TextGrid({ initialPosts, initialHasMore, excludeId }: TextGridProps) {
  const [posts, setPosts] = useState<PostWithAuthor[]>(initialPosts);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const loadMore = async () => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    try {
      const nextPage = page + 1;
      // Passamos o excludeId para garantir que o destaque não apareça na página 2, 3, etc.
      const { posts: newPosts, hasMore: moreAvailable } = await getPaginatedTexts(nextPage, excludeId);
      
      setPosts((prev) => [...prev, ...newPosts]);
      setHasMore(moreAvailable);
      setPage(nextPage);
    } catch (error) {
      console.error("Erro ao carregar:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {posts.map((post) => (
          <TextCard key={post.id} post={post} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center">
          <button
            onClick={loadMore}
            disabled={isLoading}
            className="group flex items-center gap-2 px-8 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-full hover:border-[#FFC700] hover:text-[#FFC700] transition-all shadow-sm disabled:opacity-50"
          >
            {isLoading ? (
              <><Loader2 className="animate-spin w-4 h-4" /> Carregando...</>
            ) : (
              <><Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" /> Ver mais textos</>
            )}
          </button>
        </div>
      )}
    </div>
  );
}