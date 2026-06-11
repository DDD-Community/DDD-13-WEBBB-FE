"use client";

import ArrowLeft from "@/assets/icons/ic_arrow_left.svg";
import CharacterLogin from "./character_login.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import LoginButton from "./LoginButton";
import TopBar from "@/components/TopBar";

export default function Login() {
  const router = useRouter();

  return (
    <>
      <TopBar
        leftContent={
          <button type="button" onClick={() => router.back()}>
            <ArrowLeft className="h-6 w-6" />
          </button>
        }
      />

      <div className="px-4">
        <Image src="/logo.svg" alt="서비스 로고" width={98} height={28} className="mx-auto" priority />

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
    </>
  );
}
