"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthor } from "@/context/AuthorContext";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { fetchPosts } from "@/store/postSlice";
import { fetchComments } from "@/store/commentSlice";
import { authors } from "@/lib/authors";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const { currentAuthor, setCurrentAuthor } = useAuthor();

  const posts = useSelector((state: RootState) => state.posts.posts);
  const postsStatus = useSelector((state: RootState) => state.posts.status);
  const comments = useSelector((state: RootState) => state.comments.comments);
  const commentsStatus = useSelector((state: RootState) => state.comments.status);

  useEffect(() => {
    if (postsStatus === "idle") {
      dispatch(fetchPosts());
    }
    if (commentsStatus === "idle") {
      dispatch(fetchComments());
    }
  }, [dispatch, postsStatus, commentsStatus]);

  const pendingCount = useMemo(() => {
    if (!currentAuthor) return 0;
    const authorPostIds = new Set(
      posts.filter((p) => p.authorId === currentAuthor.id).map((p) => p.id)
    );
    return comments.filter((c) => !c.approved && authorPostIds.has(c.postId)).length;
  }, [posts, comments, currentAuthor]);

  const navItems = [
    { href: "/dashboard", label: "Overview" },
    { href: "/dashboard/posts", label: "Posts" },
    { href: "/dashboard/create", label: "Create Post" },
    { href: "/dashboard/comments", label: "Comments" },
  ];

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <aside className="w-64 border-r bg-gray-50 p-4 dark:bg-gray-900 dark:border-gray-800">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Dashboard
          </h2>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                pathname === item.href
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}
            >
              <span>{item.label}</span>
              {item.label === "Comments" && pendingCount > 0 && (
                <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1.5 text-xs text-white">
                  {pendingCount}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between border-b bg-white px-6 py-3 dark:bg-gray-900 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Logged in as:
            </span>
            <select
              value={currentAuthor?.id || ""}
              onChange={(e) => {
                const author = authors.find((a) => a.id === e.target.value);
                setCurrentAuthor(author || null);
                if (!author) {
                  window.location.href = "/";
                } else {
                  window.location.reload();
                }
              }}
              className="rounded-md border px-3 py-1.5 text-sm bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="">Select Author</option>
              {authors.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
          {currentAuthor && (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {currentAuthor.name}
              </span>
              <button
                type="button"
                onClick={() => {
                  setCurrentAuthor(null);
                  window.location.href = "/";
                }}
                className="rounded-md bg-gray-200 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Logout
              </button>
            </div>
          )}
        </header>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
