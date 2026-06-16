import { http } from "@/api/client";
import type { CareerYear, JobRole } from "@/api/types";

// 응답 DTO (백엔드 AuthResponse 와 일치) ──────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
  nickname: string | null;
  jobRole: JobRole | null;
  careerYear: CareerYear | null;
  status: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResult {
  user: AuthUser;
  tokens: AuthTokens;
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

export const loginEmail = (body: EmailLoginBody) =>
  http.post<AuthResult>("/api/auth/login/email", body, { auth: false });

export const signupEmail = (body: EmailSignupBody) =>
  http.post<AuthResult>("/api/auth/signup/email", body, { auth: false });

export const checkEmail = (email: string) =>
  http.get<{ available: boolean }>(`/api/auth/email/check?email=${encodeURIComponent(email)}`, {
    auth: false,
  });

export const logout = () => http.post<null>("/api/auth/logout");
