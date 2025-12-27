"use client";

import { useState } from "react";
import { signIn } from "@/lib/auth.client";
import { Lock, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    await signIn.email({
      email,
      password,
      callbackURL: "/admin/dashboard",
      fetchOptions: {
        onSuccess: () => {
          router.push("/admin/dashboard");
        },
        onError: (ctx) => {
          setLoading(false);
          setError(ctx.error.message || "Credenciais inválidas");
        },
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-black">
      <div className="max-w-md w-full bg-white p-10 border border-gray-200 shadow-sm">
        <div className="flex justify-center mb-8">
          <div className="bg-[#FFC700] p-4 text-black font-bold text-center">
            OBSERVATÓRIO DA<br />EXTREMA DIREITA
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-2">Acesso Restrito</h2>
        <p className="text-gray-500 text-center text-sm mb-8">Pesquisadores Cemarx</p>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold uppercase mb-2">E-mail</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#FFC700]" 
              placeholder="seu@email.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase mb-2">Senha</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#FFC700]" 
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white p-4 font-bold uppercase tracking-widest hover:bg-gray-900 transition-colors flex justify-center items-center gap-2 disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin" /> : <><Lock size={18} /> Entrar</>}
          </button>
        </form>
      </div>
    </div>
  );
}