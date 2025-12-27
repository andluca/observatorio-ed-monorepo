import Link from "next/link";
import { getUsers } from "@/actions/user-actions";
import { DeleteUserButton } from "@/components/admin/delete-user-button";
import { UserPlus, Shield, User as UserIcon, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Gerenciar Usuários | Admin",
};

export default async function UsersPage() {
  const users = await getUsers();

  return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="flex justify-end mb-6">
          <Link
            href="/admin/dashboard/users/new"
            className="inline-flex items-center gap-2 bg-[#FFC700] hover:bg-[#e6b300] text-black font-medium px-4 py-2 rounded-md transition-colors shadow-sm"
          >
            <UserPlus size={18} />
            <span>Novo Usuário</span>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 font-medium text-gray-500">Usuário</th>
                  <th className="px-6 py-3 font-medium text-gray-500">Email</th>
                  <th className="px-6 py-3 font-medium text-gray-500">Permissão</th>
                  <th className="px-6 py-3 font-medium text-gray-500">Data de Criação</th>
                  <th className="px-6 py-3 font-medium text-gray-500 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    
                    {/* Usuário (Avatar + Nome) */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                          {user.image ? (
                            <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                            <UserIcon size={16} className="text-gray-500" />
                          )}
                        </div>
                        <span className="font-medium text-gray-900">{user.name}</span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4 text-gray-600">
                      {user.email}
                    </td>

                    {/* Role Badge */}
                    <td className="px-6 py-4">
                      {user.role === "ADMIN" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
                          <Shield size={10} /> ADMIN
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                          Editor
                        </span>
                      )}
                    </td>

                    {/* Data */}
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                      {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                    </td>

                    {/* Ações */}
                    <td className="px-6 py-4 text-right">
                      <DeleteUserButton userId={user.id} userName={user.name} />
                    </td>
                  </tr>
                ))}

                {users.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      Nenhum usuário encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
  );
}