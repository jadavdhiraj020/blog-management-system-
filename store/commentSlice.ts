import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Comment } from "@/types/blog";

interface CommentState {
  comments: Comment[];
  pendingCount: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CommentState = {
  comments: [],
  pendingCount: 0,
  status: "idle",
  error: null,
};

function computePendingCount(comments: Comment[]): number {
  return comments.filter((c) => !c.approved).length;
}

export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async (postId?: string) => {
    const url = postId ? `/api/comments?postId=${postId}` : "/api/comments";
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch comments");
    return res.json() as Promise<Comment[]>;
  }
);

export const submitComment = createAsyncThunk(
  "comments/submitComment",
  async (data: {
    postId: string;
    authorName: string;
    authorEmail: string;
    content: string;
  }) => {
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to submit comment");
    }
    return res.json() as Promise<Comment>;
  }
);

export const moderateComment = createAsyncThunk(
  "comments/moderateComment",
  async ({ id, approved }: { id: string; approved: boolean }) => {
    const res = await fetch(`/api/comments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approved }),
    });
    if (!res.ok) throw new Error("Failed to moderate comment");
    return res.json() as Promise<Comment>;
  }
);

export const deleteComment = createAsyncThunk(
  "comments/deleteComment",
  async (id: string) => {
    const res = await fetch(`/api/comments/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete comment");
    return id;
  }
);

const commentSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    setComments(state, action: PayloadAction<Comment[]>) {
      state.comments = action.payload;
      state.pendingCount = computePendingCount(action.payload);
    },
    addComment(state, action: PayloadAction<Comment>) {
      state.comments.push(action.payload);
      state.pendingCount = computePendingCount(state.comments);
    },
    updateComment(state, action: PayloadAction<Comment>) {
      const index = state.comments.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) state.comments[index] = action.payload;
      state.pendingCount = computePendingCount(state.comments);
    },
    removeComment(state, action: PayloadAction<string>) {
      state.comments = state.comments.filter((c) => c.id !== action.payload);
      state.pendingCount = computePendingCount(state.comments);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.comments = action.payload;
        state.pendingCount = computePendingCount(action.payload);
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch comments";
      })
      .addCase(submitComment.fulfilled, (state, action) => {
        state.comments.push(action.payload);
        state.pendingCount = computePendingCount(state.comments);
      })
      .addCase(moderateComment.fulfilled, (state, action) => {
        const index = state.comments.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) state.comments[index] = action.payload;
        state.pendingCount = computePendingCount(state.comments);
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter((c) => c.id !== action.payload);
        state.pendingCount = computePendingCount(state.comments);
      });
  },
});

export const {
  setComments,
  addComment: addCommentAction,
  updateComment: updateCommentAction,
  removeComment,
} = commentSlice.actions;

export default commentSlice.reducer;
