import { NextResponse, type NextRequest } from "next/server";
import { backendUrl } from "@/lib/backend";

/**
 * OAuth 리다이렉트 시작점
 * 같은 오리진(/api/auth/oauth/{provider}/authorize)으로 들어와 백엔드 OAuth 시작 URL로
 * 302 리다이렉트. API_ORIGIN 을 브라우저에 노출하지 않고 BFF 패턴을 유지하기 위함.
 * provider 는 소문자만 허용됨
 */

const SUPPORTED_PROVIDERS = ["google", "kakao", "naver"] as const;

type Provider = (typeof SUPPORTED_PROVIDERS)[number];

function isSupportedProvider(value: string): value is Provider {
  return (SUPPORTED_PROVIDERS as readonly string[]).includes(value);
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ provider: string }> }) {
  const { provider } = await ctx.params;

  if (!isSupportedProvider(provider)) {
    return NextResponse.redirect(new URL("/login", req.url), 302);
  }

  return NextResponse.redirect(backendUrl(`/oauth2/authorization/${provider}`), 302);
}
