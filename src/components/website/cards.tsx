import Link from "next/link";
import { Calendar, User, Clock, FileText } from "lucide-react";
import { Post } from "@prisma/client";

interface CardProps {
  post: Post & { author: { name: string | null } };
  featured?: boolean;
}

// --- 1. ARTICLE CARD (FIDEDIGNO AO PROTÓTIPO) ---
// Este componente gerencia tanto o layout de DESTAQUE (Horizontal) quanto o de LISTAGEM (Vertical)
// exatamente como no seu código original do ArticleCard.
export function ArticleCard({ post, featured = false }: CardProps) {
  
  // Formatações de dados
  const publishDate = new Date(post.createdAt).toLocaleDateString('pt-BR');
  const readTime = `${post.readTime || 5} min de leitura`;
  const authorName = post.author.name || "Equipe OEDLA";
  const excerpt = post.excerpt || post.content.replace(/<[^>]+>/g, '').substring(0, 150) + "...";

  // Componente de Imagem Reutilizável com Fallback
  const CoverImage = ({ className }: { className: string }) => {
    if (post.coverImage) {
      return (
        <img
          src={post.coverImage}
          alt={post.title}
          className={className}
        />
      );
    }
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center text-gray-300`}>
        <FileText size={48} />
      </div>
    );
  };

  // --- LAYOUT DESTAQUE (Horizontal - md:flex) ---
  if (featured) {
    return (
      <article className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 mb-8">
        <div className="md:flex">
          {/* Lado Esquerdo: Imagem */}
          <div className="md:w-1/2">
            <Link href={`/blog/${post.slug}`}>
               <CoverImage className="w-full h-64 md:h-full object-cover" />
            </Link>
          </div>
          
          {/* Lado Direito: Conteúdo */}
          <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
            <div className="mb-4">
              <span className="inline-block bg-[#FFC700] text-black px-3 py-1 text-sm font-medium rounded">
                Destaque
              </span>
            </div>
            
            <Link href={`/blog/${post.slug}`}>
              <h2 className="mb-4 text-2xl md:text-3xl font-bold text-gray-900 hover:text-[#e6b300] transition-colors">
                {post.title}
              </h2>
            </Link>
            
            <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">
              {excerpt}
            </p>
            
            <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
              <div className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>{authorName}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{publishDate}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{readTime}</span>
              </div>
            </div>
            
            <Link
              href={`/blog/${post.slug}`}
              className="inline-block text-center w-fit bg-[#FFC700] text-black px-6 py-2 rounded font-medium hover:bg-yellow-400 transition-colors"
            >
              Leia Mais
            </Link>
          </div>
        </div>
      </article>
    );
  }

  // --- LAYOUT PADRÃO (Vertical) ---
  return (
    <article className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow h-full flex flex-col">
      <Link href={`/blog/${post.slug}`} className="block h-48 overflow-hidden">
        <CoverImage className="w-full h-48 object-cover transition-transform duration-500 hover:scale-105" />
      </Link>
      
      <div className="p-6 flex flex-col flex-grow">
        <Link href={`/blog/${post.slug}`}>
          <h3 className="mb-3 text-xl font-bold text-gray-900 hover:text-[#FFC700] transition-colors cursor-pointer line-clamp-2">
            {post.title}
          </h3>
        </Link>
        
        <p className="text-gray-600 mb-4 leading-relaxed text-sm line-clamp-3 flex-grow">
          {excerpt}
        </p>
        
        <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
          <div className="flex items-center space-x-1">
            <User className="w-4 h-4" />
            <span className="truncate max-w-[100px]">{authorName}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{publishDate}</span>
          </div>
        </div>
        
        <Link
          href={`/blog/${post.slug}`}
          className="text-[#FFC700] font-medium hover:underline mt-auto inline-block"
        >
          Leia Mais →
        </Link>
      </div>
    </article>
  );
}


// --- 2. TEXT CARD (OPCIONAL/ESPECÍFICO) ---
// Este é o card visual para a seção de "Textos" (Notícias) que você pediu para diferenciar.
// Se quiser usar o ArticleCard para tudo, basta ignorar este componente.
export function TextCard({ post }: CardProps) {
  return (
    <ArticleCard post={post} featured={false} />
  );
}