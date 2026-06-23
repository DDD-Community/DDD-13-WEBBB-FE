import { NextResponse, type NextRequest } from "next/server";
import { exchangeOAuthCodeAndSetCookies } from "@/lib/backend";
import type { ApiResponse } from "@/services/types";

/**
 * OAuth 리다이렉트 콜백에서 받은 1회용 code 를 JWT 로 교환
 * 교환된 토큰은 httpOnly 쿠키로 저장되고, 사용자 정보(AuthUser)만 클라이언트로 반환
 */
export async function POST(req: NextRequest) {
  let code: unknown;

  try {
    ({ code } = (await req.json()) as { code?: unknown });
  } catch {
    code = undefined;
  }

  if (typeof code !== "string" || code.length === 0) {
    const payload: ApiResponse<null> = {
      success: false,
      message: "유효하지 않은 요청입니다.",
      data: null,
      errors: null,
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(payload, { status: 400 });
  }

  return exchangeOAuthCodeAndSetCookies(code);
}
