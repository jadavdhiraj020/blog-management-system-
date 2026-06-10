import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  getPosts,
  addPost,
  generateId,
  generateSlug,
  calculateReadingTime,
  isValidCategory,
} from "@/lib/data";
import { PostStatus } from "@/types/blog";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const tags = searchParams.get("tags");
  const authorId = searchParams.get("authorId");
  const slug = searchParams.get("slug");

  let posts = getPosts();

  if (slug) {
    const post = posts.find((p) => p.slug === slug);
    return post
      ? NextResponse.json(post)
      : NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  if (status && status !== "all") {
    posts = posts.filter((p) => p.status === status);
  }

  if (category && category !== "all") {
    posts = posts.filter((p) => p.category === category);
  }

  if (search) {
    const lower = search.toLowerCase();
    posts = posts.filter(
      (p) =>
        p.title.toLowerCase().includes(lower) ||
        p.excerpt.toLowerCase().includes(lower) ||
        p.content.toLowerCase().includes(lower)
    );
  }

  if (tags) {
    const tagList = tags.split(",").map((t) => t.trim().toLowerCase());
    posts = posts.filter((p) =>
      tagList.some((tag) => p.tags.map((t) => t.toLowerCase()).includes(tag))
    );
  }

  if (authorId) {
    posts = posts.filter((p) => p.authorId === authorId);
  }

  posts.sort((a, b) => {
    const dateA = a.publishedAt || a.createdAt;
    const dateB = b.publishedAt || b.createdAt;
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });

  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { title, excerpt, content, category, tags, status, authorId, coverImageUrl } = body;

  if (!title || typeof title !== "string" || title.length < 5) {
    return NextResponse.json(
      { error: "Title must be at least 5 characters" },
      { status: 400 }
    );
  }

  if (!excerpt || typeof excerpt !== "string") {
    return NextResponse.json(
      { error: "Excerpt is required" },
      { status: 400 }
    );
  }

  if (excerpt.length > 200) {
    return NextResponse.json(
      { error: "Excerpt must be at most 200 characters" },
      { status: 400 }
    );
  }

  if (!content || typeof content !== "string" || content.trim().length === 0) {
    return NextResponse.json(
      { error: "Content is required" },
      { status: 400 }
    );
  }

  if (!category || !isValidCategory(category)) {
    return NextResponse.json(
      { error: "Invalid category" },
      { status: 400 }
    );
  }

  const now = new Date().toISOString();
  const postStatus: PostStatus = status === "published" ? "published" : "draft";

  const newPost = {
    id: generateId(),
    title,
    slug: generateSlug(title, getPosts()),
    excerpt,
    content,
    category,
    tags: Array.isArray(tags) ? tags : [],
    status: postStatus,
    authorId: authorId || "",
    coverImageUrl: coverImageUrl || undefined,
    readingTimeMinutes: calculateReadingTime(content),
    viewCount: 0,
    publishedAt: postStatus === "published" ? now : undefined,
    createdAt: now,
    updatedAt: now,
  };

  addPost(newPost);
  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/posts");
  return NextResponse.json(newPost, { status: 201 });
}
