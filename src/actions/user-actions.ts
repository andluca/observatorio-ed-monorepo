"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { createUserSchema, CreateUserInput } from "@/lib/schemas";
import { revalidatePath } from "next/cache";

async function getAdminSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Acesso não autorizado.");
  }
  return session;
}

export async function createNewUser(data: CreateUserInput) {
  const validation = createUserSchema.safeParse(data);

  if (!validation.success) {
    return { error: "Dados inválidos", fieldErrors: validation.error.flatten().fieldErrors };
  }

  const { name, email, password, role } = validation.data;

  try {
    await getAdminSession();

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { error: "Já existe um usuário com este email." };
    }

    const newUser = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
      asResponse: false 
    });

    if (!newUser?.user) {
      return { error: "Erro ao criar usuário no sistema de autenticação." };
    }

    await prisma.user.update({
      where: { id: newUser.user.id },
      data: { role },
    });

    revalidatePath("/admin/users");
    
    return { success: true };

  } catch (error: any) {
    console.error("Erro ao criar usuário:", error);
    return { error: error.body?.message || error.message || "Erro interno ao criar usuário." };
  }
}

export async function getUsers() {
  await getAdminSession();

  return await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      image: true
    }
  });
}

export async function deleteUser(userId: string) {
  try {
    const session = await getAdminSession();

    if (session.user.id === userId) {
      return { error: "Você não pode excluir sua própria conta." };
    }

    await prisma.user.delete({
      where: { id: userId }
    });

    revalidatePath("/admin/users");
    return { success: true };

  } catch (error: any) {
    console.error("Erro ao deletar usuário:", error);
    return { error: "Erro ao excluir usuário. Verifique se ele possui posts vinculados." };
  }
}