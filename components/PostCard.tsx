"use client";

import Link from "next/link";
import { Post, PostStatus } from "@/types/blog";
import CategoryBadge from "./CategoryBadge";
import { getAuthorById } from "@/lib/authors";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

interface PostCardProps {
  post: Post;
  variant: "public" | "dashboard";
  onEdit?: (post: Post) => void;
  onDelete?: (id: string) => void;
  onStatusChange?: (id: string, status: PostStatus) => void;
  className?: string;
}

const gradients = [
  "from-blue-400 to-purple-500",
  "from-green-400 to-blue-500",
  "from-pink-400 to-red-500",
  "from-yellow-400 to-orange-500",
  "from-indigo-400 to-cyan-500",
  "from-teal-400 to-emerald-500",
  "from-violet-400 to-fuchsia-500",
];

const statusColors: Record<PostStatus, string> = {
  draft: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  published: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  archived: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
};

function formatDate(dateString?: string): string {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getGradient(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return gradients[Math.abs(hash) % gradients.length];
}

export default function PostCard({
  post,
  variant,
  onEdit,
  onDelete,
  onStatusChange,
  className = "",
}: PostCardProps) {
  const author = getAuthorById(post.authorId);

  return (
    <div
      className={`rounded-lg border bg-white shadow-sm overflow-hidden dark:bg-gray-800 dark:border-gray-700 ${className}`}
    >
      {variant === "public" ? (
        <Link href={`/blog/${post.slug}`} className="block">
          {post.coverImageUrl ? (
            <img
              src={post.coverImageUrl}
              alt={post.title}
              className="h-48 w-full object-cover"
            />
          ) : (
            <div
              className={`h-48 w-full bg-gradient-to-br ${getGradient(post.id)}`}
            />
          )}
        </Link>
      ) : post.coverImageUrl ? (
        <img
          src={post.coverImageUrl}
          alt={post.title}
          className="h-40 w-full object-cover"
        />
      ) : (
        <div
          className={`h-40 w-full bg-gradient-to-br ${getGradient(post.id)}`}
        />
      )}

      <div className="p-4">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <CategoryBadge category={post.category} size="sm" />
          {variant === "dashboard" && (
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusColors[post.status]}`}
            >
              {post.status}
            </span>
          )}
        </div>

        {variant === "public" ? (
          <Link href={`/blog/${post.slug}`}>
            <h3 className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors dark:text-white dark:hover:text-blue-400">
              {post.title}
            </h3>
          </Link>
        ) : (
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {post.title}
          </h3>
        )}

        <p className="mt-1 text-sm text-gray-600 line-clamp-2 dark:text-gray-400">
          {post.excerpt}
        </p>

        <div className="mt-3 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          {author && <span>{author.name}</span>}
          <span>{post.readingTimeMinutes} min read</span>
          {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
          <span>{post.viewCount} views</span>
        </div>

        {variant === "dashboard" && (
          <div className="mt-3 flex items-center gap-2 border-t pt-3 dark:border-gray-700">
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(post)}
                className="rounded-md bg-blue-600 px-3 py-1 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(post.id)}
                className="rounded-md bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            )}
            {onStatusChange && (
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button
                    type="button"
                    className="ml-auto inline-flex items-center gap-1 rounded-md border bg-white px-2.5 py-1 text-sm font-medium capitalize text-gray-700 hover:bg-gray-50 transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
                  >
                    {post.status}
                    <span className="text-xs">▾</span>
                  </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    className="z-50 min-w-[120px] rounded-md border bg-white p-1 shadow-lg dark:bg-gray-800 dark:border-gray-700"
                    sideOffset={4}
                    align="end"
                  >
                    {(["draft", "published", "archived"] as PostStatus[]).map(
                      (s) => (
                        <DropdownMenu.Item
                          key={s}
                          className="cursor-pointer rounded-sm px-2 py-1.5 text-sm capitalize text-gray-700 outline-none hover:bg-blue-50 hover:text-blue-700 data-[highlighted]:bg-blue-50 data-[highlighted]:text-blue-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white dark:data-[highlighted]:bg-gray-700 dark:data-[highlighted]:text-white"
                          onSelect={() =>
                            onStatusChange(post.id, s)
                          }
                        >
                          {s}
                        </DropdownMenu.Item>
                      )
                    )}
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
