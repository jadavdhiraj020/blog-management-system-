import { Post, Comment } from "@/types/blog";
import DashboardStatsView from "@/components/DashboardStatsView";
import { getPosts, getComments } from "@/lib/data";

export default async function DashboardHomePage() {
  const posts = getPosts().sort((a, b) => {
    const dateA = a.publishedAt || a.createdAt;
    const dateB = b.publishedAt || b.createdAt;
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });
  const comments = getComments();

  return <DashboardStatsView initialPosts={posts} initialComments={comments} />;
}
