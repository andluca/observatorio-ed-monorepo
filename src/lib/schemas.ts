import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(5, "O título deve ter pelo menos 5 caracteres"),
  content: z.string().min(1, "O conteúdo do post não pode estar vazio"),
  published: z.boolean().default(false),
  categories: z.array(z.string()).default([]),
  coverImage: z.string().nullable().optional(),
  slug: z.string().optional(),
  type: z.enum(["ARTICLE", "TEXT"], {
    required_error: "Selecione o tipo de publicação",
  }).default("ARTICLE"),
  excerpt: z.string().optional(),
  featured: z.boolean().default(false),
  readTime: z.coerce.number().min(1).default(5),
  tags: z.array(z.string()).default([]),
});

export const updatePostSchema = createPostSchema.extend({
  id: z.string().min(1, "ID do post é obrigatório"),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;


export const profileSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  bio: z.string().max(500, "A biografia não pode passar de 500 caracteres").optional().or(z.literal("")),
  professionalTitle: z.string().optional().or(z.literal("")),
  image: z.string().url("URL de imagem inválida").optional().or(z.literal("")),
});

export type ProfileInput = z.infer<typeof profileSchema>;

export const uploadSchema = z.instanceof(File, { message: "O arquivo enviado é inválido" })
  .refine((file) => file.size <= 5 * 1024 * 1024, "O arquivo deve ter no máximo 5MB") // Exemplo de limite
  .refine(
    (file) => ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type),
    "Apenas arquivos de imagem (JPG, PNG, WEBP, GIF) são permitidos"
  );