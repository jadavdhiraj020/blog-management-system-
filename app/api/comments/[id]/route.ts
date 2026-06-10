import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getCommentById, updateComment, deleteComment, getPostById } from "@/lib/data";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const comment = await getCommentById(id);
  if (!comment) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  }

  const body = await request.json();
  const updated = await updateComment(id, { approved: Boolean(body.approved) });

  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/comments");
  const post = await getPostById(comment.postId);
  if (post) {
    revalidatePath(`/blog/${post.slug}`);
  }

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const comment = await getCommentById(id);
  if (!comment) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  }

  const success = await deleteComment(id);
  if (!success) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  }

  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/comments");
  const post = await getPostById(comment.postId);
  if (post) {
    revalidatePath(`/blog/${post.slug}`);
  }

  return NextResponse.json({ message: "Comment deleted" });
}
