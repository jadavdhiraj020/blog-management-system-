"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { setFilters, clearFilters } from "@/store/postSlice";
import { PostCategory, PostStatus } from "@/types/blog";
import * as Select from "@radix-ui/react-select";

interface PostFiltersBarProps {
  showStatusFilter?: boolean;
  className?: string;
}

const categories: PostCategory[] = [
  "technology",
  "design",
  "business",
  "lifestyle",
  "tutorial",
  "opinion",
  "news",
];

const statuses: PostStatus[] = ["draft", "published", "archived"];

export default function PostFiltersBar({
  showStatusFilter = false,
  className = "",
}: PostFiltersBarProps) {
  const dispatch = useDispatch<AppDispatch>();
  const filters = useSelector((state: RootState) => state.posts.filters);

  const activeCount = [
    filters.status !== "all" ? 1 : 0,
    filters.category !== "all" ? 1 : 0,
    filters.search ? 1 : 0,
    filters.tags.length > 0 ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Filters
        </span>
        {activeCount > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
            {activeCount}
          </span>
        )}
      </div>

      <input
        type="text"
        placeholder="Search posts..."
        value={filters.search}
        onChange={(e) => dispatch(setFilters({ search: e.target.value }))}
        className="rounded-md border px-3 py-1.5 text-sm bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
      />

      <Select.Root
        value={filters.category}
        onValueChange={(value) =>
          dispatch(
            setFilters({
              category: value as PostCategory | "all",
            })
          )
        }
      >
        <Select.Trigger className="inline-flex items-center justify-between gap-2 rounded-md border px-3 py-1.5 text-sm capitalize bg-white min-w-[160px] hover:bg-gray-50 transition-colors dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700">
          <Select.Value />
          <Select.Icon className="text-gray-400">▾</Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content
            className="z-50 overflow-hidden rounded-md border bg-white shadow-lg dark:bg-gray-800 dark:border-gray-700"
            position="popper"
            sideOffset={4}
          >
            <Select.Viewport className="p-1">
              <Select.Item
                value="all"
                className="cursor-pointer rounded-sm px-2 py-1.5 text-sm capitalize text-gray-700 outline-none data-[highlighted]:bg-blue-50 data-[highlighted]:text-blue-700 dark:text-gray-300 dark:data-[highlighted]:bg-gray-700 dark:data-[highlighted]:text-white"
              >
                <Select.ItemText>All Categories</Select.ItemText>
              </Select.Item>
              {categories.map((cat) => (
                <Select.Item
                  key={cat}
                  value={cat}
                  className="cursor-pointer rounded-sm px-2 py-1.5 text-sm capitalize text-gray-700 outline-none data-[highlighted]:bg-blue-50 data-[highlighted]:text-blue-700 dark:text-gray-300 dark:data-[highlighted]:bg-gray-700 dark:data-[highlighted]:text-white"
                >
                  <Select.ItemText>{cat}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>

      {showStatusFilter && (
        <select
          value={filters.status}
          onChange={(e) =>
            dispatch(
              setFilters({
                status: e.target.value as PostStatus | "all",
              })
            )
          }
          className="rounded-md border px-3 py-1.5 text-sm capitalize bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        >
          <option value="all">All Statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s} className="capitalize">
              {s}
            </option>
          ))}
        </select>
      )}

      <input
        type="text"
        placeholder="Tags (comma-separated)"
        value={filters.tags.join(", ")}
        onChange={(e) =>
          dispatch(
            setFilters({
              tags: e.target.value
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean),
            })
          )
        }
        className="rounded-md border px-3 py-1.5 text-sm bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
      />

      {activeCount > 0 && (
        <button
          type="button"
          onClick={() => dispatch(clearFilters())}
          className="rounded-md bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          Clear All
        </button>
      )}
    </div>
  );
}
