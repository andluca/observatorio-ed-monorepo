"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { profileSchema, ProfileInput } from "@/lib/schemas";

export async function updateProfile(data: ProfileInput) {
  const validation = profileSchema.safeParse(data);

  if (!validation.success) {
    return { 
      error: "Dados do perfil inválidos", 
      fieldErrors: validation.error.flatten().fieldErrors 
    };
  }

  const validData = validation.data;

  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session) {
      return { error: "Você precisa estar logado." };
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: validData.name,
        bio: validData.bio,
        professionalTitle: validData.professionalTitle,
        image: validData.image || null
      }
    });

    revalidatePath("/admin/profile");
    revalidatePath("/admin/dashboard");
    revalidatePath("/");
    
    return { success: true };

  } catch (error: any) {
    console.error("Erro ao atualizar perfil:", error);
    return { error: "Erro interno ao salvar perfil." };
  }
}

export async function getCurrentUser() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return null;
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });
    return user;
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return null;
  }
}