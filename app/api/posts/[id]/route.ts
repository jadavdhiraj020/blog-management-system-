import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getPostById, updatePost, deletePost, calculateReadingTime } from "@/lib/data";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const track = searchParams.get("track");

  const post = getPostById(id);
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  if (track === "true") {
    updatePost(id, { viewCount: post.viewCount + 1 });
  }

  const updated = getPostById(id);
  return NextResponse.json(updated);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const post = getPostById(id);
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const authorCookie = request.cookies.get("blog_author");
  if (!authorCookie || post.authorId !== authorCookie.value) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await request.json();
  const updates: Record<string, unknown> = { ...body };

  if (body.content && typeof body.content === "string") {
    updates.readingTimeMinutes = calculateReadingTime(body.content);
  }

  if (
    body.status === "published" &&
    post.status !== "published" &&
    !post.publishedAt
  ) {
    updates.publishedAt = new Date().toISOString();
  }

  updates.updatedAt = new Date().toISOString();

  const updated = updatePost(id, updates);

  revalidatePath("/");
  revalidatePath(`/blog/${post.slug}`);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/posts");

  return NextResponse.json(updated);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const post = getPostById(id);
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const authorCookie = request.cookies.get("blog_author");
  if (!authorCookie || post.authorId !== authorCookie.value) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const success = deletePost(id);
  if (!success) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  revalidatePath("/");
  revalidatePath(`/blog/${post.slug}`);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/posts");
  revalidatePath("/dashboard/comments");

  return NextResponse.json({ message: "Post and associated comments deleted" });
}
