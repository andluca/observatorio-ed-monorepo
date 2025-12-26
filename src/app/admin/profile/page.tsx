import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "@/components/admin/profile-form";

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/admin");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  if (!user) return <div>Usuário não encontrado</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 h-16 flex items-center px-8 max-w-7xl mx-auto">
        <h1 className="text-xl font-bold text-gray-900">Meu Perfil</h1>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-medium text-gray-900">Informações do Autor</h2>
            <p className="text-sm text-gray-500">
              Esses dados aparecerão publicamente nos artigos que você escrever.
            </p>
          </div>
          
          <div className="p-6">
            <ProfileForm user={user} />
          </div>
        </div>
      </main>
    </div>
  );
}