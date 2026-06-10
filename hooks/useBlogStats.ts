import { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useAuthor } from "@/context/AuthorContext";
import { BlogStats, PostCategory } from "@/types/blog";

const ALL_CATEGORIES: PostCategory[] = [
  "technology",
  "design",
  "business",
  "lifestyle",
  "tutorial",
  "opinion",
  "news",
];

export function useBlogStats(): BlogStats {
  const allPosts = useSelector((state: RootState) => state.posts.posts);
  const allComments = useSelector((state: RootState) => state.comments.comments);
  const { currentAuthor } = useAuthor();

  return useMemo(() => {
    // Filter by current author
    const posts = currentAuthor
      ? allPosts.filter((p) => p.authorId === currentAuthor.id)
      : allPosts;
    const postIds = new Set(posts.map((p) => p.id));
    const comments = allComments.filter((c) => postIds.has(c.postId));

    const publishedPosts = posts.filter((p) => p.status === "published");
    const draftPosts = posts.filter((p) => p.status === "draft");
    const totalViews = publishedPosts.reduce((sum, p) => sum + p.viewCount, 0);
    const topPosts = [...publishedPosts]
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, 5);
    const byCategory = ALL_CATEGORIES.reduce(
      (acc, cat) => {
        acc[cat] = publishedPosts.filter((p) => p.category === cat).length;
        return acc;
      },
      {} as Record<PostCategory, number>
    );

    return {
      totalPosts: posts.length,
      publishedPosts: publishedPosts.length,
      draftPosts: draftPosts.length,
      totalViews,
      totalComments: comments.length,
      topPosts,
      byCategory,
    };
  }, [allPosts, allComments, currentAuthor]);
}
