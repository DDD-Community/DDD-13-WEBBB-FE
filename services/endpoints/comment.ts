import { http } from "@/services/client";
import type { MonsterStatus } from "@/services/types";

export interface CommentCreateBody {
  content: string;
  parentCommentId?: number;
}

export interface CommentMonster {
  hp: number;
  maxHp: number;
  status: MonsterStatus;
}

export interface CommentCreateResponse {
  commentId: number;
  postId: number;
  parentCommentId: number | null;
  content: string;
  monster: CommentMonster;
  createdAt: string;
}

export interface CommentLikeResponse {
  commentId: number;
  likeCount: number;
  monster: CommentMonster;
}

export const createComment = (postId: number, body: CommentCreateBody) =>
  http.post<CommentCreateResponse>(`/api/posts/${postId}/comments`, body);

export const likeComment = (postId: number, commentId: number) =>
  http.post<CommentLikeResponse>(`/api/posts/${postId}/comments/${commentId}/likes`);

export const unlikeComment = (postId: number, commentId: number) =>
  http.delete<null>(`/api/posts/${postId}/comments/${commentId}/likes/me`);
