import { NextResponse, type NextRequest } from "next/server";
import { REFRESH_TOKEN_COOKIE } from "@/lib/cookieNames";

/**
 * 서버 라우트 가드
 * 보호 경로에 세션(refresh) 쿠키 없이 접근하면 렌더 전에 /login 으로 리다이렉트
 * 토큰 유효성 자체는 데이터 호출(/api/* 프록시)이 401 → refresh 로 처리
 */
export function proxy(request: NextRequest) {
  const hasSession = request.cookies.has(REFRESH_TOKEN_COOKIE);

  if (!hasSession) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/write/:path*", "/onboarding/:path*"],
};
