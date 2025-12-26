"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { generateSlug } from "@/lib/utils";
import { createPostSchema, updatePostSchema, CreatePostInput, UpdatePostInput } from "@/lib/schemas";

// Helper de Segurança
async function getAdminSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Acesso não autorizado.");
  }
  return session;
}

export async function createPost(data: CreatePostInput) {
  // 1. Validação Zod
  const validation = createPostSchema.safeParse(data);
  
  if (!validation.success) {
    return { 
      error: "Dados inválidos", 
      fieldErrors: validation.error.flatten().fieldErrors 
    };
  }

  const validData = validation.data;

  try {
    const session = await getAdminSession();

    // Lógica de Slug
    const baseSlug = generateSlug(validData.title);
    const existingSlug = await prisma.post.findUnique({ where: { slug: baseSlug } });
    const finalSlug = existingSlug ? `${baseSlug}-${Date.now()}` : baseSlug;

    const newPost = await prisma.post.create({
      data: {
        title: validData.title,
        content: validData.content,
        coverImage: validData.coverImage,
        categories: validData.categories,
        published: validData.published,
        slug: finalSlug,
        authorId: session.user.id,
        type: validData.type,
      },
    });

    revalidatePath("/admin/dashboard");
    revalidatePath("/");
    
    return { success: true, post: newPost };

  } catch (error: any) {
    console.error("Erro ao criar post:", error);
    return { error: error.message || "Erro interno ao criar post." };
  }
}

export async function updatePost(data: UpdatePostInput) {
  // 1. Validação Zod
  const validation = updatePostSchema.safeParse(data);

  if (!validation.success) {
    return { 
      error: "Dados inválidos", 
      fieldErrors: validation.error.flatten().fieldErrors 
    };
  }

  const validData = validation.data;

  try {
    await getAdminSession();

    const updatedPost = await prisma.post.update({
      where: { id: validData.id },
      data: {
        title: validData.title,
        content: validData.content,
        coverImage: validData.coverImage,
        categories: validData.categories,
        published: validData.published,
        type: validData.type,
      },
    });

    revalidatePath("/admin/dashboard");
    revalidatePath("/");
    revalidatePath(`/blog/${updatedPost.slug}`);

    return { success: true, post: updatedPost };

  } catch (error: any) {
    console.error("Erro ao atualizar post:", error);
    return { error: error.message || "Erro interno ao atualizar post." };
  }
}