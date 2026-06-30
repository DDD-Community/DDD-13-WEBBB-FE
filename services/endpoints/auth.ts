import { http } from "@/services/client";
import type { CareerYear, JobRole } from "@/services/types";

// 응답 DTO (백엔드 AuthResponse 와 일치) ──────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
  nickname: string | null;
  jobRole: JobRole | null;
  careerYear: CareerYear | null;
  status: string;
}

export interface AuthSuccess {
  user: AuthUser;
  isNewUser: boolean;
}

// 요청 DTO ───────────────────────────────────────────────────────────

export interface EmailLoginBody {
  email: string;
  password: string;
}

export interface EmailSignupBody {
  email: string;
  password: string;
  nickname?: string;
  jobRole?: JobRole;
  careerYear?: CareerYear;
}

// 요청 함수 (순수, React 의존 없음) ──────────────────────────────────

const PUBLIC_AUTH_REQUEST = { redirectOnUnauthorized: false } as const;

export const loginEmail = (body: EmailLoginBody) =>
  http.post<AuthSuccess>("/api/auth/login/email", body, PUBLIC_AUTH_REQUEST);

export const signupEmail = (body: EmailSignupBody) =>
  http.post<AuthSuccess>("/api/auth/signup/email", body, PUBLIC_AUTH_REQUEST);

export const checkEmail = (email: string) =>
  http.get<{ available: boolean }>(`/api/auth/email/check?email=${encodeURIComponent(email)}`, PUBLIC_AUTH_REQUEST);

export const logout = () => http.post<null>("/api/auth/logout");

// OAuth(리다이렉트 방식) ─────────────────────────────────────────────

export type OAuthProvider = "google" | "kakao" | "naver";

/** 소셜 버튼 클릭 시 이동할 OAuth 시작 URL */
export const oauthAuthorizeUrl = (provider: OAuthProvider) => `/api/auth/oauth/${provider}/authorize`;

/** 콜백에서 받은 1회용 code 를 JWT 로 교환하고 사용자 정보를 받음 (토큰은 httpOnly 쿠키로 저장됨) */
export const exchangeOAuthCode = (code: string) =>
  http.post<AuthUser>("/api/auth/oauth/exchange", { code }, PUBLIC_AUTH_REQUEST);

export const requestPasswordReset = (email: string) =>
  http.post<null>("/api/auth/password-reset/request", { email }, PUBLIC_AUTH_REQUEST);

export const confirmPasswordReset = (email: string, code: string, newPassword: string) =>
  http.post<null>("/api/auth/password-reset/confirm", { email, code, newPassword }, PUBLIC_AUTH_REQUEST);
