import { Comment } from "@/types/blog";

interface CommentCardProps {
  comment: Comment;
  showModerationActions?: boolean;
  onApprove?: (id: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function CommentCard({
  comment,
  showModerationActions = false,
  onApprove,
  onDelete,
  className = "",
}: CommentCardProps) {
  const borderClass = !comment.approved
    ? "border-l-4 border-l-yellow-400"
    : "border-l-4 border-l-transparent";

  return (
    <div
      className={`rounded-lg border bg-white p-4 dark:bg-gray-800 dark:border-gray-700 ${borderClass} ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-600 dark:bg-gray-600 dark:text-gray-200">
          {getInitials(comment.authorName)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-gray-900 dark:text-white">
              {comment.authorName}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {formatDate(comment.createdAt)}
            </span>
            {!comment.approved && (
              <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                Pending Review
              </span>
            )}
          </div>
          <p className="mt-1 text-gray-700 dark:text-gray-300">
            {comment.content}
          </p>
          {showModerationActions && (
            <div className="mt-3 flex gap-2">
              {!comment.approved && onApprove && (
                <button
                  type="button"
                  onClick={() => onApprove(comment.id)}
                  className="rounded-md bg-green-600 px-3 py-1 text-sm font-medium text-white hover:bg-green-700 transition-colors"
                >
                  Approve
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(comment.id)}
                  className="rounded-md bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
