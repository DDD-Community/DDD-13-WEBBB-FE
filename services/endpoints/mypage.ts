import { http } from "@/services/client";
import type { CareerYearLabel, JobRoleLabel } from "@/const/map";
import type { CommentTone, CursorPage, EmotionType, MonsterStatus } from "@/services/types";

interface MyActivityParams {
  cursor?: number | null;
  size?: number;
}

export interface MyPostItem {
  postId: number;
  contentPreview: string;
  emotionType: EmotionType;
  monsterStatus: MonsterStatus;
  createdAt: string;
}

export interface MyPostResponse extends CursorPage {
  posts: MyPostItem[];
}

export interface MyCommentItem {
  commentId: number;
  postId: number;
  content: string;
  createdAt: string;
}

export interface MyCommentResponse extends CursorPage {
  comments: MyCommentItem[];
}

export interface MyLikedPostItem {
  postId: number;
  contentPreview: string;
  authorNickname: string;
  authorJobType: JobRoleLabel;
  authorCareerLevel: CareerYearLabel;
  emotionType: EmotionType;
  monsterStatus: MonsterStatus;
  currentHp: number;
  maxHp: number;
  likeCount: number;
  commentCount: number;
  commentTone: CommentTone;
  createdAt: string;
}

export interface MyLikedPostResponse extends CursorPage {
  posts: MyLikedPostItem[];
}

export interface MostFrequentEmotion {
  type: EmotionType;
  displayName: string;
  count: number;
  percentage: number;
}

export interface MonsterStatsResponse {
  totalMonsterCount: number;
  defeatedMonsterCount: number;
  mostFrequentEmotion: MostFrequentEmotion | null;
}

function activityPath(path: string, params: MyActivityParams = {}) {
  const searchParams = new URLSearchParams();

  if (params.cursor !== undefined && params.cursor !== null) {
    searchParams.set("cursor", String(params.cursor));
  }
  if (params.size !== undefined) {
    searchParams.set("size", String(params.size));
  }

  const query = searchParams.toString();
  return query ? `${path}?${query}` : path;
}

export const getMyPosts = (params?: MyActivityParams) =>
  http.get<MyPostResponse>(activityPath("/api/me/posts", params));

export const getMyComments = (params?: MyActivityParams) =>
  http.get<MyCommentResponse>(activityPath("/api/me/comments", params));

export const getMyLikedPosts = (params?: MyActivityParams) =>
  http.get<MyLikedPostResponse>(activityPath("/api/me/liked-posts", params));

export const getMonsterStats = () => http.get<MonsterStatsResponse>("/api/me/monster-stats");
