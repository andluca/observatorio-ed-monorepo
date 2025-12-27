import { getHomepageData } from "@/actions/website-actions";
import { TextGrid } from "@/components/website/texts-grid";
import { TextCard } from "@/components/website/cards";

export const revalidate = 60; 

export default async function Homepage() {
  // Chama a action inteligente que já separa o joio do trigo (Destaque vs Grid)
  const { featuredPost, initialGridPosts, hasMore } = await getHomepageData();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Hero Section */}
      <section className="mb-16 text-center py-2">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Observatório da Extrema Direita <br className="hidden md:block"/> Latino-Americana
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Análises acadêmicas e pesquisas sobre os movimentos de extrema direita na América Latina, 
          promovendo o debate crítico e informado sobre os desafios democráticos contemporâneos.
        </p>
      </section>

      {/* Destaque (Se houver) */}
      {featuredPost && (
        <section className="mb-16">
          {/* Usa o TextCard com a prop featured={true} para ativar o layout Horizontal Hero */}
          <TextCard post={featuredPost} featured={true} />
        </section>
      )}

      {/* Grid de Textos */}
      <section>
        <div className="mb-8 border-l-4 border-[#FFC700] pl-4 flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Últimas Atualizações</h2>
            <p className="text-gray-600 text-sm">Notas, informes e análises de conjuntura.</p>
          </div>
        </div>
        
        {/* Renderiza o Grid se houver posts (excluindo o destaque) */}
        {initialGridPosts.length > 0 || (featuredPost && initialGridPosts.length === 0) ? (
          <TextGrid 
            initialPosts={initialGridPosts} 
            initialHasMore={hasMore} 
            excludeId={featuredPost?.id} // Passa o ID do destaque para a paginação ignorar
          />
        ) : (
          // Só mostra vazio se não tiver NEM destaque NEM grid
          !featuredPost && (
            <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-500">Nenhum texto publicado ainda.</p>
            </div>
          )
        )}
      </section>
    </main>
  );
}