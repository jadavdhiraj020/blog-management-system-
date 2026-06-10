import { useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { moderateComment, deleteComment } from "@/store/commentSlice";
import { useAuthor } from "@/context/AuthorContext";
import { Comment } from "@/types/blog";

interface UseCommentModerationReturn {
  pendingComments: Comment[];
  approvedComments: Comment[];
  approveComment: (id: string) => void;
  rejectComment: (id: string) => void;
  pendingCount: number;
}

export function useCommentModeration(): UseCommentModerationReturn {
  const dispatch = useDispatch<AppDispatch>();
  const { currentAuthor } = useAuthor();
  const comments = useSelector((state: RootState) => state.comments.comments);
  const posts = useSelector((state: RootState) => state.posts.posts);

  const authorPostIds = useMemo(() => {
    if (!currentAuthor) return new Set<string>();
    return new Set(
      posts.filter((p) => p.authorId === currentAuthor.id).map((p) => p.id)
    );
  }, [posts, currentAuthor]);

  const filteredComments = useMemo(() => {
    if (!currentAuthor) return [];
    return comments.filter((c) => authorPostIds.has(c.postId));
  }, [comments, authorPostIds, currentAuthor]);

  const pendingComments = useMemo(
    () =>
      filteredComments
        .filter((c) => !c.approved)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
    [filteredComments]
  );

  const approvedComments = useMemo(
    () => filteredComments.filter((c) => c.approved),
    [filteredComments]
  );

  const approveComment = useCallback(
    (id: string) => {
      dispatch(moderateComment({ id, approved: true }));
    },
    [dispatch]
  );

  const rejectComment = useCallback(
    (id: string) => {
      dispatch(deleteComment(id));
    },
    [dispatch]
  );

  const pendingCount = pendingComments.length;

  return {
    pendingComments,
    approvedComments,
    approveComment,
    rejectComment,
    pendingCount,
  };
}
