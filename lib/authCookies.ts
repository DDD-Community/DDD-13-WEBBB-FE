import { cookies } from "next/headers";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "./cookieNames";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

const ACCESS_MAX_AGE = 60 * 30;
const REFRESH_MAX_AGE = 60 * 60 * 24 * 7;

const baseOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

/**
 * 토큰을 httpOnly persistent 쿠키로 저장.
 * maxAge 가 있으므로 브라우저 재시작에도 유지(자동 로그인).
 */
export async function setAuthCookies(tokens: AuthTokens) {
  const store = await cookies();
  store.set(ACCESS_TOKEN_COOKIE, tokens.accessToken, { ...baseOptions, maxAge: ACCESS_MAX_AGE });
  store.set(REFRESH_TOKEN_COOKIE, tokens.refreshToken, { ...baseOptions, maxAge: REFRESH_MAX_AGE });
}

export async function clearAuthCookies() {
  const store = await cookies();
  store.delete(ACCESS_TOKEN_COOKIE);
  store.delete(REFRESH_TOKEN_COOKIE);
}
