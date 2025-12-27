import { notFound } from "next/navigation";
import { Calendar, User, Clock, Share2 } from "lucide-react";
import { Metadata } from "next";
import { TextCard } from "@/components/website/cards";
import { ShareButtons } from "@/components/website/share-buttons";
import { getPostBySlug, getRelatedPosts } from "@/actions/website-actions";
import { SafeHtml } from "@/components/safe-html";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: 'Post não encontrado' };
  return {
    title: `${post.title} | OEDLA`,
    description: post.excerpt,
    openGraph: { images: post.coverImage ? [post.coverImage] : [] }
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const relatedPosts = await getRelatedPosts(post.id, post.type);

  const publishDate = new Date(post.createdAt).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
  const authorName = post.author.name || "Equipe OEDLA";
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const postUrl = `${baseUrl}/blog/${post.slug}`;

  const TextHeader = () => (
    <div className="relative w-full h-[400px] mb-12 flex items-end">
        <div className="absolute inset-0 z-0">
            {post.coverImage ? (
                <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full bg-gray-900" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 w-full pb-12">
            <span className="inline-block bg-[#FFC700] text-black px-3 py-1 text-xs font-bold uppercase tracking-wider rounded mb-4">
                Notícia / Análise
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-6 drop-shadow-md">
                {post.title}
            </h1>
            <div className="flex items-center gap-6 text-gray-300 text-sm">
                <span className="flex items-center gap-2"><User size={16} className="text-[#FFC700]"/> {authorName}</span>
                <span className="flex items-center gap-2"><Calendar size={16} className="text-[#FFC700]"/> {publishDate}</span>
                <span className="flex items-center gap-2"><Clock size={16} className="text-[#FFC700]"/> {post.readTime || 5} min</span>
            </div>
        </div>
    </div>
  );

  const ArticleHeader = () => (
    <div className="max-w-4xl mx-auto px-4 pt-12 pb-8 border-b border-gray-100 mb-12">
        <div className="mb-6 flex justify-center md:justify-start">
             <span className="inline-block bg-blue-50 text-blue-800 border border-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded">
                Artigo Acadêmico
             </span>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight text-center md:text-left">
            {post.title}
        </h1>
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm text-gray-500">
             <span className="flex items-center gap-2"><User size={16} className="text-blue-600"/> {authorName}</span>
             <span className="flex items-center gap-2"><Calendar size={16} className="text-blue-600"/> {publishDate}</span>
             <span className="flex items-center gap-2"><Clock size={16} className="text-blue-600"/> {post.readTime || 10} min leitura</span>
        </div>
    </div>
  );

  return (
    <main className="bg-white min-h-screen">
      
      {post.type === 'TEXT' ? <TextHeader /> : <ArticleHeader />}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {post.type === 'ARTICLE' && post.coverImage && (
            <div className="mb-12 rounded-xl overflow-hidden shadow-sm border border-gray-100">
                <img src={post.coverImage} alt={post.title} className="w-full h-auto object-cover max-h-[500px]" />
            </div>
        )}

        <article className="prose prose-lg max-w-none text-gray-800 
          prose-headings:text-gray-900 prose-headings:font-bold 
          prose-a:text-[#FFC700] prose-a:no-underline hover:prose-a:underline
          prose-img:rounded-lg prose-img:shadow-md mb-16">
          <SafeHtml html={post.content} />
        </article>

        {/* COMPARTILHAMENTO (Corrigido) */}
        <div className="border-t border-gray-200 pt-8 mb-16">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="font-bold flex items-center gap-2 text-gray-900">
              <Share2 size={20} /> Compartilhar:
            </span>
            <div className="w-full sm:w-auto">
                {/* Componente Client-Side para interação */}
                <ShareButtons url={postUrl} title={post.title} />
            </div>
          </div>
        </div>
      </div>

      {relatedPosts.length > 0 && (
        <section className="bg-gray-50 py-16 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-[90%]">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <span className="w-1.5 h-8 bg-[#FFC700] rounded-full inline-block"></span>
              {post.type === 'ARTICLE' ? 'Artigos Relacionados' : 'Outras Notícias'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {relatedPosts.map(related => (
                 <TextCard key={related.id} post={related} />
               ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}