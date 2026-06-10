import { PostCategory } from "@/types/blog";

interface CategoryBadgeProps {
  category: PostCategory;
  size?: "sm" | "md" | "lg";
  clickable?: boolean;
  onClick?: (category: PostCategory) => void;
  className?: string;
}

const categoryColors: Record<PostCategory, string> = {
  technology: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  design: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  business: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  lifestyle: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
  tutorial: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  opinion: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  news: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

const sizeClasses = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-sm",
  lg: "px-3 py-1.5 text-base",
};

export default function CategoryBadge({
  category,
  size = "md",
  clickable = false,
  onClick,
  className = "",
}: CategoryBadgeProps) {
  const base = "inline-flex items-center rounded-full font-medium capitalize";
  const color = categoryColors[category];
  const sizeClass = sizeClasses[size];
  const interactive = clickable
    ? "cursor-pointer hover:opacity-80 transition-opacity"
    : "";

  if (clickable && onClick) {
    return (
      <button
        type="button"
        onClick={() => onClick(category)}
        className={`${base} ${color} ${sizeClass} ${interactive} ${className}`}
      >
        {category}
      </button>
    );
  }

  return (
    <span className={`${base} ${color} ${sizeClass} ${className}`}>
      {category}
    </span>
  );
}
