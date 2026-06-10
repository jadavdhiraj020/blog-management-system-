"use client";

import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/store";
import { setPosts, deletePost, editPost } from "@/store/postSlice";
import { Post, PostStatus } from "@/types/blog";
import { useAuthor } from "@/context/AuthorContext";
import PostCard from "./PostCard";
import PostFiltersBar from "./PostFiltersBar";

interface DashboardPostsListProps {
  initialPosts: Post[];
}

export default function DashboardPostsList({
  initialPosts,
}: DashboardPostsListProps) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { currentAuthor } = useAuthor();
  const posts = useSelector((state: RootState) => state.posts.posts);
  const filters = useSelector((state: RootState) => state.posts.filters);

  useEffect(() => {
    dispatch(setPosts(initialPosts));
  }, [dispatch, initialPosts]);

  const filteredPosts = useMemo(() => {
    let result = [...posts];

    // Filter by current author
    if (currentAuthor) {
      result = result.filter((p) => p.authorId === currentAuthor.id);
    }

    if (filters.status !== "all") {
      result = result.filter((p) => p.status === filters.status);
    }
    if (filters.category !== "all") {
      result = result.filter((p) => p.category === filters.category);
    }
    if (filters.search) {
      const lower = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(lower) ||
          p.excerpt.toLowerCase().includes(lower)
      );
    }
    if (filters.tags.length > 0) {
      result = result.filter((p) =>
        filters.tags.some((tag) =>
          p.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
        )
      );
    }

    return result;
  }, [posts, filters, currentAuthor]);

  const handleEdit = (post: Post) => {
    router.push(`/dashboard/posts/${post.id}/edit`);
  };

  const handleDelete = async (id: string) => {
    await dispatch(deletePost(id));
    router.refresh();
  };

  const handleStatusChange = async (id: string, status: PostStatus) => {
    await dispatch(editPost({ id, data: { status } }));
    router.refresh();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          All Posts ({filteredPosts.length})
        </h1>
      </div>

      <PostFiltersBar showStatusFilter className="mb-6" />

      {filteredPosts.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 py-12">
          No posts match your filters.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              variant="dashboard"
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}
