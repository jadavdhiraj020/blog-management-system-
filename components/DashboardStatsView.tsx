"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { setPosts } from "@/store/postSlice";
import { setComments } from "@/store/commentSlice";
import { useBlogStats } from "@/hooks/useBlogStats";
import CategoryBadge from "@/components/CategoryBadge";
import { Post, Comment, PostCategory } from "@/types/blog";

interface DashboardStatsViewProps {
  initialPosts: Post[];
  initialComments: Comment[];
}

export default function DashboardStatsView({
  initialPosts,
  initialComments,
}: DashboardStatsViewProps) {
  const dispatch = useDispatch<AppDispatch>();
  const stats = useBlogStats();

  useEffect(() => {
    dispatch(setPosts(initialPosts));
    dispatch(setComments(initialComments));
  }, [dispatch, initialPosts, initialComments]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        Dashboard Overview
      </h1>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-white p-4 dark:bg-gray-800 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Posts</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.totalPosts}
          </p>
        </div>
        <div className="rounded-lg border bg-white p-4 dark:bg-gray-800 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Published</p>
          <p className="text-2xl font-bold text-green-600">
            {stats.publishedPosts}
          </p>
        </div>
        <div className="rounded-lg border bg-white p-4 dark:bg-gray-800 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Drafts</p>
          <p className="text-2xl font-bold text-yellow-600">
            {stats.draftPosts}
          </p>
        </div>
        <div className="rounded-lg border bg-white p-4 dark:bg-gray-800 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Views</p>
          <p className="text-2xl font-bold text-blue-600">
            {stats.totalViews}
          </p>
        </div>
      </div>

      <div className="mb-8 rounded-lg border bg-white p-4 dark:bg-gray-800 dark:border-gray-700">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
          Total Comments: {stats.totalComments}
        </h2>
      </div>

      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Posts by Category
        </h2>
        <div className="flex flex-wrap gap-3">
          {(Object.entries(stats.byCategory) as [PostCategory, number][]).map(
            ([cat, count]) => (
              <div
                key={cat}
                className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
              >
                <CategoryBadge category={cat} size="sm" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {count}
                </span>
              </div>
            )
          )}
        </div>
      </div>

      {stats.topPosts.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Top Posts by Views
          </h2>
          <div className="space-y-2">
            {stats.topPosts.map((post, i) => (
              <div
                key={post.id}
                className="flex items-center justify-between rounded-lg border bg-white px-4 py-3 dark:bg-gray-800 dark:border-gray-700"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-400">#{i + 1}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {post.title}
                  </span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {post.viewCount} views
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
