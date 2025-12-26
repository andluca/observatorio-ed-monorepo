import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { Plus, Edit, Trash2, FileText, User, BookOpen, FileTextIcon } from "lucide-react";
import { SignOutButton } from "@/components/admin/sign-out-button";

export default async function DashboardPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: true },
  });

  const totalPosts = posts.length;
  const publishedPosts = posts.filter(p => p.published).length;
  const draftPosts = totalPosts - publishedPosts;

  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-[#FFC700] w-2 h-8 rounded-full"></div>
              <h1 className="text-xl font-semibold text-gray-900">
                Painel de Controle
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-500 hidden sm:block">
                {session?.user?.email}
              </span>

              <Link
                href="/admin/profile"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md transition-colors"
                title="Editar Perfil"
              >
                <User size={18} />
                <span className="hidden sm:inline">Meu Perfil</span>
              </Link>

              <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block"></div>

              <SignOutButton />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Gerenciar Posts</h2>
            <p className="text-gray-600">
              Visualize, edite e publique artigos do observatório
            </p>
          </div>

          <Link
            href="/admin/editor/new"
            className="inline-flex items-center gap-2 bg-[#FFC700] hover:bg-[#e6b300] text-black font-medium px-4 py-2 rounded-md transition-colors shadow-sm"
          >
            <Plus size={18} />
            <span>Criar Novo Post</span>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
          {posts.length === 0 ? (
            <div className="p-12 text-center text-gray-500 flex flex-col items-center">
              <div className="bg-gray-100 p-4 rounded-full mb-4">
                <FileText size={32} className="text-gray-400" />
              </div>
              <p className="text-lg font-medium">Nenhum post encontrado</p>
              <p className="text-sm">Comece criando o seu primeiro artigo.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {/* Coluna 1: Post (Título + Tipo) */}
                    <th className="px-6 py-3 font-medium text-gray-500 w-[40%]">Post</th>
                    {/* Coluna 2: Autor */}
                    <th className="px-6 py-3 font-medium text-gray-500">Autor</th>
                    {/* Coluna 3: Data */}
                    <th className="px-6 py-3 font-medium text-gray-500">Data</th>
                    {/* Coluna 4: Status */}
                    <th className="px-6 py-3 font-medium text-gray-500">Status</th>
                    {/* Coluna 5: Ações */}
                    <th className="px-6 py-3 font-medium text-gray-500 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {posts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50 transition-colors group">

                      {/* COLUNA 1: Título e Badge de Tipo */}
                      <td className="px-6 py-4 font-medium text-gray-900">
                        <div className="flex flex-col gap-1.5">
                          <div className="truncate text-base font-semibold text-gray-900" title={post.title}>
                            {post.title}
                          </div>
                          {/* Badge de Tipo */}
                          <div className="flex items-center">
                            {post.type === 'ARTICLE' ? (
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                <BookOpen size={12} />
                                Artigo Acadêmico
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
                                <FileTextIcon size={12} />
                                Texto / Notícia
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* COLUNA 2: Autor */}
                      <td className="px-6 py-4 text-gray-600">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                            {post.author.name ? post.author.name[0] : "A"}
                          </div>
                          <span>{post.author.name || "Admin"}</span>
                        </div>
                      </td>

                      {/* COLUNA 3: Data */}
                      <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                        {new Date(post.createdAt).toLocaleDateString('pt-BR')}
                      </td>

                      {/* COLUNA 4: Status */}
                      <td className="px-6 py-4">
                        {post.published ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                            Publicado
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                            Rascunho
                          </span>
                        )}
                      </td>

                      {/* COLUNA 5: Ações */}
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/admin/editor/${post.id}`}
                            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md border border-transparent hover:border-gray-200 transition-all"
                            title="Editar"
                          >
                            <Edit size={16} />
                          </Link>
                          <button
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md border border-transparent hover:border-red-100 transition-all"
                            title="Excluir"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total de Posts</h3>
            <p className="text-3xl font-bold text-gray-900">{totalPosts}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Posts Publicados</h3>
            <p className="text-3xl font-bold text-gray-900">{publishedPosts}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Rascunhos</h3>
            <p className="text-3xl font-bold text-gray-900">{draftPosts}</p>
          </div>
        </div>

      </main>
    </div>
  );
}