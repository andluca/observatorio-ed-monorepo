"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteUser } from "@/actions/user-actions";
import { useRouter } from "next/navigation";

export function DeleteUserButton({ userId, userName }: { userId: string, userName: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = window.confirm(`Tem certeza que deseja remover o usuário "${userName}"? Essa ação é irreversível.`);
    
    if (!confirmed) return;

    setIsDeleting(true);
    const result = await deleteUser(userId);
    setIsDeleting(false);

    if (result.error) {
      alert(result.error);
    } else {
      router.refresh();
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md border border-transparent hover:border-red-100 transition-all disabled:opacity-50"
      title="Excluir Usuário"
    >
      {isDeleting ? <Loader2 className="animate-spin w-4 h-4" /> : <Trash2 size={16} />}
    </button>
  );
}