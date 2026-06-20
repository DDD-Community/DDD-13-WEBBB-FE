import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import type { AuthUser } from "@/services/endpoints/auth";
import type { ApiResponse } from "@/services/types";
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
