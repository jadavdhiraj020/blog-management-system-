import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Post, PostFilters } from "@/types/blog";

interface PostState {
  posts: Post[];
  filters: PostFilters;
  selectedPost: Post | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialFilters: PostFilters = {
  status: "all",
  category: "all",
  search: "",
  tags: [],
  authorId: "",
};

const initialState: PostState = {
  posts: [],
  filters: initialFilters,
  selectedPost: null,
  status: "idle",
  error: null,
};

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const res = await fetch("/api/posts");
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json() as Promise<Post[]>;
});

export const createPost = createAsyncThunk(
  "posts/createPost",
  async (data: {
    title: string;
    excerpt: string;
    content: string;
    category: string;
    tags: string[];
    status: string;
    authorId: string;
    coverImageUrl?: string;
  }) => {
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to create post");
    }
    return res.json() as Promise<Post>;
  }
);

export const editPost = createAsyncThunk(
  "posts/editPost",
  async ({ id, data }: { id: string; data: Partial<Post> }) => {
    const res = await fetch(`/api/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to update post");
    }
    return res.json() as Promise<Post>;
  }
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (id: string) => {
    const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete post");
    return id;
  }
);

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPosts(state, action: PayloadAction<Post[]>) {
      state.posts = action.payload;
    },
    addPost(state, action: PayloadAction<Post>) {
      state.posts.unshift(action.payload);
    },
    updatePost(state, action: PayloadAction<Post>) {
      const index = state.posts.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) state.posts[index] = action.payload;
    },
    removePost(state, action: PayloadAction<string>) {
      state.posts = state.posts.filter((p) => p.id !== action.payload);
    },
    setFilters(state, action: PayloadAction<Partial<PostFilters>>) {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters(state) {
      state.filters = initialFilters;
    },
    setSelectedPost(state, action: PayloadAction<Post | null>) {
      state.selectedPost = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch posts";
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
      })
      .addCase(editPost.fulfilled, (state, action) => {
        const index = state.posts.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) state.posts[index] = action.payload;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((p) => p.id !== action.payload);
      });
  },
});

export const {
  setPosts,
  addPost: addPostAction,
  updatePost: updatePostAction,
  removePost,
  setFilters,
  clearFilters,
  setSelectedPost,
} = postSlice.actions;

export default postSlice.reducer;
