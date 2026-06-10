"use client";

import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { createPost } from "@/store/postSlice";
import { usePostForm } from "@/hooks/usePostForm";
import { useAuthor } from "@/context/AuthorContext";
import MarkdownEditor from "@/components/MarkdownEditor";
import { PostCategory } from "@/types/blog";

const categories: PostCategory[] = [
  "technology",
  "design",
  "business",
  "lifestyle",
  "tutorial",
  "opinion",
  "news",
];

export default function CreatePostPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { currentAuthor } = useAuthor();
  const { values, handleChange, errors, handleSubmit, wordCount, readingTimeMinutes } =
    usePostForm();

  const onSubmit = async (status: string) => {
    handleChange("status", status);
    const result = handleSubmit();
    if (!result) return;

    await dispatch(
      createPost({
        title: result.title,
        excerpt: result.excerpt,
        content: result.content,
        category: result.category,
        tags: result.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        status,
        authorId: currentAuthor?.id || "",
        coverImageUrl: result.coverImageUrl || undefined,
      })
    );

    router.refresh();
    router.push("/dashboard/posts");
  };

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        Create New Post
      </h1>

      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Title
          </label>
          <input
            type="text"
            value={values.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Excerpt
          </label>
          <textarea
            value={values.excerpt}
            onChange={(e) => handleChange("excerpt", e.target.value)}
            rows={2}
            className="w-full rounded-md border px-3 py-2 text-sm bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
          <div className="mt-1 flex justify-between">
            {errors.excerpt && (
              <p className="text-sm text-red-500">{errors.excerpt}</p>
            )}
            <p className="text-sm text-gray-500 dark:text-gray-400 ml-auto">
              {values.excerpt.length}/200
            </p>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Category
          </label>
          <select
            value={values.category}
            onChange={(e) => handleChange("category", e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm capitalize bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat} className="capitalize">
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-500">{errors.category}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            value={values.tags}
            onChange={(e) => handleChange("tags", e.target.value)}
            placeholder="react, nextjs, typescript"
            className="w-full rounded-md border px-3 py-2 text-sm bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Cover Image URL
          </label>
          <input
            type="text"
            value={values.coverImageUrl}
            onChange={(e) => handleChange("coverImageUrl", e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full rounded-md border px-3 py-2 text-sm bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Content
          </label>
          <MarkdownEditor
            value={values.content}
            onChange={(v) => handleChange("content", v)}
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-500">{errors.content}</p>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span>{wordCount} words</span>
          <span>{readingTimeMinutes} min read</span>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => onSubmit("draft")}
            className="rounded-md border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-800"
          >
            Save as Draft
          </button>
          <button
            type="button"
            onClick={() => onSubmit("published")}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Publish Now
          </button>
        </div>
      </div>
    </div>
  );
}
