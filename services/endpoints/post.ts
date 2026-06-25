import { http } from "@/services/client";
import type { JobRole, CareerYear, CommentTone, MonsterStatus, PostOrder } from "@/services/types";

export interface PostAuthor {
  id: string;
  nickname: string;
  jobRole: JobRole;
  careerYear: CareerYear;
}

export interface PostEmotion {
  type: string;
  displayName: string;
  summary: string;
}

export interface PostMonster {
  type: string;
  hp: number;
  maxHp: number;
  status: MonsterStatus;
}

export interface PostComment {
  commentId: number;
  authorNickname: string;
  content: string;
  createdAt: string;
}

export interface PostDetail {
  postId: number;
  author: PostAuthor;
  content: string;
  commentTone: CommentTone;
  emotion: PostEmotion;
  monster: PostMonster;
  likeCount: number;
  likedByMe: boolean;
  commentCount: number;
  comments?: PostComment[];
  createdAt: string;
}

export interface PostListItem {
  postId: number;
  authorNickname: string;
  jobRole: JobRole;
  careerYear: CareerYear;
  contentPreview: string;
  emotionType: string;
  commentTone: CommentTone;
  monster: PostMonster;
  likeCount: number;
  likedByMe: boolean;
  commentCount: number;
  createdAt: string;
}

export interface PostLikeResponse {
  postId: number;
  likeCount: number;
  monster: {
    hp: number;
    maxHp: number;
    status: MonsterStatus;
  };
}

// POST /api/posts 및 PATCH /api/posts/{postId} 요청 바디
export interface PostSaveBody {
  content: string;
  commentTone: CommentTone;
}

// GET /api/posts 쿼리 파라미터
export interface GetPostsParams {
  cursor?: number | null;
  size?: number;
  order?: PostOrder;
  jobRole?: JobRole[];
  careerYear?: CareerYear[];
}

// GET /api/posts
export interface PostListResponse {
  posts: PostListItem[];
  nextCursor: number | null;
}

/** [POST] 게시글 작성 */
export const createPost = (body: PostSaveBody) => http.post<PostDetail>("/api/posts", body);

/** [GET] 게시글 목록 조회 */
export const getPosts = (params: GetPostsParams = {}) => {
  const queryParts: string[] = [];

  if (params.cursor !== undefined && params.cursor !== null) queryParts.push(`cursor=${params.cursor}`);
  if (params.size !== undefined) queryParts.push(`size=${params.size}`);
  if (params.order !== undefined) queryParts.push(`order=${encodeURIComponent(params.order)}`);

  if (params.jobRole && params.jobRole.length > 0) {
    params.jobRole.forEach((role) => queryParts.push(`jobRole=${encodeURIComponent(role)}`));
  }
  if (params.careerYear && params.careerYear.length > 0) {
    params.careerYear.forEach((year) => queryParts.push(`careerYear=${encodeURIComponent(year)}`));
  }

  const queryString = queryParts.length > 0 ? `?${queryParts.join("&")}` : "";
  return http.get<PostListResponse>(`/api/posts${queryString}`);
};

/** [GET] 게시글 상세 조회 */
export const getPostDetail = (postId: number) => http.get<PostDetail>(`/api/posts/${postId}`);

/** [POST] 게시글 좋아요 */
export const likePost = (postId: number) => http.post<PostLikeResponse>(`/api/posts/${postId}/likes`);

/** [DELETE] 게시글 좋아요 취소 */
export const unlikePost = (postId: number) => http.delete<PostLikeResponse>(`/api/posts/${postId}/likes/me`);

/** [PATCH] 게시글 수정 */
export const updatePost = (postId: number, body: PostSaveBody) => http.patch<PostDetail>(`/api/posts/${postId}`, body);

/** [DELETE] 게시글 삭제 */
export const deletePost = (postId: number) => http.delete<null>(`/api/posts/${postId}`);
