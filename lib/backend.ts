import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import type { AuthUser } from "@/services/endpoints/auth";
import type { ApiResponse, CareerYear, JobRole } from "@/services/types";
import { REFRESH_TOKEN_COOKIE } from "./cookieNames";
import { setAuthCookies, type AuthTokens } from "./authCookies";

const API_ORIGIN = process.env.API_ORIGIN;

export function backendUrl(path: string) {
  return `${API_ORIGIN}${path}`;
}

interface BackendAuthResult {
  user: AuthUser;
  tokens: AuthTokens;
  isNewUser: boolean;
}

export interface AuthSuccess {
  user: AuthUser;
  isNewUser: boolean;
}

export async function forwardAuthAndSetCookies(req: NextRequest, backendPath: string) {
  const body = await req.text();
  const res = await fetch(backendUrl(backendPath), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    cache: "no-store",
  });

  const json = (await res.json()) as ApiResponse<BackendAuthResult>;

  if (!res.ok || !json.success) {
    return NextResponse.json(json, { status: res.status });
  }

  await setAuthCookies(json.data.tokens);

  const payload: ApiResponse<AuthSuccess> = {
    success: true,
    message: json.message,
    data: { user: json.data.user, isNewUser: json.data.isNewUser },
    errors: null,
    timestamp: json.timestamp,
  };
  return NextResponse.json(payload);
}

// /api/users/me 응답 DTO
// 필드명이 AuthResponse 와 다름(jobType/careerLevel, status 대신 isActive)
interface MeResult {
  id: string;
  email: string;
  nickname: string | null;
  jobType: JobRole | null;
  careerLevel: CareerYear | null;
  isActive: boolean;
  createdAt: string;
}

function meToAuthUser(me: MeResult): AuthUser {
  return {
    id: me.id,
    email: me.email,
    nickname: me.nickname,
    jobRole: me.jobType,
    careerYear: me.careerLevel,
    status: me.isActive ? "ACTIVE" : "INACTIVE",
  };
}

/**
 * OAuth 리다이렉트 방식의 1회용 code를 JWT로 교환하고 httpOnly 쿠키로 저장한 뒤,
 * /api/users/me 로 사용자 정보를 조회해 AuthUser 로 매핑해 돌려줌
 */
export async function exchangeOAuthCodeAndSetCookies(code: string) {
  const exchangeRes = await fetch(backendUrl("/api/auth/oauth/exchange"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
    cache: "no-store",
  });

  const exchangeJson = (await exchangeRes.json()) as ApiResponse<AuthTokens>;

  if (!exchangeRes.ok || !exchangeJson.success) {
    return NextResponse.json(exchangeJson, { status: exchangeRes.status });
  }

  await setAuthCookies(exchangeJson.data);

  const meRes = await fetch(backendUrl("/api/users/me"), {
    method: "GET",
    headers: { Authorization: `Bearer ${exchangeJson.data.accessToken}` },
    cache: "no-store",
  });

  const meJson = (await meRes.json()) as ApiResponse<MeResult>;

  if (!meRes.ok || !meJson.success) {
    return NextResponse.json(meJson, { status: meRes.status });
  }

  const payload: ApiResponse<AuthUser> = {
    success: true,
    message: meJson.message,
    data: meToAuthUser(meJson.data),
    errors: null,
    timestamp: meJson.timestamp,
  };
  return NextResponse.json(payload);
}

export async function refreshWithCookie(): Promise<string | null> {
  const store = await cookies();
  const refreshToken = store.get(REFRESH_TOKEN_COOKIE)?.value;
  if (!refreshToken) return null;

  const res = await fetch(backendUrl("/api/auth/refresh"), {
    method: "POST",
    headers: { Authorization: `Bearer ${refreshToken}` },
    cache: "no-store",
  });

  if (!res.ok) return null;

  const json = (await res.json()) as ApiResponse<AuthTokens>;
  if (!json.success || !json.data) return null;

  await setAuthCookies(json.data);
  return json.data.accessToken;
}
