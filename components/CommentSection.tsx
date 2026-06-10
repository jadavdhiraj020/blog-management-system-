"use client";

import { useState } from "react";
import { Comment } from "@/types/blog";
import CommentCard from "./CommentCard";

interface CommentSectionProps {
  postId: string;
  initialComments: Comment[];
}

export default function CommentSection({
  postId,
  initialComments,
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          authorName: name,
          authorEmail: email,
          content,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit comment");
      }

      setName("");
      setEmail("");
      setContent("");
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        Comments ({comments.length})
      </h2>

      {comments.length > 0 ? (
        <div className="mb-8 space-y-4">
          {comments.map((comment) => (
            <CommentCard key={comment.id} comment={comment} />
          ))}
        </div>
      ) : (
        <p className="mb-8 text-gray-500 dark:text-gray-400">
          No comments yet. Be the first to share your thoughts!
        </p>
      )}

      <div className="rounded-lg border bg-gray-50 p-6 dark:bg-gray-800 dark:border-gray-700">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Leave a Comment
        </h3>

        {success && (
          <div className="mb-4 rounded-md bg-green-50 p-3 text-green-700 dark:bg-green-900/30 dark:text-green-300">
            Your comment is awaiting moderation.
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-red-700 dark:bg-red-900/30 dark:text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="rounded-md border px-3 py-2 text-sm bg-white dark:bg-gray-900 dark:border-gray-600 dark:text-white"
            />
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-md border px-3 py-2 text-sm bg-white dark:bg-gray-900 dark:border-gray-600 dark:text-white"
            />
          </div>
          <textarea
            placeholder="Write your comment..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            required
            className="w-full rounded-md border px-3 py-2 text-sm bg-white dark:bg-gray-900 dark:border-gray-600 dark:text-white"
          />
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {submitting ? "Submitting..." : "Submit Comment"}
          </button>
        </form>
      </div>
    </div>
  );
}
