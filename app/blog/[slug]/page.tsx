import { getAuthorById } from "@/lib/authors";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CategoryBadge from "@/components/CategoryBadge";
import CommentSection from "@/components/CommentSection";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

function formatDate(dateString?: string): string {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

import { getPostBySlug, updatePost, getComments } from "@/lib/data";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await getPostBySlug(slug);

  if (!post || post.status !== "published") {
    notFound();
  }

  // Increment view count
  await updatePost(post.id, { viewCount: post.viewCount + 1 });

  const comments = (await getComments()).filter(
    (c) => c.postId === post.id && c.approved === true
  );

  const author = getAuthorById(post.authorId);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {post.coverImageUrl ? (
        <img
          src={post.coverImageUrl}
          alt={post.title}
          className="mb-6 h-64 w-full rounded-lg object-cover"
        />
      ) : (
        <div className="mb-6 h-64 w-full rounded-lg bg-gradient-to-br from-blue-400 to-purple-500" />
      )}

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <CategoryBadge category={post.category} />
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400"
          >
            #{tag}
          </span>
        ))}
      </div>

      <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
        {post.title}
      </h1>

      <div className="mb-8 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
        {author && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
              {author.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {author.name}
            </span>
          </div>
        )}
        {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
        <span>{post.readingTimeMinutes} min read</span>
        <span>{post.viewCount} views</span>
      </div>

      <article className="prose prose-lg dark:prose-invert mb-12">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </article>

      <hr className="mb-8 dark:border-gray-700" />

      <CommentSection postId={post.id} initialComments={comments} />
    </div>
  );
}
