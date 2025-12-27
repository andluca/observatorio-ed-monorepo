import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/admin/profile-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getCurrentUser } from "@/actions/profile-actions";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 h-16 flex items-center px-8 max-w-7xl mx-auto">
        <Link
          href="/admin/dashboard"
          className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors mr-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao Dashboard
        </Link>
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