import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  
  // 1. Busca a sessão
  const session = await auth.api.getSession({
    headers: headersList,
  });
  // ---------------------------------------------------------

  // 2. Verificação ajustada
  if (!session) {
    // Adicionei um return null aqui para evitar renderização flash antes do redirect
    redirect("/admin");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}