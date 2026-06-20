import { http } from "@/services/client";
import type { PostComment } from "@/services/endpoints/post";

export interface CommentCreateBody {
  content: string;
  parentCommentId?: number;
}

export const createComment = (postId: number, body: CommentCreateBody) =>
  http.post<PostComment>(`/api/posts/${postId}/comments`, body);
