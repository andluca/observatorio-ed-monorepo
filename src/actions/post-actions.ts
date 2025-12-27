"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { generateSlug } from "@/lib/utils";
import {
  createPostSchema,
  updatePostSchema,
  CreatePostInput,
  UpdatePostInput,
} from "@/lib/schemas";

async function getAdminSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Acesso não autorizado.");
  }
  return session;
}

export async function getPostForEdit(id: string) {
  await getAdminSession(); // Garante segurança

  const post = await prisma.post.findUnique({
    where: { id },
  });

  return post;
}

export async function createPost(data: CreatePostInput) {
  const validation = createPostSchema.safeParse(data);

  if (!validation.success) {
    return {
      error: "Dados inválidos",
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  const validData = validation.data;

  try {
    const session = await getAdminSession();

    const baseSlug = generateSlug(validData.title);
    const existingSlug = await prisma.post.findUnique({
      where: { slug: baseSlug },
    });
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
        // Novos campos
        excerpt: validData.excerpt,
        featured: validData.featured,
        readTime: validData.readTime,
        tags: validData.tags,
      },
    });

    revalidatePath("/admin/dashboard");
    revalidatePath("/");

    return { success: true, post: newPost };
  } catch (error: any) {
    console.error("Erro ao criar post:", error);
    return { error: error.message || "Erro interno." };
  }
}

export async function updatePost(data: UpdatePostInput) {
  const validation = updatePostSchema.safeParse(data);

  if (!validation.success) {
    return {
      error: "Dados inválidos",
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  const validData = validation.data;

  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) throw new Error("Não autorizado");

    const existingPost = await prisma.post.findUnique({
      where: { id: validData.id },
    });

    if (!existingPost) return { error: "Post não encontrado" };

    const isAdmin = session.user.role === "ADMIN";
    const isOwner = existingPost.authorId === session.user.id;

    if (!isAdmin && !isOwner) {
      return { error: "Você não tem permissão para editar este post." };
    }

    const updatedPost = await prisma.post.update({
      where: { id: validData.id },
      data: {
        title: validData.title,
        content: validData.content,
        coverImage: validData.coverImage,
        categories: validData.categories,
        published: validData.published,
        type: validData.type,
        // Novos campos sendo atualizados
        excerpt: validData.excerpt,
        featured: validData.featured,
        readTime: validData.readTime,
        tags: validData.tags,
      },
    });

    revalidatePath("/admin/dashboard");
    revalidatePath("/");
    revalidatePath(`/blog/${updatedPost.slug}`);

    return { success: true, post: updatedPost };
  } catch (error: any) {
    console.error("Erro ao atualizar post:", error);
    return { error: error.message || "Erro interno." };
  }
}

export async function getDashboardData() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) throw new Error("Não autorizado");

  const whereCondition =
    session.user.role === "ADMIN" ? {} : { authorId: session.user.id };

  const posts = await prisma.post.findMany({
    where: whereCondition,
    orderBy: { createdAt: "desc" },
    include: { author: true },
  });

  const totalPosts = posts.length;
  const publishedPosts = posts.filter((p) => p.published).length;
  const draftPosts = totalPosts - publishedPosts;

  return {
    posts,
    stats: { totalPosts, publishedPosts, draftPosts },
    user: session.user,
  };
}
