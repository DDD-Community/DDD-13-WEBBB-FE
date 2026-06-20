import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { backendUrl } from "@/lib/backend";
import { clearAuthCookies } from "@/lib/authCookies";
import { ACCESS_TOKEN_COOKIE } from "@/lib/cookieNames";
import type { ApiResponse } from "@/services/types";

export async function POST() {
  const store = await cookies();
  const accessToken = store.get(ACCESS_TOKEN_COOKIE)?.value;

  if (accessToken) {
    try {
      await fetch(backendUrl("/api/auth/logout"), {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      });
    } catch {
      //
    }
  }

  await clearAuthCookies();

  const payload: ApiResponse<null> = {
    success: true,
    message: "로그아웃되었습니다.",
    data: null,
    errors: null,
    timestamp: new Date().toISOString(),
  };
  return NextResponse.json(payload);
}
