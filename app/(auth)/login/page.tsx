"use client";

import ArrowLeft from "@/assets/icons/ic_arrow_left.svg";
import CharacterLogin from "./character_login.svg";
import { useRouter } from "next/navigation";
import LoginButton from "./LoginButton";

export default function Login() {
  const router = useRouter();

  return (
    <div className="px-4">
      <div className="py-5">
        <button type="button" onClick={() => router.back()}>
          <ArrowLeft className="h-6 w-6" />
        </button>
      </div>

      <p className="text-head-13m mt-10 py-1.5 text-center">서비스 로고</p>

      <p className="text-head-22sb mt-8 text-center">
        로그인하고
        <br />
        모든 기능을 사용해보세요!
      </p>

      <CharacterLogin className="mx-auto mt-13 mb-15 h-48 w-46.5" />

      <div className="mb-12 flex flex-col gap-3">
        <LoginButton provider="naver" />
        <LoginButton provider="google" />
        <LoginButton provider="kakao" />
        <LoginButton provider="email" />
      </div>
    </div>
  );
}
