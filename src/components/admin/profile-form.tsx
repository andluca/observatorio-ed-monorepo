"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@prisma/client";
import { updateProfile } from "@/actions/profile-actions";
import { uploadImage } from "@/actions/upload-action";
import { Loader2, Save, Upload, User as UserIcon } from "lucide-react";

interface ProfileFormProps {
  user: User;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();
  
  const [name, setName] = useState(user.name || "");
  const [title, setTitle] = useState(user.professionalTitle || "");
  const [bio, setBio] = useState(user.bio || "");
  const [image, setImage] = useState(user.image || "");
  
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Avatar Section */}
      <div className="flex items-center gap-6">
        <div className="relative group shrink-0">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-50 flex items-center justify-center">
            {image ? (
              <img src={image} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <UserIcon className="w-10 h-10 text-gray-400" />
            )}
          </div>
          <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity font-xs font-medium">
            {isUploading ? <Loader2 className="animate-spin w-5 h-5"/> : <Upload className="w-5 h-5"/>}
            <input type="file" className="hidden text-gray-700" accept="image/*" onChange={handleAvatarUpload} disabled={isUploading}/>
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
            className="w-full p-2 border border-gray-300 text-gray-700 rounded-md focus:ring-2 focus:ring-[#FFC700] outline-none"
            placeholder="Como seu nome aparecerá nos posts"
          />
        </div>

        {/* Título Profissional */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Título / Cargo</label>
          <input 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 text-gray-700 rounded-md focus:ring-2 focus:ring-[#FFC700] outline-none"
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
          className="w-full p-2 border text-gray-700 border-gray-300 rounded-md focus:ring-2 focus:ring-[#FFC700] outline-none resize-none"
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
  );
}