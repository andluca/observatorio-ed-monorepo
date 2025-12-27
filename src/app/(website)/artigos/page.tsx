import { getArticlesPageData } from "@/actions/website-actions"; // Importa Action
import { ArticleCard } from "@/components/website/cards";

export const metadata = {
  title: 'Artigos | OEDLA',
  description: 'Produção científica e artigos acadêmicos do Observatório.',
}

// Revalidação ISR
export const revalidate = 60;

export default async function ArticlesPage() {
  // Busca via Action
  const articles = await getArticlesPageData();

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 w-[90%]">
        
        <header className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Artigos & Produção Científica</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Acesse nossa coleção de pesquisas aprofundadas, teses e dissertações sobre o fenômeno da extrema direita.
          </p>
        </header>

        <div className="space-y-6">
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