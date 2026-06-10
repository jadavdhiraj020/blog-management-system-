"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { fetchComments } from "@/store/commentSlice";
import { useCommentModeration } from "@/hooks/useCommentModeration";
import CommentCard from "@/components/CommentCard";

export default function CommentsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    pendingComments,
    approvedComments,
    approveComment,
    rejectComment,
    pendingCount,
  } = useCommentModeration();
  const [tab, setTab] = useState<"pending" | "approved">("pending");

  useEffect(() => {
    dispatch(fetchComments());
  }, [dispatch]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        Comment Moderation
      </h1>

      <div className="mb-6 flex gap-2">
        <button
          type="button"
          onClick={() => setTab("pending")}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            tab === "pending"
              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
          }`}
        >
          Pending ({pendingCount})
        </button>
        <button
          type="button"
          onClick={() => setTab("approved")}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            tab === "approved"
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
          }`}
        >
          Approved ({approvedComments.length})
        </button>
      </div>

      {tab === "pending" && (
        <div className="space-y-4">
          {pendingComments.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 py-8 text-center">
              No pending comments.
            </p>
          ) : (
            pendingComments.map((comment) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                showModerationActions
                onApprove={approveComment}
                onDelete={rejectComment}
              />
            ))
          )}
        </div>
      )}

      {tab === "approved" && (
        <div className="space-y-4">
          {approvedComments.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 py-8 text-center">
              No approved comments.
            </p>
          ) : (
            approvedComments.map((comment) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                showModerationActions
                onDelete={rejectComment}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
