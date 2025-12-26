export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  coverImage?: string | null;
  type: "ARTICLE" | "TEXT";
  categories: string[];
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
}
