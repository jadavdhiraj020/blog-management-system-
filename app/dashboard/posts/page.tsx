import DashboardPostsList from "@/components/DashboardPostsList";
import { getPosts } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function DashboardPostsPage() {
  const posts = (await getPosts()).sort((a, b) => {
    const dateA = a.publishedAt || a.createdAt;
    const dateB = b.publishedAt || b.createdAt;
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });

  return <DashboardPostsList initialPosts={posts} />;
}
