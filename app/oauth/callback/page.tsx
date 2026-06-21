"use client";

import { ApiError } from "@/services/client";
import { exchangeOAuthCode } from "@/services/endpoints/auth";
import Toast from "@/components/Toast";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/** 콜백 단계(provider 인증 실패 / code 누락)에서 보여줄 메시지를 담는 에러 */
class OAuthFlowError extends Error {}

export default function OAuthCallback() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [errorMessage, setErrorMessage] = useState("");
  // code 는 1회용 + 30초 TTL 이므로 (StrictMode 등) 중복 교환을 막는다.
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    // 성공: #code=..., 실패: ?error=...
    const code = new URLSearchParams(window.location.hash.slice(1)).get("code");
    const error = new URLSearchParams(window.location.search).get("error");

    Promise.resolve()
      .then(() => {
        if (error) throw new OAuthFlowError(decodeURIComponent(error));
        if (!code) throw new OAuthFlowError("로그인 정보를 확인할 수 없어요. 다시 시도해주세요.");
        return exchangeOAuthCode(code);
      })
      .then((user) => {
        setUser(user);
        // 직군/연차가 비어 있으면 첫 가입으로 보고 온보딩으로 보낸다.
        const needsOnboarding = user.jobRole === null || user.careerYear === null;
        router.replace(needsOnboarding ? "/onboarding" : "/home");
      })
      .catch((err) => {
        if (err instanceof OAuthFlowError || err instanceof ApiError) {
          setErrorMessage(err.message);
        } else {
          setErrorMessage("로그인에 실패했어요. 다시 시도해주세요.");
        }
      });
  }, [router, setUser]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-4">
      {errorMessage ? (
        <>
          <p className="text-body-15m text-center whitespace-pre-line text-gray-50">{errorMessage}</p>
          <Link href="/login" className="text-detail-13m text-gray-70 underline">
            로그인으로 돌아가기
          </Link>
        </>
      ) : (
        <p className="text-body-15m text-gray-50">로그인 처리 중...</p>
      )}

      <Toast message={errorMessage} isOpen={errorMessage.length > 0} onClose={() => setErrorMessage("")} />
    </div>
  );
}
