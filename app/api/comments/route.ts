import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getComments, addComment, generateId, getPostById } from "@/lib/data";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get("postId");
  const approved = searchParams.get("approved");

  let result = getComments();

  if (postId) {
    result = result.filter((c) => c.postId === postId);
  }

  if (approved !== null && approved !== undefined) {
    const isApproved = approved === "true";
    result = result.filter((c) => c.approved === isApproved);
  }

  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { postId, authorName, authorEmail, content } = body;

  if (!postId || !getPostById(postId)) {
    return NextResponse.json(
      { error: "Post not found" },
      { status: 400 }
    );
  }

  if (!authorName || typeof authorName !== "string" || authorName.trim().length === 0) {
    return NextResponse.json(
      { error: "Author name is required" },
      { status: 400 }
    );
  }

  if (!authorEmail || typeof authorEmail !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(authorEmail)) {
    return NextResponse.json(
      { error: "Valid email is required" },
      { status: 400 }
    );
  }

  if (!content || typeof content !== "string" || content.length < 5) {
    return NextResponse.json(
      { error: "Content must be at least 5 characters" },
      { status: 400 }
    );
  }

  const newComment = {
    id: generateId(),
    postId,
    authorName: authorName.trim(),
    authorEmail: authorEmail.trim(),
    content,
    approved: false,
    createdAt: new Date().toISOString(),
  };

  addComment(newComment);
  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/comments");
  const post = getPostById(postId);
  if (post) {
    revalidatePath(`/blog/${post.slug}`);
  }
  return NextResponse.json(newComment, { status: 201 });
}
