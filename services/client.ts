import { useAuthStore } from "@/store/useAuthStore";
import type { ApiFieldError, ApiResponse } from "./types";

// 비어 있으면 same-origin(/api) 로 요청 → app/api/[...path]/route.ts 프록시가 httpOnly 쿠키를
// Authorization 으로 변환해 백엔드로 전달하고 401 시 refresh 까지 처리
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
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body } = options;

  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    // same-origin 쿠키(httpOnly access/refresh)를 함께 전송
    credentials: "same-origin",
  });

  // 서버 프록시가 refresh 까지 시도했는데도 401 → 세션 종료
  if (res.status === 401) {
    if (typeof window !== "undefined") {
      useAuthStore.getState().clearAuth();
      window.location.href = "/login";
    }
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

/** 도메인 endpoints 에서 사용하는 편의 메서드. body 가 있는 메서드는 (path, body) 시그니처. */
export const http = {
  get: <T>(path: string) => request<T>(path, { method: "GET" }),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: "POST", body }),
  patch: <T>(path: string, body?: unknown) => request<T>(path, { method: "PATCH", body }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
