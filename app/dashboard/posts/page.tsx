import { Post } from "@/types/blog";
import DashboardPostsList from "@/components/DashboardPostsList";
import { getPosts } from "@/lib/data";

export default async function DashboardPostsPage() {
  const posts = getPosts().sort((a, b) => {
    const dateA = a.publishedAt || a.createdAt;
    const dateB = b.publishedAt || b.createdAt;
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });

  return <DashboardPostsList initialPosts={posts} />;
}
