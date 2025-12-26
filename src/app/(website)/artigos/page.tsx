import { prisma } from "@/lib/prisma";
import { ArticleCard } from "@/components/website/cards";
import { BookOpen } from "lucide-react";

export const metadata = {
  title: 'Artigos | OEDLA',
  description: 'Produção científica e artigos acadêmicos do Observatório.',
}

export default async function ArticlesPage() {
  const articles = await prisma.post.findMany({
    where: { 
      published: true,
      type: "ARTICLE" // Filtro apenas para Artigos
    },
    orderBy: { createdAt: "desc" },
    include: { author: true }
  });

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        
        <header className="mb-12 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-white rounded-full shadow-sm mb-4">
            <BookOpen size={32} className="text-[#FFC700]" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Artigos & Produção Científica</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Acesse nossa coleção de pesquisas aprofundadas, teses e dissertações sobre o fenômeno da extrema direita.
          </p>
        </header>

        <div className="space-y-4">
          {articles.length > 0 ? (
            articles.map(post => (
              <ArticleCard key={post.id} post={post} />
            ))
          ) : (
            <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-500">Nenhum artigo acadêmico publicado no momento.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}