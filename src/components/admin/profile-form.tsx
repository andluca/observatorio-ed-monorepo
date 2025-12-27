"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@prisma/client";
import { updateProfile, changePassword } from "@/actions/profile-actions";
import { uploadImage } from "@/actions/upload-action";
import { Loader2, Save, Upload, User as UserIcon, Lock, CheckCircle2, AlertCircle } from "lucide-react";

interface ProfileFormProps {
  user: Partial<User>;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();
  
  // --- Estados do Perfil ---
  const [name, setName] = useState(user.name || "");
  const [title, setTitle] = useState(user.professionalTitle || "");
  const [bio, setBio] = useState(user.bio || "");
  const [image, setImage] = useState(user.image || "");
  
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // --- Estados da Senha ---
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // --- Handlers de Perfil ---
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", e.target.files[0]);
      
      const res = await uploadImage(formData);
      setIsUploading(false);

      if (res.url) setImage(res.url);
      else alert("Erro no upload da imagem");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await updateProfile({
      name,
      professionalTitle: title,
      bio,
      image
    });

    setIsLoading(false);

    if (result.error) {
      alert(result.error);
    } else {
      alert("Perfil atualizado com sucesso!");
      router.refresh();
    }
  };

  // --- Handler de Senha ---
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);
    
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: "As novas senhas não coincidem." });
      return;
    }

    if (newPassword.length < 8) {
      setPasswordMsg({ type: 'error', text: "A nova senha deve ter no mínimo 8 caracteres." });
      return;
    }

    setIsSavingPassword(true);
    const result = await changePassword({ currentPassword, newPassword, confirmPassword });
    setIsSavingPassword(false);

    if (result.error) {
      setPasswordMsg({ type: 'error', text: result.error as string });
    } else {
      setPasswordMsg({ type: 'success', text: "Senha alterada com sucesso!" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="space-y-12">
      {/* --- SEÇÃO 1: DADOS DO PERFIL --- */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Avatar Section */}
        <div className="flex items-center gap-6">
          <div className="relative group shrink-0">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-50 flex items-center justify-center">
              {image ? (
                <img src={image} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                   <UserIcon className="w-10 h-10 text-gray-400" />
                </div>
              )}
            </div>
            <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity font-xs font-medium">
              {isUploading ? <Loader2 className="animate-spin w-5 h-5"/> : <Upload className="w-5 h-5"/>}
              <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={isUploading}/>
            </label>
          </div>
          
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-700">Foto de Perfil</h3>
            <p className="text-xs text-gray-500 mt-1">Recomendado: 400x400px. JPG ou PNG.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nome de Exibição */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Nome de Exibição</label>
            <input 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 text-gray-900 rounded-md focus:ring-2 focus:ring-[#FFC700] outline-none"
              placeholder="Como seu nome aparecerá nos posts"
            />
          </div>

          {/* Título Profissional */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Título / Cargo</label>
            <input 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 text-gray-900 rounded-md focus:ring-2 focus:ring-[#FFC700] outline-none"
              placeholder="Ex: Dr. em Ciência Política, Pesquisador..."
            />
          </div>
        </div>

        {/* Biografia */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Minibiografia</label>
          <textarea 
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="w-full p-2 border text-gray-900 border-gray-300 rounded-md focus:ring-2 focus:ring-[#FFC700] outline-none resize-none"
            placeholder="Um resumo curto sobre sua carreira acadêmica e interesses de pesquisa..."
          />
          <p className="text-xs text-gray-500 text-right">{bio.length}/500 caracteres</p>
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button 
            type="submit" 
            disabled={isLoading}
            className="bg-[#FFC700] hover:bg-yellow-400 text-black font-bold py-2 px-6 rounded-md flex items-center gap-2 disabled:opacity-50 transition-colors"
          >
            {isLoading ? <Loader2 className="animate-spin w-4 h-4"/> : <Save className="w-4 h-4"/>}
            Salvar Alterações
          </button>
        </div>
      </form>

      {/* --- SEÇÃO 2: ALTERAR SENHA (NOVO) --- */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mt-10">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-200 pb-3">
          <Lock className="w-5 h-5 text-gray-500" /> Segurança da Conta
        </h3>
        
        <form onSubmit={handlePasswordSubmit} className="space-y-5 max-w-lg">
          
          {/* Mensagens de Erro/Sucesso */}
          {passwordMsg && (
            <div className={`p-3 rounded-md flex items-center gap-2 text-sm ${passwordMsg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {passwordMsg.type === 'success' ? <CheckCircle2 size={16}/> : <AlertCircle size={16}/>}
              {passwordMsg.text}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha Atual</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 text-gray-900 rounded-md focus:ring-2 focus:ring-[#FFC700] outline-none bg-white"
              placeholder="Digite sua senha atual para confirmar"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nova Senha</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 text-gray-900 rounded-md focus:ring-2 focus:ring-[#FFC700] outline-none bg-white"
                placeholder="Mínimo 8 caracteres"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Nova Senha</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 text-gray-900 rounded-md focus:ring-2 focus:ring-[#FFC700] outline-none bg-white"
                placeholder="Repita a nova senha"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-start">
            <button
              type="submit"
              disabled={isSavingPassword}
              className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50"
            >
              {isSavingPassword ? <Loader2 className="animate-spin w-4 h-4" /> : "Atualizar Senha"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}