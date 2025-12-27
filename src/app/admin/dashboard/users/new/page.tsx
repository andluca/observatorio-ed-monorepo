"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, UserPlus, Save } from "lucide-react";
import { createNewUser } from "@/actions/user-actions";

export default function NewUserPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER" as "USER" | "ADMIN"
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await createNewUser(formData);

    setIsLoading(false);

    if (result.error) {
      alert(result.error);
    } else {
      alert("Usuário criado com sucesso!");
      router.push("/admin/dashboard"); // Ou /admin/users se tiver listagem
    }
  };

  return (
      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center gap-3">
            <div className="bg-yellow-100 p-2 rounded-full">
               <UserPlus className="w-6 h-6 text-[#FFC700]" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-900">Cadastrar Membro</h2>
              <p className="text-sm text-gray-500">Crie um acesso para um novo administrador ou editor.</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8 space-y-6 text-gray-700">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Nome Completo</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FFC700] outline-none"
                placeholder="Ex: João Silva"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Email Corporativo</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FFC700] outline-none"
                placeholder="joao@cemarx.unicamp.br"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Senha Inicial</label>
                <input
                  type="text" // Type text para o admin ver o que está criando
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FFC700] outline-none"
                  placeholder="Mínimo 8 caracteres"
                />
                <p className="text-xs text-gray-500 mt-1">O usuário poderá alterar depois.</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nível de Acesso</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value as "USER" | "ADMIN"})}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FFC700] outline-none bg-white"
                >
                  <option value="USER">Usuário (Editor)</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 bg-[#FFC700] hover:bg-[#e6b300] text-black font-bold px-6 py-3 rounded-md transition-all shadow-sm disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
                Criar Usuário
              </button>
            </div>
          </form>
        </div>
      </main>
  );
}