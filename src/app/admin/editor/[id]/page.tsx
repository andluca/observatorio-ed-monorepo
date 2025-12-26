import { PostEditor } from "@/components/admin/post.editor";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface EditPageProps {
  params: Promise<{ id: string }>; // Next.js 15: params é Promise
}

export default async function EditPostPage({ params }: EditPageProps) {
  const { id } = await params;

  // Busca o post no banco
  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post) {
    notFound(); // Mostra página 404 se o ID não existir
  }

  // Passa os dados iniciais para o Client Component
  return (
    <PostEditor 
      initialData={{
        id: post.id,
        title: post.title,
        content: post.content || "",
        published: post.published
      }} 
    />
  );
}