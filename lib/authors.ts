import { Author } from "@/types/blog";

export const authors: Author[] = [
  {
    id: "author-1",
    name: "Sarah Chen",
    email: "sarah@blog.com",
    bio: "Full-stack developer and tech writer. Passionate about React, Next.js, and modern web development.",
    avatarUrl: undefined,
  },
  {
    id: "author-2",
    name: "James Wilson",
    email: "james@blog.com",
    bio: "UI/UX designer turned developer. Writing about design systems and frontend architecture.",
    avatarUrl: undefined,
  },
];

export function getAuthorById(id: string): Author | undefined {
  return authors.find((a) => a.id === id);
}
