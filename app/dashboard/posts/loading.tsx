export default function DashboardPostsLoading() {
  return (
    <div>
      <div className="mb-6 h-8 w-48 rounded animate-shimmer" />
      <div className="mb-6 h-10 w-full rounded animate-shimmer" />
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="rounded-lg border bg-white p-4 dark:bg-gray-800 dark:border-gray-700"
          >
            <div className="mb-2 h-5 w-3/4 rounded animate-shimmer" />
            <div className="mb-2 h-4 w-1/2 rounded animate-shimmer" />
            <div className="flex gap-2">
              <div className="h-6 w-16 rounded-full animate-shimmer" />
              <div className="h-6 w-20 rounded-full animate-shimmer" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
