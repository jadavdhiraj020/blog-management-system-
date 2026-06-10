"use client";

import { useAuthor } from "@/context/AuthorContext";
import { authors } from "@/lib/authors";

export default function LoginPrompt() {
  const { setCurrentAuthor } = useAuthor();

  const handleLogin = (authorId: string) => {
    const author = authors.find((a) => a.id === authorId);
    if (author) {
      setCurrentAuthor(author);
      window.location.href = "/dashboard";
    }
  };

  return (
    <div className="mb-6 rounded-lg border border-yellow-300 bg-yellow-50 p-5 dark:bg-yellow-900/20 dark:border-yellow-700">
      <p className="mb-3 font-medium text-yellow-800 dark:text-yellow-200">
        Please select an author to access the dashboard:
      </p>
      <div className="flex items-center gap-3">
        <select
          defaultValue=""
          onChange={(e) => handleLogin(e.target.value)}
          className="rounded-md border px-3 py-2 text-sm bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        >
          <option value="" disabled>
            Choose an author...
          </option>
          {authors.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
        <span className="text-sm text-yellow-700 dark:text-yellow-300">
          Then you&apos;ll be redirected to the dashboard.
        </span>
      </div>
    </div>
  );
}
