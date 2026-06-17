import { useAuthStore } from "@/store/useAuthStore";
import type { ApiFieldError, ApiResponse } from "./types";

// 비어 있으면 same-origin(/api) 로 요청 → next.config.ts 의 rewrite 가 백엔드로 프록시(CORS 회피).
// 절대 URL 을 직접 호출하고 싶으면 NEXT_PUBLIC_API_BASE_URL 에 오리진을 지정.
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

/** ApiResponse 실패(success=false) / 비-2xx 응답을 일관된 형태로 던지는 에러 */
export class ApiError extends Error {
  readonly status: number;
  readonly errors: ApiFieldError[] | null;

  constructor(status: number, message: string, errors: ApiFieldError[] | null = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  auth?: boolean; // Authorization 헤더 주입 여부 (기본 true). 공개 엔드포인트는 false.
  _retried?: boolean; // 401 → refresh 후 재시도까지 끝난 재호출인지 (무한루프 방지용 내부 플래그)
}

// 401 자동 refresh (single-flight)
// 동시에 여러 요청이 401 을 받아도 refresh 는 1번만 호출되도록 Promise 를 공유
let refreshPromise: Promise<boolean> | null = null;

async function refreshTokens(): Promise<boolean> {
  const refreshToken = useAuthStore.getState().refreshToken;
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
      method: "POST",
      headers: { Authorization: `Bearer ${refreshToken}` },
    });
    const body = (await res.json()) as ApiResponse<{ accessToken: string; refreshToken: string }>;
    if (!res.ok || !body.success) return false;

    useAuthStore.getState().setTokens(body.data);
    return true;
  } catch {
    return false;
  }
}

function ensureRefresh(): Promise<boolean> {
  refreshPromise ??= refreshTokens().finally(() => {
    refreshPromise = null;
  });
  return refreshPromise;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, auth = true, _retried = false } = options;

  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";

  if (auth) {
    const token = useAuthStore.getState().accessToken;
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  // 401 → refresh 1회 시도 후 원요청 재시도
  if (res.status === 401 && auth && !_retried) {
    const refreshed = await ensureRefresh();

    if (refreshed) {
      return request<T>(path, { ...options, _retried: true });
    }

    // refresh 실패 → 세션 종료
    useAuthStore.getState().clearAuth();

    if (typeof window !== "undefined") window.location.href = "/login";

    throw new ApiError(401, "세션이 만료되었습니다. 다시 로그인해주세요.");
  }

  // 204 No Content 등 바디 없는 응답
  if (res.status === 204) return undefined as T;

  const json = (await res.json()) as ApiResponse<T>;
  if (!res.ok || !json.success) {
    throw new ApiError(res.status, json.message ?? "요청에 실패했습니다.", json.errors);
  }

  return json.data;
}

/** 도메인 endpoints 에서 사용하는 편의 메서드. body 가 있는 메서드는 (path, body, options) 시그니처. */
export const http = {
  get: <T>(path: string, options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...options, method: "POST", body }),
  patch: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(path: string, options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...options, method: "DELETE" }),
};
