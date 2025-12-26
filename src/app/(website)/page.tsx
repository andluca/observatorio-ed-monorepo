import { prisma } from "@/lib/prisma";
import { ArticleCard } from "@/components/website/cards";

export const revalidate = 60; // Revalida a cada 60s

export default async function Homepage() {
  // 1. Buscar o post MAIS RECENTE de "TEXT" para ser o Destaque
  const featuredPost = await prisma.post.findFirst({
    where: { published: true, type: "TEXT" },
    orderBy: { createdAt: "desc" },
    include: { author: true }
  });

  // 2. Buscar os OUTROS posts recentes (excluindo o destaque)
  const recentPosts = await prisma.post.findMany({
    where: { 
      published: true, 
      type: "TEXT",
      id: { not: featuredPost?.id } // Exclui o que já está em destaque para não repetir
    },
    orderBy: { createdAt: "desc" },
    take: 6,
    include: { author: true }
  });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Hero Section (Texto Centralizado) */}
      <section className="mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Observatório da Extrema Direita <br className="hidden md:block"/> Latino-Americana
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Análises acadêmicas e pesquisas sobre os movimentos de extrema direita na América Latina, 
          promovendo o debate crítico e informado sobre os desafios democráticos contemporâneos.
        </p>
      </section>

      {/* Featured Article Section (Usa o ArticleCard com featured=true) */}
      {featuredPost && (
        <section className="mb-16">
          <ArticleCard post={featuredPost} featured={true} />
        </section>
      )}

      {/* Recent Articles Grid (Usa o ArticleCard padrão) */}
      <section>
        <div className="mb-8 border-l-4 border-[#FFC700] pl-4">
          <h2 className="text-2xl font-bold text-gray-900">Últimas Atualizações</h2>
          <p className="text-gray-600">
            Explore nossas análises mais recentes sobre os desenvolvimentos políticos na região.
          </p>
        </div>
        
        {recentPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentPosts.map((post) => (
              <ArticleCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          !featuredPost && (
            <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-500">Nenhum conteúdo publicado ainda.</p>
            </div>
          )
        )}
      </section>
    </main>
  );
}