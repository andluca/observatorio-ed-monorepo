"use client";

import Link from "next/link";
import { Calendar, User, ArrowRight, FileText } from "lucide-react";
import { Post } from "@prisma/client";
import { useState } from "react";
import { SafeHtml } from "../safe-html";

interface CardProps {
  post: Post & { author: { name: string | null } };
  featured?: boolean;
}

const PostImage = ({ src, alt, className }: { src: string | null; alt: string; className: string }) => {
  const [hasError, setHasError] = useState(false);

  if (src && src.trim().length > 0 && !hasError) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        onError={() => setHasError(true)}
      />
    );
  }

  return (
    <div className={`${className} bg-gray-100 flex items-center justify-center text-gray-300`}>
      <FileText size={className.includes("h-full") || className.includes("h-64") ? 48 : 24} />
    </div>
  );
};

// --- 1. ARTICLE CARD (Listagem Horizontal Simples) ---
export function ArticleCard({ post }: CardProps) {
  const publishDate = new Date(post.createdAt).toLocaleDateString('pt-BR');
  const authorName = post.author.name || "OEDLA";
  const excerpt = post.excerpt || post.content.replace(/<[^>]+>/g, '').substring(0, 180) + "...";

  return (
    // Reduzi o padding vertical de py-8 para py-6 para "achatá-lo" um pouco
    <article className="w-full group border-b border-gray-100 py-6 last:border-0 hover:bg-gray-50 transition-colors rounded-lg px-4">
      <div className="flex flex-col sm:flex-row gap-6 h-full">

        {/* Miniatura: Largura fixa (w-64), mas altura reduzida (h-36) para aspecto wide */}
        <Link href={`/blog/${post.slug}`} className="shrink-0 w-full sm:w-64 h-48 sm:h-36 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 block shadow-sm group-hover:shadow-md transition-all">
          <PostImage
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Conteúdo: Ocupa todo o espaço restante */}
        <div className="flex flex-col flex-1 justify-center">
          <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
            <span className="font-bold text-[#FFC700] uppercase tracking-wide text-xs">Artigo</span>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span className="flex items-center gap-1"><Calendar size={12} /> {publishDate}</span>
          </div>

          <Link href={`/blog/${post.slug}`}>
            {/* Título com leading-tight para ocupar menos altura */}
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#FFC700] transition-colors leading-tight mb-2">
              {post.title}
            </h3>
          </Link>

          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-3 hidden sm:block">
            {excerpt}
          </p>

          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <User size={14} />
              <span className="font-medium text-gray-700">{authorName}</span>
            </div>

            <Link href={`/blog/${post.slug}`} className="text-[#FFC700] font-bold flex items-center gap-1 hover:underline text-sm group-hover:translate-x-1 transition-transform">
              Ler artigo <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
// --- 2. TEXT CARD (Home) ---
export function TextCard({ post, featured = false }: CardProps) {
  const publishDate = new Date(post.createdAt).toLocaleDateString('pt-BR');
  const authorName = post.author.name || "OEDLA";
  const excerpt = post.excerpt || post.content.replace(/<[^>]+>/g, '').substring(0, 150) + "...";

  // --- LAYOUT DESTAQUE (Hero Horizontal - REDUZIDO) ---
  if (featured) {
    return (
      <article className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 mb-12 hover:shadow-md transition-shadow">
        {/* Altura Fixa menor (h-64 = 256px) para não ficar gigante */}
        <div className="md:flex md:h-64">

          {/* Imagem (Menor proporção: 2/5) */}
          <div className="md:w-2/5 h-48 md:h-full relative">
            <Link href={`/blog/${post.slug}`} className="w-full h-full block">
              <PostImage
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </Link>
          </div>

          {/* Conteúdo (Padding reduzido para p-6) */}
          <div className="md:w-3/5 p-6 flex flex-col justify-center">
            <div className="mb-2">
              <span className="inline-block bg-[#FFC700] text-black px-2 py-0.5 text-[10px] font-bold uppercase rounded tracking-wider">
                Destaque
              </span>
            </div>

            <Link href={`/blog/${post.slug}`}>
              <h2 className="mb-2 text-2xl font-bold text-gray-900 hover:text-[#e6b300] transition-colors leading-tight line-clamp-2">
                {post.title}
              </h2>
            </Link>

            <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">
              {excerpt}
            </p>

            <div className="flex items-center text-xs text-gray-500 gap-4 mt-auto">
              <span className="flex items-center gap-1"><User size={14} /> {authorName}</span>
              <span className="flex items-center gap-1"><Calendar size={14} /> {publishDate}</span>

              <Link href={`/blog/${post.slug}`} className="ml-auto inline-block bg-[#FFC700] text-black px-4 py-1.5 rounded text-xs font-bold hover:bg-yellow-400 transition-colors">
                Ler Mais
              </Link>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // --- LAYOUT PADRÃO (Vertical) ---
  return (
    <Link href={`/blog/${post.slug}`} className="group flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
      <div className="h-48 overflow-hidden bg-gray-100 relative shrink-0">
        <PostImage
          src={post.coverImage}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold text-gray-900 shadow-sm border border-gray-100">
          {publishDate}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#FFC700] transition-colors line-clamp-2 leading-tight">
          {post.title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">
          {excerpt}
        </p>

        <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-auto">
          <div className="flex items-center text-[10px] text-gray-500 gap-2">
            <User size={12} />
            <span className="truncate max-w-[100px]">{authorName}</span>
          </div>
          <span className="text-[#FFC700] text-xs font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Ler mais <ArrowRight size={12} />
          </span>
        </div>
      </div>
    </Link>
  );
}