import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Calendar, User, Clock, Facebook, Twitter, Linkedin, Share2 } from "lucide-react";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post) return { title: 'Post não encontrado' };
  return {
    title: `${post.title} | OEDLA`,
    description: post.excerpt,
    openGraph: { images: post.coverImage ? [post.coverImage] : [] }
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
    include: { author: true }
  });

  if (!post || !post.published) notFound();

  // Formatações
  const publishDate = new Date(post.createdAt).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
  const authorName = post.author.name || "Equipe OEDLA";

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <article className="mb-12">
        {/* Article Header */}
        <header className="mb-10 text-center md:text-left">
          <div className="mb-4">
             <span className="inline-block bg-gray-100 text-gray-600 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded">
               {post.type === 'ARTICLE' ? 'Artigo Acadêmico' : 'Notícia / Análise'}
             </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center justify-center md:justify-start text-sm text-gray-500 mb-8 gap-6 border-b border-gray-100 pb-8">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-[#FFC700]" />
              <span className="font-medium text-gray-900">{authorName}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-[#FFC700]" />
              <span>{publishDate}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-[#FFC700]" />
              <span>{post.readTime || '-'} min leitura</span>
            </div>
          </div>

          {post.coverImage && (
            <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-sm mb-10">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </header>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none text-gray-800 
          prose-headings:text-gray-900 prose-headings:font-bold 
          prose-a:text-[#FFC700] prose-a:no-underline hover:prose-a:underline
          prose-img:rounded-lg prose-img:shadow-md">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        {/* Share Buttons */}
        <div className="border-t border-gray-200 pt-8 mt-12">
          <div className="flex items-center space-x-4">
            <span className="font-medium flex items-center gap-2">
              <Share2 size={18} /> Compartilhar:
            </span>
            <div className="flex space-x-2">
              <button className="p-2 border border-gray-300 rounded hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-colors" title="Facebook">
                <Facebook className="w-4 h-4" />
              </button>
              <button className="p-2 border border-gray-300 rounded hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2] transition-colors" title="Twitter">
                <Twitter className="w-4 h-4" />
              </button>
              <button className="p-2 border border-gray-300 rounded hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] transition-colors" title="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}