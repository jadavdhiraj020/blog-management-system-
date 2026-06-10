export type PostStatus = "draft" | "published" | "archived";

export type PostCategory =
  | "technology"
  | "design"
  | "business"
  | "lifestyle"
  | "tutorial"
  | "opinion"
  | "news";

export interface Author {
  id: string;
  name: string;
  email: string;
  bio?: string;
  avatarUrl?: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: PostCategory;
  tags: string[];
  status: PostStatus;
  authorId: string;
  coverImageUrl?: string;
  readingTimeMinutes: number;
  viewCount: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorName: string;
  authorEmail: string;
  content: string;
  approved: boolean;
  createdAt: string;
}

export interface PostFilters {
  status: PostStatus | "all";
  category: PostCategory | "all";
  search: string;
  tags: string[];
  authorId: string;
}

export interface BlogStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  totalComments: number;
  topPosts: Post[];
  byCategory: Record<PostCategory, number>;
}
