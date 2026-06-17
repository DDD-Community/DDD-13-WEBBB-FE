import { http } from "@/api/client";
import type { JobRole, CareerYear, CommentTone } from "@/api/types";

export interface PostCreateBody {
  content: string;
  commentTone: CommentTone;
}

export interface PostResponse {
  postId: number;
  author: {
    id: string;
    nickname: string;
    jobRole: JobRole;
    careerYear: CareerYear;
  };
  content: string;
  commentTone: CommentTone;
  emotion: {
    type: string;
    displayName: string;
    summary: string;
  };
  monster: {
    type: string;
    hp: number;
    maxHp: number;
    status: "ALIVE" | "DEAD";
  };
  likeCount: number;
  commentCount: number;
  createdAt: string;
}

export const createPost = (body: PostCreateBody) => http.post<PostResponse>("/api/posts", body);

export const deletePost = (postId: number) => http.delete<null>(`/api/posts/${postId}`);
