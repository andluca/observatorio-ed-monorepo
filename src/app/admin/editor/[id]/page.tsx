import { PostEditor } from "@/components/admin/post.editor";
import { notFound } from "next/navigation";
import { getPostForEdit } from "@/actions/post-actions";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPageProps) {
  const { id } = await params;

  // Busca dados completos via Server Action
  const post = await getPostForEdit(id);

  if (!post) {
    notFound();
  }

  // Passa O OBJETO INTEIRO para garantir que nada se perca
  return <PostEditor initialData={post} />;
}