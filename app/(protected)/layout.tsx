"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);
  const hasHydrated = useAuthStore((s) => s._hasHydrated);

  useEffect(() => {
    // localStorage 복원이 끝난 뒤에 판정 (복원 전엔 토큰이 null 로 보이므로 대기)
    if (hasHydrated && !accessToken) {
      router.replace("/login");
    }
  }, [hasHydrated, accessToken, router]);

  // 복원 전 또는 미인증 상태에선 보호 화면을 렌더하지 않음 (깜빡임 방지)
  if (!hasHydrated || !accessToken) return null;

  return <>{children}</>;
}
