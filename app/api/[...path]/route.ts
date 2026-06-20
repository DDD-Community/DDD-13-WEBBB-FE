import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { backendUrl, refreshWithCookie } from "@/lib/backend";
import { clearAuthCookies } from "@/lib/authCookies";
import { ACCESS_TOKEN_COOKIE } from "@/lib/cookieNames";

/**
 * /api/* 범용 프록시.
 * httpOnly access 쿠키를 Authorization 헤더로 변환해 백엔드로 전달하고,
 * 401 이면 refresh 1회 후 재시도
 */

// fetch 가 디코딩/관리하므로 그대로 전달하면 안 되는 헤더들
const STRIP_RESPONSE_HEADERS = new Set([
  "connection",
  "keep-alive",
  "transfer-encoding",
  "upgrade",
  "content-encoding",
  "content-length",
]);

type Ctx = { params: Promise<{ path: string[] }> };

async function handle(req: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;
  const backendPath = `/api/${path.join("/")}${req.nextUrl.search}`;

  // 재시도(refresh 후)를 위해 body 를 1번 버퍼링
  const hasBody = req.method !== "GET" && req.method !== "HEAD";
  const bodyBuffer = hasBody ? await req.arrayBuffer() : undefined;

  const contentType = req.headers.get("content-type");
  const accept = req.headers.get("accept");

  const callBackend = (token: string | undefined) => {
    const headers = new Headers();
    if (contentType) headers.set("content-type", contentType);
    if (accept) headers.set("accept", accept);
    if (token) headers.set("authorization", `Bearer ${token}`);

    return fetch(backendUrl(backendPath), {
      method: req.method,
      headers,
      body: bodyBuffer ? Buffer.from(bodyBuffer) : undefined,
      cache: "no-store",
      redirect: "manual",
    });
  };

  const store = await cookies();
  const accessToken = store.get(ACCESS_TOKEN_COOKIE)?.value;

  let res = await callBackend(accessToken);

  if (res.status === 401) {
    const refreshed = await refreshWithCookie();
    if (refreshed) {
      res = await callBackend(refreshed);
    } else {
      await clearAuthCookies();
    }
  }

  const headers = new Headers();
  res.headers.forEach((value, key) => {
    if (!STRIP_RESPONSE_HEADERS.has(key.toLowerCase())) headers.set(key, value);
  });

  const payload = await res.arrayBuffer();
  return new NextResponse(payload, { status: res.status, headers });
}

export const GET = handle;
export const POST = handle;
export const PATCH = handle;
export const DELETE = handle;
