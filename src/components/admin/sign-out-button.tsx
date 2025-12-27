"use client";

import { signOut } from "@/lib/auth.client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignOutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/admin");
        },
      },
    });
  };

  return (
    <button 
      onClick={handleSignOut} 
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFC700] transition-colors disabled:opacity-50"
    >
      <LogOut size={16} />
      {loading ? "Saindo..." : "Sair"}
    </button>
  );
}