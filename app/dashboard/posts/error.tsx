"use client";

export default function DashboardPostsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <h2 className="mb-2 text-xl font-bold text-red-600">Something went wrong</h2>
      <p className="mb-4 text-gray-600 dark:text-gray-400">
        {error.message || "Failed to load posts. Please try again."}
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Retry
      </button>
    </div>
  );
}
