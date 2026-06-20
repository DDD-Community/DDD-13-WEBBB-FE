import type { NextRequest } from "next/server";
import { forwardAuthAndSetCookies } from "@/lib/backend";

export function POST(req: NextRequest) {
  return forwardAuthAndSetCookies(req, "/api/auth/signup/email");
}
