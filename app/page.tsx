import type { PostCategory } from "@/types/blog";
import PostCard from "@/components/PostCard";
import CategoryBadge from "@/components/CategoryBadge";
import LoginPrompt from "@/components/LoginPrompt";
import Link from "next/link";

import { getPosts } from "@/lib/data";

export const dynamic = "force-dynamic";

const categories: PostCategory[] = [
  "technology",
  "design",
  "business",
  "lifestyle",
  "tutorial",
  "opinion",
  "news",
];

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; error?: string }>;
}) {
  const params = await searchParams;
  const categoryFilter = params.category || "";
  const error = params.error || "";

  let posts = (await getPosts())
    .filter((p) => p.status === "published")
    .sort((a, b) => {
      const dateA = a.publishedAt || a.createdAt;
      const dateB = b.publishedAt || b.createdAt;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });

  if (categoryFilter) {
    posts = posts.filter((p) => p.category === categoryFilter);
  }

  const heroPost = posts[0];
  const gridPosts = posts.slice(1, 10);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {error === "login_required" && (
        <div className="mb-6 space-y-4">
          <div className="rounded-md bg-red-50 p-4 text-red-700 dark:bg-red-900/30 dark:text-red-300">
            Please select an author from the dashboard to continue.
          </div>
          <LoginPrompt />
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Blog</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Discover articles on technology, design, business, and more.
        </p>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        <Link
          href="/"
          className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
            !categoryFilter
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
          }`}
        >
          All
        </Link>
        {categories.map((cat) => (
          <Link key={cat} href={`/?category=${cat}`}>
            <CategoryBadge
              category={cat}
              size="md"
              className={categoryFilter === cat ? "ring-2 ring-blue-500" : ""}
            />
          </Link>
        ))}
      </div>

      {posts.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400 py-12">
          No posts found.
        </p>
      )}

      {heroPost && (
        <div className="mb-8">
          <PostCard post={heroPost} variant="public" className="max-w-3xl" />
        </div>
      )}

      {gridPosts.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {gridPosts.map((post) => (
            <PostCard key={post.id} post={post} variant="public" />
          ))}
        </div>
      )}
    </div>
  );
}
